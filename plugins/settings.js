import isOwnerOrSudo, { cleanJid } from '../lib/isOwner.js';
import { getChatbot, getWelcome, getGoodbye, getAntitag } from '../lib/index.js';
import store from '../lib/lightweight_store.js';
export default {
    command: 'settings',
    aliases: ['config', 'setting'],
    category: 'owner',
    description: 'Show bot settings and per-group configurations',
    usage: '.settings',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        try {
            const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
            const isMe = message.key.fromMe;
            if (!isMe && !isOwner) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Access Denied:* Only Owner/Sudo can view settings.'
                }, { quoted: message });
            }
            const isGroup = chatId.endsWith('@g.us');
            const botMode = await store.getBotMode();
            const autoStatus = await store.getSetting('global', 'autoStatus') || { enabled: false };
            const autoread = await store.getSetting('global', 'autoread') || { enabled: false };
            const autotyping = await store.getSetting('global', 'autotyping') || { enabled: false };
            const pmblocker = await store.getSetting('global', 'pmblocker') || { enabled: false };
            const anticall = await store.getSetting('global', 'anticall') || { enabled: false };
            const autoReactionData = await store.getSetting('global', 'autoReaction');
            const mentionData = await store.getSetting('global', 'mention');
            const autoReaction = autoReactionData?.enabled || false;
            const stealthMode = await store.getSetting('global', 'stealthMode') || { enabled: false };
            const autoBio = await store.getSetting('global', 'autoBio') || { enabled: false };
            // cmdreact saves to userGroupData.json as data.autoReaction
            const fs = (await import('fs')).default;
            let cmdReactEnabled = true;
            try {
                const ugd = JSON.parse(fs.readFileSync('./data/userGroupData.json', 'utf-8'));
                cmdReactEnabled = ugd.autoReaction ?? true;
            }
            catch {
                cmdReactEnabled = true;
            }
            const getSt = (val) => val ? '✅' : '❌';
            let menuText = `╭━〔 *GAAJU CONFIG* 〕━┈\n┃\n`;
            menuText += `┃ 👤 *User:* @${cleanJid(senderId)}\n`;
            menuText += `┃ 🤖 *Mode:* ${botMode.toUpperCase()}\n`;
            menuText += `┃\n┣━〔 *XCHRIS CONFIG* 〕━┈\n`;
            menuText += `┃ ${getSt(autoStatus?.enabled)} *Auto Status*\n`;
            menuText += `┃ ${getSt(autoread?.enabled)} *Auto Read*\n`;
            menuText += `┃ ${getSt(autotyping?.enabled)} *Auto Typing*\n`;
            menuText += `┃ ${getSt(pmblocker?.enabled)} *PM Blocker*\n`;
            menuText += `┃ ${getSt(anticall?.enabled)} *Anti Call*\n`;
            menuText += `┃ ${getSt(autoReaction)} *Auto Reaction*\n`;
            menuText += `┃ ${getSt(cmdReactEnabled)} *Cmd Reactions*\n`;
            menuText += `┃ ${getSt(stealthMode?.enabled)} *Stealth Mode*\n`;
            menuText += `┃ ${getSt(autoBio?.enabled)} *Auto Bio*\n`;
            menuText += `┃ ${getSt(mentionData?.enabled)} *Mention Alert*\n`;
            menuText += `┃\n`;
            if (isGroup) {
                const groupSettings = await store.getAllSettings(chatId);
                const groupAntilink = groupSettings.antilink || { enabled: false };
                const groupBadword = groupSettings.antibadword || { enabled: false };
                const antitag = await getAntitag(chatId, 'on');
                const groupAntitag = { enabled: !!antitag };
                const chatbotData = await getChatbot(chatId);
                const welcomeData = await getWelcome(chatId);
                const goodbyeData = await getGoodbye(chatId);
                // getChatbot returns true/false or {enabled}
                const groupChatbot = chatbotData === true || chatbotData?.enabled || false;
                // getWelcome returns null or message string or {enabled}
                const groupWelcome = welcomeData !== null && welcomeData !== undefined && welcomeData !== false;
                // getGoodbye returns null or message string or {enabled}
                const groupGoodbye = goodbyeData !== null && goodbyeData !== undefined && goodbyeData !== false;
                menuText += `┣━〔 *GROUP CONFIG* 〕━┈\n`;
                menuText += `┃ ${getSt(groupAntilink.enabled)} *Antilink*\n`;
                menuText += `┃ ${getSt(groupBadword.enabled)} *Antibadword*\n`;
                menuText += `┃ ${getSt(groupAntitag.enabled)} *Antitag*\n`;
                menuText += `┃ ${getSt(groupChatbot)} *Chatbot*\n`;
                menuText += `┃ ${getSt(groupWelcome)} *Welcome*\n`;
                menuText += `┃ ${getSt(groupGoodbye)} *Goodbye*\n`;
            }
            else {
                menuText += `┃ 💡 *Note:* _Use in group for group configs._\n`;
            }
            menuText += `┃\n╰━━━━━━━━━━━━━━━━┈`;
            await sock.sendMessage(chatId, {
                text: menuText,
                mentions: [senderId],
                contextInfo: {
                    externalAdReply: {
                        title: "SYSTEM SETTINGS PANEL",
                        body: "Configuration Status",
                        thumbnailUrl: "https://github.com/Xchristech2.png",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: message });
        }
        catch (error) {
            console.error('Settings Command Error:', error);
            await sock.sendMessage(chatId, {
                text: '❌ Error: Failed to load settings.'
            }, { quoted: message });
        }
    }
};
