const math = require('mathjs');

function binomPmf(k, n, p) {
    // Calculate the binomial coefficient
    const binomCoeff = math.combinations(n, k);
    // Calculate the probability mass function
    return binomCoeff * (p ** k) * ((1 - p) ** (n - k));
}

function binomPpf(q, n, p) {
    let cumulativeProb = 0;
    for (let k = 0; k <= n; k++) {
        cumulativeProb += binomPmf(k, n, p);
        if (cumulativeProb >= q) {
            return k;
        }
    }
    return n;  // Return the max value if not found
}

function roll(pulls, pity, fg, wl, startAdvancement) {
    let ssr = Math.floor((pulls + pity) / 80);
    pulls -= ssr;
    
    // Generate off rates based on manual PMF and PPF calculations
    let off = Array.from({length: binomPpf(0.9999, pulls, 0.0075) + 1}, (_, n) => binomPmf(n, pulls, 0.0075));
    off.push(1 - off.reduce((a, b) => a + b, 0));
    
    fg += pulls * 1.12;
    let rate = new Array(8).fill(0);
    let base = Array.from({length: 9}, () => new Array(4).fill(0));
    
    // Adjust base initialization according to startAdvancement and WL logic
    switch (wl) {
        case 0:
            base[startAdvancement][0] = 0.5;
            base[startAdvancement][3] = 0.5;
            break;
        case 1:
        case 2:
            base[startAdvancement][2 - wl] = 1;
            break;
        case -1:
        case -2:
            base[startAdvancement][1 - wl] = 1;
            break;
    }
    
    for (let k = 0; k < ssr + off.length - 1; k++) {
        if (k > 0) {
            for (let n = 6; n >= 0; n--) {
                base[n + 1][0] += 0.5 * base[n][1];
                base[n + 1][1] += 0.5 * base[n][2] + base[n][3];
                base[n][3] = 0.5 * base[n][2];
                base[n][2] = base[n][0] + 0.5 * base[n][1];
                base[n][0] = 0;
                base[n][1] = 0;
            }
        }
        if (k >= ssr) {
            for (let j = 0; j < 8; j++) {
                rate[Math.min(7, j + Math.floor((fg + 10 * Math.max(k - j, 0)) / 120))] += off[k - ssr] * base[j + 1].reduce((a, b) => a + b, 0);
            }
        }
    }
    
    // Adjust rates based on the starting advancement
    rate = rate.slice(startAdvancement);
    let result = rate.slice(0, -1).map((_, n) => 
        Math.round(100 * Math.max(rate[n] === 0 && n + startAdvancement <= ssr, rate.slice(n).reduce((a, b) => a + b, 0)) * 100) / 100
    );
    
    return result;
}

// Handler for pullcalc command
async function handlePullCalcCommand(interaction) {
    const pulls = interaction.options.getInteger('total_pulls');
    const pity = interaction.options.getInteger('current_counter');
    const fg = interaction.options.getInteger('flame_gold');
    const wl = interaction.options.getInteger('last_two_outcomes');
    const advancement = interaction.options.getInteger('number_of_copies');

    console.log(pulls, pity, fg, wl, advancement);

    const probability = roll(pulls, pity, fg, wl, advancement);

    let description = '';
    for (let i = 0; i < probability.length; i++) {
        description += `> ★ **${advancement + i} Chance**: ${probability[i]}%\n`;
    }

    const embed = {
        color: 0xFFD700, // Gold color for a premium look
        title: '<a:breadanime:1161877959204945920> Pull Probability Calculation <a:breadanime:1161877959204945920>',
        description: description,
        thumbnail: {
            url: 'https://your-image-url.com/icon.png', // Placeholder for an image URL
        },
        fields: [
            { name: 'Total Pulls <:red_nuc:1272388571008864337>', value: `${pulls}`, inline: true },
            { name: 'Flame Gold <:flame_gold:1272388595235426365>', value: `${fg}`, inline: true },
            { name: 'Pity Counter <:time:1166747727049269399> ', value: `${pity}`, inline: true },
        ],
        timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
}

module.exports = {
    handlePullCalcCommand
};