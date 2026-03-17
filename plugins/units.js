const UNITS = {
    length: {
        mm: { factor: 0.001, base: 'm', name: 'Millimeter' },
        cm: { factor: 0.01, base: 'm', name: 'Centimeter' },
        m: { factor: 1, base: 'm', name: 'Meter' },
        km: { factor: 1000, base: 'm', name: 'Kilometer' },
        in: { factor: 0.0254, base: 'm', name: 'Inch' },
        ft: { factor: 0.3048, base: 'm', name: 'Foot' },
        yd: { factor: 0.9144, base: 'm', name: 'Yard' },
        mi: { factor: 1609.344, base: 'm', name: 'Mile' },
        nmi: { factor: 1852, base: 'm', name: 'Nautical Mile' },
        ly: { factor: 9.461e15, base: 'm', name: 'Light Year' },
    },
    weight: {
        mg: { factor: 0.000001, base: 'kg', name: 'Milligram' },
        g: { factor: 0.001, base: 'kg', name: 'Gram' },
        kg: { factor: 1, base: 'kg', name: 'Kilogram' },
        t: { factor: 1000, base: 'kg', name: 'Metric Ton' },
        oz: { factor: 0.0283495, base: 'kg', name: 'Ounce' },
        lb: { factor: 0.453592, base: 'kg', name: 'Pound' },
        st: { factor: 6.35029, base: 'kg', name: 'Stone' },
    },
    temperature: {
        c: { factor: 1, offset: 0, base: 'c', name: 'Celsius' },
        f: { factor: 1, offset: 0, base: 'c', name: 'Fahrenheit' },
        k: { factor: 1, offset: 0, base: 'c', name: 'Kelvin' },
    },
    speed: {
        mps: { factor: 1, base: 'mps', name: 'Meters/sec' },
        kph: { factor: 0.277778, base: 'mps', name: 'Km/hour' },
        mph: { factor: 0.44704, base: 'mps', name: 'Miles/hour' },
        knot: { factor: 0.514444, base: 'mps', name: 'Knot' },
        fps: { factor: 0.3048, base: 'mps', name: 'Feet/sec' },
        mach: { factor: 343, base: 'mps', name: 'Mach' },
    },
    data: {
        bit: { factor: 1, base: 'bit', name: 'Bit' },
        byte: { factor: 8, base: 'bit', name: 'Byte' },
        kb: { factor: 8000, base: 'bit', name: 'Kilobyte' },
        mb: { factor: 8e6, base: 'bit', name: 'Megabyte' },
        gb: { factor: 8e9, base: 'bit', name: 'Gigabyte' },
        tb: { factor: 8e12, base: 'bit', name: 'Terabyte' },
        pb: { factor: 8e15, base: 'bit', name: 'Petabyte' },
        kib: { factor: 8192, base: 'bit', name: 'Kibibyte' },
        mib: { factor: 8388608, base: 'bit', name: 'Mebibyte' },
        gib: { factor: 8589934592, base: 'bit', name: 'Gibibyte' },
    },
    area: {
        mm2: { factor: 1e-6, base: 'm2', name: 'mm²' },
        cm2: { factor: 1e-4, base: 'm2', name: 'cm²' },
        m2: { factor: 1, base: 'm2', name: 'm²' },
        km2: { factor: 1e6, base: 'm2', name: 'km²' },
        in2: { factor: 0.00064516, base: 'm2', name: 'in²' },
        ft2: { factor: 0.092903, base: 'm2', name: 'ft²' },
        ac: { factor: 4046.86, base: 'm2', name: 'Acre' },
        ha: { factor: 10000, base: 'm2', name: 'Hectare' },
    },
    volume: {
        ml: { factor: 0.001, base: 'l', name: 'Milliliter' },
        l: { factor: 1, base: 'l', name: 'Liter' },
        m3: { factor: 1000, base: 'l', name: 'm³' },
        tsp: { factor: 0.00492892, base: 'l', name: 'Teaspoon' },
        tbsp: { factor: 0.0147868, base: 'l', name: 'Tablespoon' },
        floz: { factor: 0.0295735, base: 'l', name: 'Fl Ounce' },
        cup: { factor: 0.236588, base: 'l', name: 'Cup' },
        pt: { factor: 0.473176, base: 'l', name: 'Pint' },
        qt: { factor: 0.946353, base: 'l', name: 'Quart' },
        gal: { factor: 3.78541, base: 'l', name: 'Gallon (US)' },
    },
    time: {
        ms: { factor: 0.001, base: 's', name: 'Millisecond' },
        s: { factor: 1, base: 's', name: 'Second' },
        min: { factor: 60, base: 's', name: 'Minute' },
        hr: { factor: 3600, base: 's', name: 'Hour' },
        day: { factor: 86400, base: 's', name: 'Day' },
        wk: { factor: 604800, base: 's', name: 'Week' },
        mo: { factor: 2629800, base: 's', name: 'Month (avg)' },
        yr: { factor: 31557600, base: 's', name: 'Year' },
    },
    pressure: {
        pa: { factor: 1, base: 'pa', name: 'Pascal' },
        kpa: { factor: 1000, base: 'pa', name: 'Kilopascal' },
        mpa: { factor: 1e6, base: 'pa', name: 'Megapascal' },
        bar: { factor: 100000, base: 'pa', name: 'Bar' },
        atm: { factor: 101325, base: 'pa', name: 'Atmosphere' },
        psi: { factor: 6894.76, base: 'pa', name: 'PSI' },
        mmhg: { factor: 133.322, base: 'pa', name: 'mmHg / Torr' },
    },
    energy: {
        j: { factor: 1, base: 'j', name: 'Joule' },
        kj: { factor: 1000, base: 'j', name: 'Kilojoule' },
        cal: { factor: 4.184, base: 'j', name: 'Calorie' },
        kcal: { factor: 4184, base: 'j', name: 'Kilocalorie' },
        wh: { factor: 3600, base: 'j', name: 'Watt-hour' },
        kwh: { factor: 3.6e6, base: 'j', name: 'Kilowatt-hour' },
        btu: { factor: 1055.06, base: 'j', name: 'BTU' },
        ev: { factor: 1.602e-19, base: 'j', name: 'Electron Volt' },
    },
};
// Build reverse lookup: unit symbol → category
const UNIT_TO_CATEGORY = {};
for (const [cat, units] of Object.entries(UNITS)) {
    for (const sym of Object.keys(units)) {
        UNIT_TO_CATEGORY[sym] = cat;
    }
}
function convertTemperature(value, from, to) {
    // Convert to Celsius first
    let celsius;
    if (from === 'c')
        celsius = value;
    else if (from === 'f')
        celsius = (value - 32) * 5 / 9;
    else
        celsius = value - 273.15; // kelvin
    // Convert from Celsius to target
    if (to === 'c')
        return celsius;
    if (to === 'f')
        return celsius * 9 / 5 + 32;
    return celsius + 273.15; // kelvin
}
function convert(value, from, to) {
    from = from.toLowerCase();
    to = to.toLowerCase();
    const cat = UNIT_TO_CATEGORY[from];
    if (!cat || UNIT_TO_CATEGORY[to] !== cat)
        return null;
    if (cat === 'temperature') {
        return { result: convertTemperature(value, from, to), category: cat };
    }
    const fromUnit = UNITS[cat][from];
    const toUnit = UNITS[cat][to];
    const base = value * fromUnit.factor;
    const result = base / toUnit.factor;
    return { result, category: cat };
}
function formatNumber(n) {
    if (Math.abs(n) < 0.0001 || Math.abs(n) >= 1e12)
        return n.toExponential(4);
    const str = n.toPrecision(8).replace(/\.?0+$/, '');
    return str;
}
export default {
    command: 'units',
    aliases: ['convert', 'conv', 'unit'],
    category: 'utility',
    description: 'Convert between 100+ units — length, weight, speed, data, temperature and more',
    usage: '.units <value> <from> to <to>\nExample: .units 100 km to miles',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        const input = args.join(' ').trim().toLowerCase();
        if (!input) {
            return await sock.sendMessage(chatId, {
                text: `📏 *Unit Converter*\n\n` +
                    `*Usage:* \`.units <value> <from> to <to>\`\n\n` +
                    `*Examples:*\n` +
                    `• \`.units 100 km to mi\`\n` +
                    `• \`.units 70 kg to lb\`\n` +
                    `• \`.units 37 c to f\`\n` +
                    `• \`.units 1 gb to mb\`\n` +
                    `• \`.units 60 mph to kph\`\n` +
                    `• \`.units 1 yr to day\`\n` +
                    `• \`.units 1 atm to psi\`\n` +
                    `• \`.units 500 kcal to kj\`\n\n` +
                    `*Categories:*\n` +
                    `📐 length · ⚖️ weight · 🌡️ temperature\n` +
                    `💨 speed · 💾 data · 📦 volume\n` +
                    `🗺️ area · ⏱️ time · 🔋 energy · 🌬️ pressure`,
                ...channelInfo
            }, { quoted: message });
        }
        // Parse: <value> <from> to <to>   OR   <value> <from> <to>
        const toIndex = args.findIndex((a) => a.toLowerCase() === 'to');
        let value, fromUnit, toUnit;
        if (toIndex === 2 && args.length === 4) {
            value = parseFloat(args[0]);
            fromUnit = args[1].toLowerCase();
            toUnit = args[3].toLowerCase();
        }
        else if (args.length === 3 && toIndex === -1) {
            value = parseFloat(args[0]);
            fromUnit = args[1].toLowerCase();
            toUnit = args[2].toLowerCase();
        }
        else {
            return await sock.sendMessage(chatId, {
                text: `❌ Wrong format.\n\nUse: \`.units 100 km to mi\``,
                ...channelInfo
            }, { quoted: message });
        }
        if (isNaN(value)) {
            return await sock.sendMessage(chatId, {
                text: `❌ Invalid number: \`${args[0]}\``,
                ...channelInfo
            }, { quoted: message });
        }
        const res = convert(value, fromUnit, toUnit);
        if (!res) {
            const fromCat = UNIT_TO_CATEGORY[fromUnit];
            const toCat = UNIT_TO_CATEGORY[toUnit];
            if (!fromCat) {
                return await sock.sendMessage(chatId, {
                    text: `❌ Unknown unit: \`${fromUnit}\`\n\nUse \`.units\` to see all supported units.`,
                    ...channelInfo
                }, { quoted: message });
            }
            if (!toCat) {
                return await sock.sendMessage(chatId, {
                    text: `❌ Unknown unit: \`${toUnit}\``,
                    ...channelInfo
                }, { quoted: message });
            }
            return await sock.sendMessage(chatId, {
                text: `❌ Cannot convert *${fromUnit}* (${fromCat}) to *${toUnit}* (${toCat}) — different categories.`,
                ...channelInfo
            }, { quoted: message });
        }
        const fromName = UNITS[res.category][fromUnit].name;
        const toName = UNITS[res.category][toUnit].name;
        const catEmojis = {
            length: '📐', weight: '⚖️', temperature: '🌡️', speed: '💨',
            data: '💾', area: '🗺️', volume: '📦', time: '⏱️',
            pressure: '🌬️', energy: '🔋'
        };
        const emoji = catEmojis[res.category] || '📏';
        await sock.sendMessage(chatId, {
            text: `${emoji} *Unit Converter*\n\n` +
                `📥 *Input:* ${value} ${fromName} (${fromUnit})\n` +
                `📤 *Result:* ${formatNumber(res.result)} ${toName} (${toUnit})\n\n` +
                `📂 *Category:* ${res.category.charAt(0).toUpperCase() + res.category.slice(1)}`,
            ...channelInfo
        }, { quoted: message });
    }
};
