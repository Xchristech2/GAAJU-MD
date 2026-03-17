import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
const execAsync = promisify(exec);
export default {
    command: 'siminfo',
    aliases: ['phoneinfo', 'numinfo', 'carrier', 'phinfo'],
    category: 'utility',
    description: 'Lookup phone number country, carrier and type',
    usage: '.siminfo <phone number with country code>\nExample: .siminfo +234001234567',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        const input = args.join('').trim().replace(/\s+/g, '');
        if (!input) {
            return await sock.sendMessage(chatId, {
                text: `📱 *SIM / Phone Info*\n\n` +
                    `*Usage:* \`.siminfo <number>\`\n\n` +
                    `*Examples:*\n` +
                    `• \`.siminfo +234001234567\` — Nigeria\n` +
                    `• \`.siminfo +14155552671\` — USA\n` +
                    `• \`.siminfo +447911123456\` — UK\n` +
                    `• \`.siminfo +971501234567\` — UAE\n\n` +
                    `ℹ️ Include country code with or without +`,
                ...channelInfo
            }, { quoted: message });
        }
        try {
            const scriptPath = path.join(process.cwd(), 'lib', 'siminfo.py');
            const { stdout } = await execAsync(`python3 "${scriptPath}" "${input}"`, { timeout: 10000 });
            const data = JSON.parse(stdout.trim());
            if (data.error) {
                return await sock.sendMessage(chatId, {
                    text: `❌ ${data.error}`,
                    ...channelInfo
                }, { quoted: message });
            }
            const validIcon = data.valid ? '✅' : '⚠️';
            const carrierLine = data.carrier !== 'Unknown' ? `\n📶 *Carrier:* ${data.carrier}` : '';
            await sock.sendMessage(chatId, {
                text: `📱 *Phone Number Info*\n\n` +
                    `🔢 *Number:* ${data.number}\n` +
                    `${data.flag} *Country:* ${data.country}\n` +
                    `🌍 *Region:* ${data.region}\n` +
                    `🏷️ *Country Code:* ${data.country_code}\n` +
                    `📞 *National Number:* ${data.national_number}\n` +
                    `📡 *Line Type:* ${data.line_type}` +
                    `${carrierLine}\n` +
                    `${validIcon} *Valid:* ${data.valid ? 'Yes' : 'Possibly invalid (check length)'}`,
                ...channelInfo
            }, { quoted: message });
        }
        catch (error) {
            await sock.sendMessage(chatId, {
                text: `❌ Lookup failed: ${error.message}`,
                ...channelInfo
            }, { quoted: message });
        }
    }
};
