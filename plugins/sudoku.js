import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
const execAsync = promisify(exec);
export default {
    command: 'sudoku',
    aliases: ['sudokugen', 'sudokusolve', 'sdk'],
    category: 'utility',
    description: 'Generate Sudoku puzzles or solve them',
    usage: '.sudoku generate [easy|medium|hard]\n.sudoku solve <81 digits, 0 for empty>',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        const scriptPath = path.join(process.cwd(), 'lib', 'sudoku.py');
        if (!args.length || args[0] === 'help') {
            return await sock.sendMessage(chatId, {
                text: `🧩 *Sudoku*\n\n` +
                    `*Generate a puzzle:*\n` +
                    `\`.sudoku generate easy\`\n` +
                    `\`.sudoku generate medium\`\n` +
                    `\`.sudoku generate hard\`\n\n` +
                    `*Solve a puzzle:*\n` +
                    `\`.sudoku solve 530070000600195000098000060800060003400803001700020006060000280000419005000080079\`\n\n` +
                    `ℹ️ For solve: send 81 digits, use 0 for empty cells`,
                ...channelInfo
            }, { quoted: message });
        }
        const subCmd = args[0].toLowerCase();
        if (subCmd === 'generate') {
            const difficulty = (args[1] || 'medium').toLowerCase();
            if (!['easy', 'medium', 'hard'].includes(difficulty)) {
                return await sock.sendMessage(chatId, {
                    text: `❌ Invalid difficulty. Use: \`easy\`, \`medium\`, or \`hard\``,
                    ...channelInfo
                }, { quoted: message });
            }
            await sock.sendMessage(chatId, {
                text: `🧩 Generating ${difficulty} puzzle...`,
                ...channelInfo
            }, { quoted: message });
            try {
                const { stdout } = await execAsync(`python3 "${scriptPath}" generate ${difficulty}`, { timeout: 30000 });
                const data = JSON.parse(stdout.trim());
                if (data.error) {
                    return await sock.sendMessage(chatId, {
                        text: `❌ ${data.error}`,
                        ...channelInfo
                    }, { quoted: message });
                }
                const diffEmoji = { easy: '🟢', medium: '🟡', hard: '🔴' };
                await sock.sendMessage(chatId, {
                    text: `🧩 *Sudoku — ${diffEmoji[difficulty]} ${difficulty.toUpperCase()}*\n` +
                        `📊 *Clues:* ${data.clues}/81\n\n` +
                        `*Puzzle:*\n\`\`\`\n${data.formatted_puzzle}\n\`\`\`\n\n` +
                        `*Puzzle code (to solve later):*\n\`${data.puzzle}\`\n\n` +
                        `_Use \`.sudoku solve ${data.puzzle}\` to reveal solution_`,
                    ...channelInfo
                }, { quoted: message });
            }
            catch (error) {
                await sock.sendMessage(chatId, {
                    text: `❌ Failed to generate: ${error.message}`,
                    ...channelInfo
                }, { quoted: message });
            }
        }
        else if (subCmd === 'solve') {
            const grid = args[1]?.trim();
            if (!grid) {
                return await sock.sendMessage(chatId, {
                    text: `❌ Provide a puzzle code (81 digits, 0 = empty)\n\nExample:\n\`.sudoku solve 530070000600195000...\``,
                    ...channelInfo
                }, { quoted: message });
            }
            if (!/^[0-9]{81}$/.test(grid)) {
                return await sock.sendMessage(chatId, {
                    text: `❌ Puzzle must be exactly 81 digits (0-9). Got ${grid.length} characters.`,
                    ...channelInfo
                }, { quoted: message });
            }
            await sock.sendMessage(chatId, {
                text: `🔍 Solving puzzle...`,
                ...channelInfo
            }, { quoted: message });
            try {
                const { stdout } = await execAsync(`python3 "${scriptPath}" solve ${grid}`, { timeout: 30000 });
                const data = JSON.parse(stdout.trim());
                if (data.error) {
                    return await sock.sendMessage(chatId, {
                        text: `❌ ${data.error}`,
                        ...channelInfo
                    }, { quoted: message });
                }
                await sock.sendMessage(chatId, {
                    text: `🧩 *Sudoku Solved!*\n` +
                        `✅ *Filled:* ${data.filled} empty cells\n\n` +
                        `*Puzzle:*\n\`\`\`\n${data.formatted_puzzle}\n\`\`\`\n\n` +
                        `*Solution:*\n\`\`\`\n${data.formatted_solution}\n\`\`\``,
                    ...channelInfo
                }, { quoted: message });
            }
            catch (error) {
                await sock.sendMessage(chatId, {
                    text: `❌ Failed to solve: ${error.message}`,
                    ...channelInfo
                }, { quoted: message });
            }
        }
        else {
            await sock.sendMessage(chatId, {
                text: `❌ Unknown subcommand: *${subCmd}*\nUse \`generate\` or \`solve\``,
                ...channelInfo
            }, { quoted: message });
        }
    }
};
