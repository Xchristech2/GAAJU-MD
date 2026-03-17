import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
const execAsync = promisify(exec);
export default {
    command: 'sysinfo',
    aliases: ['system', 'serverstats', 'serverinfo'],
    category: 'owner',
    description: 'Show detailed server system information',
    usage: '.sysinfo',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        try {
            // Memory via os module (works everywhere, no free command needed)
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const toMB = (b) => (b / 1024 / 1024).toFixed(0);
            const toGB = (b) => (b / 1024 / 1024 / 1024).toFixed(2);
            const memTotal = totalMem > 1073741824 ? `${toGB(totalMem) } GB` : `${toMB(totalMem) } MB`;
            const memUsed = usedMem > 1073741824 ? `${toGB(usedMem) } GB` : `${toMB(usedMem) } MB`;
            const memFree = freeMem > 1073741824 ? `${toGB(freeMem) } GB` : `${toMB(freeMem) } MB`;
            // Disk via df (fallback to N/A if not available)
            let diskTotal = 'N/A', diskUsed = 'N/A', diskFree = 'N/A', diskPct = 'N/A';
            try {
                const diskOut = (await execAsync('df -h /')).stdout.trim();
                const diskVals = diskOut.split('\n')[1]?.split(/\s+/) || [];
                diskTotal = diskVals[1] || 'N/A';
                diskUsed = diskVals[2] || 'N/A';
                diskFree = diskVals[3] || 'N/A';
                diskPct = diskVals[4] || 'N/A';
            }
            catch { }
            // Bot uptime (process uptime, not system uptime)
            const uptimeSec = Math.floor(process.uptime());
            const uptimeDays = Math.floor(uptimeSec / 86400);
            const uptimeHrs = Math.floor((uptimeSec % 86400) / 3600);
            const uptimeMins = Math.floor((uptimeSec % 3600) / 60);
            const uptimeSecs = uptimeSec % 60;
            const uptimeOut = uptimeDays > 0
                ? `${uptimeDays}d ${uptimeHrs}h ${uptimeMins}m`
                : uptimeHrs > 0
                    ? `${uptimeHrs}h ${uptimeMins}m ${uptimeSecs}s`
                    : `${uptimeMins}m ${uptimeSecs}s`;
            // CPU
            const cpus = os.cpus();
            const cpuModel = cpus[0]?.model?.trim() || 'Unknown';
            const cpuCores = cpus.length;
            const loadAvg = os.loadavg().map(l => l.toFixed(2)).join(', ');
            // Platform
            const platform = os.platform();
            const arch = os.arch();
            const nodeVer = process.version;
            const hostname = os.hostname();
            const text = `╔══════════════════════════════╗
║     🖥️  *SERVER STATS*        ║
╚══════════════════════════════╝

🏠 *Host:* ${hostname}
🐧 *OS:* ${platform} (${arch})
⏱️ *Uptime:* ${uptimeOut}
🟢 *Node.js:* ${nodeVer}

━━━━━━ 🧠 CPU ━━━━━━
🔧 *Model:* ${cpuModel}
⚙️ *Cores:* ${cpuCores}
📊 *Load Avg:* ${loadAvg}

━━━━━━ 💾 Memory ━━━━━━
📦 *Total:* ${memTotal}
🔴 *Used:* ${memUsed}
🟢 *Free:* ${memFree}

━━━━━━ 💿 Disk (/) ━━━━━━
📦 *Total:* ${diskTotal}
🔴 *Used:* ${diskUsed} (${diskPct})
🟢 *Free:* ${diskFree}`;
            await sock.sendMessage(chatId, {
                text,
                ...channelInfo
            }, { quoted: message });
        }
        catch (error) {
            await sock.sendMessage(chatId, {
                text: `❌ Failed to get system info: ${error.message}`,
                ...channelInfo
            }, { quoted: message });
        }
    }
};
