import axios from 'axios';
const BASE = 'https://api.alquran.cloud/v1';
const SURAH_NAMES = {
    1: 'Al-Fatihah', 2: 'Al-Baqarah', 3: 'Ali Imran', 4: 'An-Nisa', 5: 'Al-Maidah',
    6: 'Al-Anam', 7: 'Al-Araf', 8: 'Al-Anfal', 9: 'At-Tawbah', 10: 'Yunus',
    11: 'Hud', 12: 'Yusuf', 13: 'Ar-Rad', 14: 'Ibrahim', 15: 'Al-Hijr',
    16: 'An-Nahl', 17: 'Al-Isra', 18: 'Al-Kahf', 19: 'Maryam', 20: 'Ta-Ha',
    21: 'Al-Anbiya', 22: 'Al-Hajj', 23: 'Al-Muminun', 24: 'An-Nur', 25: 'Al-Furqan',
    26: 'Ash-Shuara', 27: 'An-Naml', 28: 'Al-Qasas', 29: 'Al-Ankabut', 30: 'Ar-Rum',
    31: 'Luqman', 32: 'As-Sajdah', 33: 'Al-Ahzab', 34: 'Saba', 35: 'Fatir',
    36: 'Ya-Sin', 37: 'As-Saffat', 38: 'Sad', 39: 'Az-Zumar', 40: 'Ghafir',
    41: 'Fussilat', 42: 'Ash-Shura', 43: 'Az-Zukhruf', 44: 'Ad-Dukhan', 45: 'Al-Jathiyah',
    46: 'Al-Ahqaf', 47: 'Muhammad', 48: 'Al-Fath', 49: 'Al-Hujurat', 50: 'Qaf',
    51: 'Adh-Dhariyat', 52: 'At-Tur', 53: 'An-Najm', 54: 'Al-Qamar', 55: 'Ar-Rahman',
    56: 'Al-Waqiah', 57: 'Al-Hadid', 58: 'Al-Mujadila', 59: 'Al-Hashr', 60: 'Al-Mumtahanah',
    61: 'As-Saf', 62: 'Al-Jumuah', 63: 'Al-Munafiqun', 64: 'At-Taghabun', 65: 'At-Talaq',
    66: 'At-Tahrim', 67: 'Al-Mulk', 68: 'Al-Qalam', 69: 'Al-Haqqah', 70: 'Al-Maarij',
    71: 'Nuh', 72: 'Al-Jinn', 73: 'Al-Muzzammil', 74: 'Al-Muddaththir', 75: 'Al-Qiyamah',
    76: 'Al-Insan', 77: 'Al-Mursalat', 78: 'An-Naba', 79: 'An-Naziat', 80: 'Abasa',
    81: 'At-Takwir', 82: 'Al-Infitar', 83: 'Al-Mutaffifin', 84: 'Al-Inshiqaq', 85: 'Al-Buruj',
    86: 'At-Tariq', 87: 'Al-Ala', 88: 'Al-Ghashiyah', 89: 'Al-Fajr', 90: 'Al-Balad',
    91: 'Ash-Shams', 92: 'Al-Layl', 93: 'Ad-Duha', 94: 'Ash-Sharh', 95: 'At-Tin',
    96: 'Al-Alaq', 97: 'Al-Qadr', 98: 'Al-Bayyinah', 99: 'Az-Zalzalah', 100: 'Al-Adiyat',
    101: 'Al-Qariah', 102: 'At-Takathur', 103: 'Al-Asr', 104: 'Al-Humazah', 105: 'Al-Fil',
    106: 'Quraysh', 107: 'Al-Maun', 108: 'Al-Kawthar', 109: 'Al-Kafirun', 110: 'An-Nasr',
    111: 'Al-Masad', 112: 'Al-Ikhlas', 113: 'Al-Falaq', 114: 'An-Nas'
};
export default {
    command: 'quran',
    aliases: ['quranverse', 'ayah', 'surah'],
    category: 'info',
    description: 'Search Quran verses by surah:ayah or keyword',
    usage: '.quran 1:1\n.quran 2:255\n.quran mercy',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        const input = args.join(' ').trim();
        if (!input) {
            return await sock.sendMessage(chatId, {
                text: `📖 *Quran*\n\n` +
                    `*By Surah:Ayah:*\n` +
                    `\`.quran 1:1\` — Al-Fatihah, verse 1\n` +
                    `\`.quran 2:255\` — Ayat Al-Kursi\n` +
                    `\`.quran 36:1\` — Ya-Sin, verse 1\n\n` +
                    `*By keyword:*\n` +
                    `\`.quran mercy\`\n` +
                    `\`.quran patience\`\n` +
                    `\`.quran paradise\`\n\n` +
                    `*Full Surah:*\n` +
                    `\`.surah 1\` — Al-Fatihah\n` +
                    `\`.surah 112\` — Al-Ikhlas`,
                ...channelInfo
            }, { quoted: message });
        }
        try {
            // Check if surah:ayah format
            if (/^\d+:\d+$/.test(input)) {
                const [surah, ayah] = input.split(':');
                const [arRes, enRes] = await Promise.all([
                    axios.get(`${BASE}/ayah/${input}/quran-uthmani`),
                    axios.get(`${BASE}/ayah/${input}/en.asad`)
                ]);
                const ar = arRes.data.data;
                const en = enRes.data.data;
                const surahName = SURAH_NAMES[parseInt(surah, 10)] || ar.surah?.englishName;
                await sock.sendMessage(chatId, {
                    text: `📖 *Surah ${surahName} — Ayah ${ayah}*\n\n` +
                        `*Arabic:*\n${ar.text}\n\n` +
                        `*Translation (Asad):*\n_${en.text}_\n\n` +
                        `📍 Surah: ${surah} | Ayah: ${ayah} | Juz: ${ar.juz} | Page: ${ar.page}`,
                    ...channelInfo
                }, { quoted: message });
            }
            else if (/^\d+$/.test(input) || input.toLowerCase().startsWith('surah')) {
                // Full surah
                const num = input.replace(/[^0-9]/g, '') || '1';
                const res = await axios.get(`${BASE}/surah/${num}/en.asad`);
                const data = res.data.data;
                const arRes = await axios.get(`${BASE}/surah/${num}/quran-uthmani`);
                const arData = arRes.data.data;
                const verses = data.ayahs.slice(0, 7).map((a, i) => `*${i + 1}.* ${arData.ayahs[i]?.text || ''}\n_${a.text}_`).join('\n\n');
                await sock.sendMessage(chatId, {
                    text: `📖 *Surah ${data.englishName} (${data.name})*\n` +
                        `_${data.englishNameTranslation}_ — ${data.numberOfAyahs} verses — ${data.revelationType}\n\n` +
                        `${verses}\n\n` +
                        `_Showing first 7 of ${data.numberOfAyahs} verses_\n` +
                        `Use \`.quran ${num}:8\` for more`,
                    ...channelInfo
                }, { quoted: message });
            }
            else {
                // Keyword search
                const res = await axios.get(`${BASE}/search/${encodeURIComponent(input)}/all/en`);
                const matches = res.data.data?.matches || [];
                if (!matches.length) {
                    return await sock.sendMessage(chatId, {
                        text: `❌ No verses found for: *${input}*`,
                        ...channelInfo
                    }, { quoted: message });
                }
                const top = matches.slice(0, 5);
                const results = top.map((m) => {
                    const surahName = SURAH_NAMES[m.surah?.number] || m.surah?.englishName;
                    return `📍 *${surahName} ${m.surah?.number}:${m.numberInSurah}*\n_${m.text}_`;
                }).join('\n\n');
                await sock.sendMessage(chatId, {
                    text: `📖 *Quran Search: "${input}"*\n` +
                        `Found ${matches.length} results (showing top 5)\n\n${ 
                        results}`,
                    ...channelInfo
                }, { quoted: message });
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
