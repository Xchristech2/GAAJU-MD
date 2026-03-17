import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
const execAsync = promisify(exec);
function getQuoted(message) {
    return message?.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
}
function getMediaType(quoted) {
    if (quoted?.imageMessage)
        return 'image';
    if (quoted?.videoMessage)
        return 'video';
    if (quoted?.audioMessage)
        return 'audio';
    if (quoted?.documentMessage)
        return 'document';
    if (quoted?.stickerMessage)
        return 'sticker';
    return null;
}
export default {
    command: 'rle',
    aliases: ['compress', 'decompress', 'rlecompress'],
    category: 'utility',
    description: 'Compress or decompress text/files using Run-Length Encoding (C++ powered)',
    usage: '.rle compress <text or reply to media>\n.rle decompress <encoded or reply to compressed file>',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        const quoted = getQuoted(message);
        const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text || '';
        const mediaType = getMediaType(quoted);
        if (!args.length) {
            return await sock.sendMessage(chatId, {
                text: `🗜️ *RLE Compressor*\n\n` +
                    `*Text:*\n` +
                    `\`.rle compress AAABBBCCDDDD\`\n` +
                    `\`.rle decompress <encoded>\`\n\n` +
                    `*File/Media (reply to any file or media):*\n` +
                    `\`.rle compress\` — reply to image/video/audio/doc\n` +
                    `\`.rle decompress\` — reply to .rle compressed file\n\n` +
                    `⚠️ RLE works best on data with repeated bytes.\n` +
                    `For photos/videos, compression may increase size.`,
                ...channelInfo
            }, { quoted: message });
        }
        const mode = args[0]?.toLowerCase();
        if (mode !== 'compress' && mode !== 'decompress') {
            return await sock.sendMessage(chatId, {
                text: `❌ Use \`compress\` or \`decompress\``,
                ...channelInfo
            }, { quoted: message });
        }
        const binPath = path.join(process.cwd(), 'lib', 'bin', 'rle');
        if (!fs.existsSync(binPath)) {
            return await sock.sendMessage(chatId, {
                text: `❌ RLE binary not available on this server (g++ not installed).`,
                ...channelInfo
            }, { quoted: message });
        }
        const tempDir = path.join(process.cwd(), 'temp');
        fs.mkdirSync(tempDir, { recursive: true });
        const id = Date.now();
        try {
            if (mode === 'compress') {
                let inputBuffer;
                let sourceLabel;
                let originalName = `file_${id}`;
                if (mediaType && quoted) {
                    await sock.sendMessage(chatId, { text: '⏳ Downloading media...', ...channelInfo }, { quoted: message });
                    const msgObj = { message: { [`${mediaType}Message`]: quoted[`${mediaType}Message`] } };
                    inputBuffer = await downloadMediaMessage(msgObj, 'buffer', {});
                    sourceLabel = `${mediaType} (${inputBuffer.length.toLocaleString()} bytes)`;
                    originalName = `${mediaType}_${id}`;
                }
                else {
                    const textInput = args.slice(1).join(' ').trim() || quotedText;
                    if (!textInput) {
                        return await sock.sendMessage(chatId, {
                            text: `❌ No input. Provide text or reply to a media message.`,
                            ...channelInfo
                        }, { quoted: message });
                    }
                    inputBuffer = Buffer.from(textInput, 'utf8');
                    sourceLabel = `text (${inputBuffer.length} bytes)`;
                }
                const inFile = path.join(tempDir, `rle_in_${id}`);
                const outFile = path.join(tempDir, `rle_out_${id}.rle`);
                fs.writeFileSync(inFile, inputBuffer);
                await sock.sendMessage(chatId, { text: '🗜️ Compressing...', ...channelInfo }, { quoted: message });
                const { stdout, stderr } = await execAsync(`"${binPath}" compress file "${inFile}"`, { timeout: 60000, maxBuffer: 100 * 1024 * 1024 });
                const result = stdout.trim();
                fs.writeFileSync(outFile, result);
                // Parse stats
                let statsLine = '';
                if (stderr) {
                    const match = stderr.match(/STATS\|original=(\d+)\|compressed=(\d+)\|ratio=(-?\d+)%/);
                    if (match) {
                        const orig = parseInt(match[1], 10);
                        const comp = result.length;
                        const saved = orig - comp;
                        const pct = ((1 - comp / orig) * 100).toFixed(1);
                        statsLine = saved > 0
                            ? `\n💾 Saved: ${Math.abs(saved).toLocaleString()} bytes (${pct}%)`
                            : `\n⚠️ File grew by ${Math.abs(saved).toLocaleString()} bytes (RLE not ideal for this data)`;
                    }
                }
                await sock.sendMessage(chatId, {
                    document: fs.readFileSync(outFile),
                    mimetype: 'application/octet-stream',
                    fileName: `${originalName}.rle`,
                    caption: `🗜️ *RLE Compressed*\n\n` +
                        `📥 *Source:* ${sourceLabel}${statsLine}\n\n` +
                        `_Reply with \`.rle decompress\` to restore_`,
                    ...channelInfo
                }, { quoted: message });
                for (const f of [inFile, outFile])
                    try {
                        fs.unlinkSync(f);
                    }
                    catch { }
            }
            else {
                // DECOMPRESS
                let encodedData;
                if (quoted?.documentMessage) {
                    await sock.sendMessage(chatId, { text: '⏳ Reading compressed file...', ...channelInfo }, { quoted: message });
                    const msgObj = { message: { documentMessage: quoted.documentMessage } };
                    const buf = await downloadMediaMessage(msgObj, 'buffer', {});
                    encodedData = buf.toString('utf8').trim();
                }
                else {
                    encodedData = args.slice(1).join(' ').trim() || quotedText;
                }
                if (!encodedData) {
                    return await sock.sendMessage(chatId, {
                        text: `❌ No compressed input. Reply to an .rle file or provide encoded text.`,
                        ...channelInfo
                    }, { quoted: message });
                }
                await sock.sendMessage(chatId, { text: '📦 Decompressing...', ...channelInfo }, { quoted: message });
                const inFile = path.join(tempDir, `rle_dec_in_${id}.txt`);
                fs.writeFileSync(inFile, encodedData);
                const { stdout, stderr } = await execAsync(`"${binPath}" decompress text "${encodedData.replace(/"/g, '\\"')}"`, { timeout: 60000, maxBuffer: 100 * 1024 * 1024 });
                if (stderr && !stdout) {
                    return await sock.sendMessage(chatId, { text: `❌ ${stderr.trim()}`, ...channelInfo }, { quoted: message });
                }
                const result = stdout;
                const resultBuf = Buffer.from(result);
                const outFile = path.join(tempDir, `rle_decompressed_${id}`);
                fs.writeFileSync(outFile, resultBuf);
                if (result.length > 800 || resultBuf.some((b) => b < 9 || (b > 13 && b < 32))) {
                    // Binary or long — send as file
                    await sock.sendMessage(chatId, {
                        document: resultBuf,
                        mimetype: 'application/octet-stream',
                        fileName: `rle_decompressed_${id}`,
                        caption: `📦 *RLE Decompressed*\n\n📤 *Size:* ${resultBuf.length.toLocaleString()} bytes`,
                        ...channelInfo
                    }, { quoted: message });
                }
                else {
                    await sock.sendMessage(chatId, {
                        text: `📦 *RLE Decompressed*\n\n\`\`\`\n${result.trim()}\n\`\`\``,
                        ...channelInfo
                    }, { quoted: message });
                }
                for (const f of [inFile, outFile])
                    try {
                        fs.unlinkSync(f);
                    }
                    catch { }
            }
        }
        catch (error) {
            await sock.sendMessage(chatId, {
                text: `❌ Failed: ${error.message}`,
                ...channelInfo
            }, { quoted: message });
        }
    }
};
