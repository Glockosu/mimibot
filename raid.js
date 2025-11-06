const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

// Store active raid signups (raidId -> raid data)
const activeRaids = new Map();
const raidSignups = new Map(); // raidId -> Map of userId -> signup data
const currentRaidId = 'dragon_shackles_current'; // Use a consistent ID for the current raid
const raidMetadata = new Map(); // raidId -> { title, times, type, raid }

// Raid configuration
const RAID_CONFIG = {
    minPlayers: 20,
    healerSlots: 4,
    tankSlots: 4,
    dpsSlots: 12,
    videoGuide: 'https://www.youtube.com/watch?v=m2Z3BJcwRdo'
};

// Store voting data (raidId -> voting data)
const raidVoting = new Map(); // raidId -> { votes: Map<optionNumber, Set<username>> }

// File paths for persistence
const DATA_DIR = path.join(__dirname, 'data');
const SIGNUPS_FILE = path.join(DATA_DIR, 'raid_signups.json');
const VOTING_FILE = path.join(DATA_DIR, 'raid_voting.json');
const METADATA_FILE = path.join(DATA_DIR, 'raid_metadata.json');

// Initialize data directory
async function initializeDataDirectory() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        console.log('[RAID] Data directory initialized');
    } catch (error) {
        console.error('[RAID] Error creating data directory:', error);
    }
}

// Save raid data to files
async function saveRaidData() {
    try {
        // Convert Maps to serializable objects
        const signupsData = {};
        for (const [raidId, signups] of raidSignups.entries()) {
            signupsData[raidId] = {};
            for (const [userId, signup] of signups.entries()) {
                signupsData[raidId][userId] = signup;
            }
        }

        const votingData = {};
        for (const [raidId, voting] of raidVoting.entries()) {
            votingData[raidId] = {};
            for (const [optionNumber, usernames] of voting.votes.entries()) {
                votingData[raidId][optionNumber] = Array.from(usernames);
            }
        }

        const metadataData = {};
        for (const [raidId, metadata] of raidMetadata.entries()) {
            metadataData[raidId] = metadata;
        }

        // Save to files
        await fs.writeFile(SIGNUPS_FILE, JSON.stringify(signupsData, null, 2));
        await fs.writeFile(VOTING_FILE, JSON.stringify(votingData, null, 2));
        await fs.writeFile(METADATA_FILE, JSON.stringify(metadataData, null, 2));
        
        console.log('[RAID] Data saved successfully');
    } catch (error) {
        console.error('[RAID] Error saving data:', error);
    }
}

// Load raid data from files
async function loadRaidData() {
    try {
        // Load signups
        try {
            const signupsContent = await fs.readFile(SIGNUPS_FILE, 'utf8');
            const signupsData = JSON.parse(signupsContent);
            
            for (const [raidId, signups] of Object.entries(signupsData)) {
                const signupsMap = new Map();
                for (const [userId, signup] of Object.entries(signups)) {
                    signupsMap.set(userId, signup);
                }
                raidSignups.set(raidId, signupsMap);
            }
            console.log('[RAID] Signups data loaded');
        } catch (error) {
            console.log('[RAID] No signups data to load');
        }

        // Load voting
        try {
            const votingContent = await fs.readFile(VOTING_FILE, 'utf8');
            const votingData = JSON.parse(votingContent);
            
            for (const [raidId, voting] of Object.entries(votingData)) {
                const votesMap = new Map();
                for (const [optionNumber, usernames] of Object.entries(voting)) {
                    votesMap.set(parseInt(optionNumber), new Set(usernames));
                }
                raidVoting.set(raidId, { votes: votesMap });
            }
            console.log('[RAID] Voting data loaded');
        } catch (error) {
            console.log('[RAID] No voting data to load');
        }

        // Load metadata
        try {
            const metadataContent = await fs.readFile(METADATA_FILE, 'utf8');
            const metadataData = JSON.parse(metadataContent);
            
            for (const [raidId, metadata] of Object.entries(metadataData)) {
                raidMetadata.set(raidId, metadata);
            }
            console.log('[RAID] Metadata loaded');
        } catch (error) {
            console.log('[RAID] No metadata to load');
        }
    } catch (error) {
        console.error('[RAID] Error loading data:', error);
    }
}

// Initialize data on startup
initializeDataDirectory().then(() => {
    loadRaidData();
});

// Periodic save every 5 minutes
setInterval(async () => {
    await saveRaidData();
}, 5 * 60 * 1000); // 5 minutes

// Save data on process exit
process.on('SIGINT', async () => {
    console.log('[RAID] Saving data before exit...');
    await saveRaidData();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('[RAID] Saving data before exit...');
    await saveRaidData();
    process.exit(0);
});

// Helper function to parse Discord time codes with raid association
function parseTimeCodes(timeString) {
    // Split by comma and extract time codes
    const timeCodes = timeString.split(',').map(t => t.trim()).filter(t => t);
    const parsedTimes = [];
    
    for (const timeCode of timeCodes) {
        // Match Discord time format: <t:timestamp:format> (raid) or <t:timestamp:format>
        const match = timeCode.match(/<t:(\d+):([FfDdTtR])>(\s*\((\w+)\))?/);
        if (match) {
            const timestamp = parseInt(match[1]);
            const format = match[2];
            const raidTag = match[4] ? match[4].toLowerCase() : null; // Extract raid from (bone) or (ice)
            
            // Determine which raid this time is for
            let raidType = null;
            if (raidTag) {
                if (raidTag.includes('bone')) {
                    raidType = 'bone dragon';
                } else if (raidTag.includes('ice')) {
                    raidType = 'ice dragon';
                }
            }
            
            parsedTimes.push({
                timestamp: timestamp,
                display: `<t:${timestamp}:${format}>`,
                raw: timeCode,
                raid: raidType
            });
        }
    }
    
    return parsedTimes;
}

// Helper function to parse minimum ability scores per raid
function parseMinimumAbilityScores(scoreString) {
    // Format: "15500(ice), 17000(bone)" or "15500(ice), 17000(bone dragon)"
    const scores = {};
    const parts = scoreString.split(',').map(s => s.trim()).filter(s => s);
    
    for (const part of parts) {
        // Match format: number(raid)
        const match = part.match(/(\d+)\s*\(([^)]+)\)/);
        if (match) {
            const score = parseInt(match[1]);
            const raidTag = match[2].toLowerCase().trim();
            
            // Normalize raid names
            if (raidTag.includes('ice')) {
                scores['ice dragon'] = score;
            } else if (raidTag.includes('bone')) {
                scores['bone dragon'] = score;
            }
        }
    }
    
    return scores;
}

// Helper function to format raid title
function formatRaidTitle(raidName, raidType, difficultyType) {
    // Capitalize first letter of each word
    let formattedRaid;
    if (raidName.toLowerCase() === 'both') {
        formattedRaid = 'Ice Dragon & Bone Dragon';
    } else {
        formattedRaid = raidName.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }
    
    // Handle difficulty type
    let formattedType;
    if (difficultyType.toLowerCase() === 'both') {
        formattedType = 'Normal & Hard';
    } else {
        formattedType = difficultyType.charAt(0).toUpperCase() + difficultyType.slice(1).toLowerCase();
    }
    
    return `Blue Protocol - ${formattedRaid} ${formattedType}`;
}

async function handleRaidCommand(interaction) {
    console.log('[RAID] Command started by', interaction.user.tag);

    // Get parameters from interaction
    const timesParam = interaction.options.getString('times');
    const difficultyType = interaction.options.getString('type');
    const raidName = interaction.options.getString('raid');
    const minimumAbilityScoreParam = interaction.options.getString('minimum_ability_score');

    // Parse time codes (with raid associations)
    const parsedTimes = parseTimeCodes(timesParam);
    
    if (parsedTimes.length === 0) {
        await interaction.reply({
            content: '❌ Invalid time codes provided. Please use Discord time format: `<t:timestamp:F> (bone)` or `<t:timestamp:F> (ice)` separated by commas.',
            ephemeral: true
        });
        return;
    }

    // Parse minimum ability scores per raid
    const minimumAbilityScores = parseMinimumAbilityScores(minimumAbilityScoreParam);
    
    if (Object.keys(minimumAbilityScores).length === 0) {
        await interaction.reply({
            content: '❌ Invalid minimum ability score format. Please use format: `15500(ice), 17000(bone)`',
            ephemeral: true
        });
        return;
    }

    // Build dynamic title
    const raidTitle = formatRaidTitle(raidName, difficultyType, difficultyType);

    // Format minimum ability scores for display
    const minScoreDisplay = Object.entries(minimumAbilityScores)
        .map(([raid, score]) => `${score}(${raid.split(' ')[0]})`)
        .join(', ');

    // Store metadata for this raid
    const raidId = currentRaidId;
    raidMetadata.set(raidId, {
        title: raidTitle,
        times: parsedTimes,
        type: difficultyType,
        raid: raidName,
        minimumAbilityScores: minimumAbilityScores
    });

    // Create the raid embed
    const embed = new EmbedBuilder()
        .setTitle(raidTitle)
        .setColor(0x8B0000) // Dark red for dragon theme
        .setDescription(`\n**Raid Information:**\n> • **Minimum Players:** 20 (unlimited signups)\n> • **Minimum Ability Score:** ${minScoreDisplay}\n> • **Healers:** 4 slots\n> • **Tanks:** 3-4 slots\n> • **DPS:** 12-13 slots\n> • **Video Guide:** [Click here for strategy guide](${RAID_CONFIG.videoGuide})`)
        .addFields(
            { 
                name: '**How to Sign Up**', 
                value: '> Click "Sign Up" below\n>  Select your role (Tank/Healer/DPS)\n> Enter your IGN and ability score\n>  Submit your signup\n> *Note: You can update your signup by signing up again*' 
            },
            { 
                name: '**Current Signups**', 
                value: '> No signups yet - be the first!' 
            }
        )
        .setFooter({ text: 'Dawn | Starlight - Blue Protocol', iconURL: interaction.guild.iconURL() })
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png'); // You can add a dragon emoji URL here

    // Create signup button
    const signupButton = new ButtonBuilder()
        .setCustomId('raid_signup_button')
        .setLabel('Sign Up for Raid')
        .setEmoji('⚔️')
        .setStyle(ButtonStyle.Primary);

    // Create view roster button
    const rosterButton = new ButtonBuilder()
        .setCustomId('raid_view_roster')
        .setLabel('View Roster')
        .setEmoji('📋')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(signupButton, rosterButton);

    // Send first message with signup
    await interaction.reply({ embeds: [embed], components: [row] });

    // Initialize voting data if it doesn't exist
    if (!raidVoting.has(raidId)) {
        raidVoting.set(raidId, {
            votes: new Map()
        });
    }

    // Get current vote counts
    const voteCounts = new Array(parsedTimes.length).fill(0);
    const votingData = raidVoting.get(raidId);
    for (let i = 0; i < parsedTimes.length; i++) {
        voteCounts[i] = votingData.votes.get(i)?.size || 0;
    }

    // Create voting embed with raid information
    const votingEmbed = new EmbedBuilder()
        .setTitle('⏰ Vote for Raid Times')
        .setColor(0x0099ff)
        .setDescription('Vote for the times that best suit your availability. You can select multiple options!')
        .addFields(
            parsedTimes.map((time, index) => {
                const raidLabel = time.raid ? ` (${time.raid.split(' ')[0]})` : '';
                const minScore = time.raid && minimumAbilityScores[time.raid] 
                    ? ` Min: ${minimumAbilityScores[time.raid]}` 
                    : '';
                return {
                    name: `Option ${index + 1}${raidLabel} (${voteCounts[index]} votes)${minScore}`,
                    value: `${time.display}`,
                    inline: true
                };
            })
        )
        .setFooter({ text: 'Click the buttons below to vote for your preferred times' })
        .setTimestamp();

    // Create voting buttons
    const votingButtons = parsedTimes.map((time, index) => 
        new ButtonBuilder()
            .setCustomId(`raid_vote_${index}`)
            .setLabel(`Vote ${index + 1}`)
            .setStyle(ButtonStyle.Primary)
    );

    const votingRows = [];
    for (let i = 0; i < votingButtons.length; i += 4) {
        votingRows.push(new ActionRowBuilder().addComponents(votingButtons.slice(i, i + 4)));
    }

    // Save metadata
    await saveRaidData();

    // Send second message with voting
    await interaction.channel.send({ embeds: [votingEmbed], components: votingRows });
    console.log('[RAID] Raid embeds posted (2 messages)');
}

async function handleRaidSignupButton(interaction) {
    console.log('[RAID] Signup button clicked by', interaction.user.tag);

    // Get raid title from metadata
    const raidId = currentRaidId;
    const metadata = raidMetadata.get(raidId);
    const raidTitle = metadata ? metadata.title : 'the raid';

    // Create role selection menu
    const roleSelect = new StringSelectMenuBuilder()
        .setCustomId('raid_role_select')
        .setPlaceholder('Select your role for the raid')
        .addOptions([
            new StringSelectMenuOptionBuilder()
                .setLabel('Tank')
                .setDescription('Protect the team and control aggro')
                .setValue('tank')
                .setEmoji('🛡️'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Healer')
                .setDescription('Keep the team alive and healthy')
                .setValue('healer')
                .setEmoji('💚'),
            new StringSelectMenuOptionBuilder()
                .setLabel('DPS')
                .setDescription('Deal damage and eliminate enemies')
                .setValue('dps')
                .setEmoji('⚔️')
        ]);

    const row = new ActionRowBuilder().addComponents(roleSelect);

    await interaction.reply({
        content: `**Select your role for ${raidTitle}:**`,
        components: [row],
        ephemeral: true
    });
}

async function handleRoleSelection(interaction) {
    const selectedRole = interaction.values[0];
    console.log(`[RAID] Role selected by ${interaction.user.tag}: ${selectedRole}`);

    // Create modal for availability input
    const modal = new ModalBuilder()
        .setCustomId(`raid_availability_${selectedRole}`)
        .setTitle('Raid Availability');

    const ignInput = new TextInputBuilder()
        .setCustomId('ign')
        .setLabel('In-Game Name (IGN)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Your Blue Protocol character name')
        .setRequired(true)
        .setMaxLength(50);

    const powerLevelInput = new TextInputBuilder()
        .setCustomId('ability_score')
        .setLabel('Ability Score')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Your current ability score')
        .setRequired(true)
        .setMaxLength(10);

    const additionalInfoInput = new TextInputBuilder()
        .setCustomId('additional_info')
        .setLabel('Additional Information (Optional)')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Any special notes, experience with the raid, preferred sub-role, etc.')
        .setRequired(false)
        .setMaxLength(500);

    const firstActionRow = new ActionRowBuilder().addComponents(ignInput);
    const secondActionRow = new ActionRowBuilder().addComponents(powerLevelInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(additionalInfoInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);
}

async function handleRaidAvailabilitySubmit(interaction) {
    const role = interaction.customId.split('_')[2]; // Extract role from customId
    const ign = interaction.fields.getTextInputValue('ign');
    const powerLevel = interaction.fields.getTextInputValue('ability_score');
    const additionalInfo = interaction.fields.getTextInputValue('additional_info') || 'None';

    console.log(`[RAID] Signup submitted by ${interaction.user.tag} for role: ${role}`);

    // Use the consistent current raid ID
    const raidId = currentRaidId;

    // Get metadata to check minimum ability scores
    const metadata = raidMetadata.get(raidId);
    const minimumAbilityScores = metadata ? metadata.minimumAbilityScores : {};
    
    // Parse ability score and check against minimums
    const abilityScoreNum = parseInt(powerLevel);
    const isBelowMinimum = Object.values(minimumAbilityScores).some(minScore => 
        minScore !== null && !isNaN(abilityScoreNum) && abilityScoreNum < minScore
    );
    
    // Get the lowest minimum to show in warning
    const lowestMinimum = Object.values(minimumAbilityScores).length > 0 
        ? Math.min(...Object.values(minimumAbilityScores))
        : null;

    // Store the signup data
    if (!raidSignups.has(raidId)) {
        raidSignups.set(raidId, new Map());
    }

    const signupData = {
        userId: interaction.user.id,
        username: interaction.user.tag,
        ign: ign,
        role: role,
        powerLevel: powerLevel,
        additionalInfo: additionalInfo,
        signupTime: Date.now()
    };

    // Check if user already signed up
    const existingSignup = raidSignups.get(raidId).has(interaction.user.id);
    
    raidSignups.get(raidId).set(interaction.user.id, signupData);

    // Save data to file
    await saveRaidData();

    // Get raid title from metadata
    const raidTitle = metadata ? metadata.title : 'the raid';

    // Create confirmation embed with warning if below minimum
    const confirmEmbed = new EmbedBuilder()
        .setTitle(existingSignup ? '✅ Raid Signup Updated!' : '✅ Raid Signup Confirmed!')
        .setColor(isBelowMinimum ? 0xff9900 : 0x00ff00) // Orange if below minimum, green if okay
        .setDescription(existingSignup ? 
            `You've successfully updated your signup for **${raidTitle}**!` :
            `You've successfully signed up for **${raidTitle}**!`)
        .addFields(
            { name: '🎭 Role', value: `${getRoleEmoji(role)} ${role.toUpperCase()}`, inline: true },
            { name: '👤 IGN', value: ign, inline: true },
            { name: '⚡ Ability Score', value: powerLevel, inline: true },
            { name: '📝 Additional Info', value: additionalInfo, inline: false }
        )
        .setFooter({ text: 'Dawn | Starlight - Blue Protocol' })
        .setTimestamp();

    // Add warning field if below minimum
    if (isBelowMinimum && lowestMinimum !== null) {
        const belowRaids = Object.entries(minimumAbilityScores)
            .filter(([raid, minScore]) => !isNaN(abilityScoreNum) && abilityScoreNum < minScore)
            .map(([raid, minScore]) => `${minScore} (${raid.split(' ')[0]})`)
            .join(', ');
        
        confirmEmbed.addFields({
            name: '⚠️ Warning',
            value: `Your ability score (${powerLevel}) is below the minimum required for some raids: ${belowRaids}. You may not be able to vote for those raid times.`,
            inline: false
        });
    }

    await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });

    // Update the main raid embed with new signup count
    await updateRaidEmbed(interaction);
}

async function handleViewRoster(interaction) {
    console.log('[RAID] View roster clicked by', interaction.user.tag);

    // Use the current raid ID
    const raidId = currentRaidId;

    if (!raidSignups.has(raidId) || raidSignups.get(raidId).size === 0) {
        await interaction.reply({
            content: '❌ No raid signups found!',
            ephemeral: true
        });
        return;
    }

    const signups = raidSignups.get(raidId);
    const signupArray = Array.from(signups.values());

    // Group by role
    const tanks = signupArray.filter(s => s.role === 'tank');
    const healers = signupArray.filter(s => s.role === 'healer');
    const dps = signupArray.filter(s => s.role === 'dps');

    // Helper function to split a long string into chunks that fit within Discord's 1024 character limit
    function chunkString(str, maxLength = 1024) {
        if (str.length <= maxLength) return [str];
        const chunks = [];
        const lines = str.split('\n');
        let currentChunk = '';
        
        for (const line of lines) {
            if ((currentChunk + line + '\n').length > maxLength) {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = line + '\n';
            } else {
                currentChunk += line + '\n';
            }
        }
        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks;
    }

    // Build the embeds array
    const embeds = [];

    // Create main roster embed
    const mainEmbed = new EmbedBuilder()
        .setTitle('Raid Roster')
        .setColor(0x8B0000)
        .setDescription(`**Total Signups:** ${signupArray.length} (${signupArray.length >= RAID_CONFIG.minPlayers ? '✅ Ready!' : `Need ${RAID_CONFIG.minPlayers - signupArray.length} more`})`)
        .setFooter({ text: 'Dawn | Starlight - Blue Protocol' })
        .setTimestamp();

    embeds.push(mainEmbed);

    // Add Tanks
    if (tanks.length > 0) {
        const tanksText = tanks.map(t => `• **${t.ign}** (${t.powerLevel}) - <@${t.userId}>`).join('\n');
        const tankChunks = chunkString(tanksText);
        
        tankChunks.forEach((chunk, index) => {
            const embed = new EmbedBuilder()
                .setTitle(`🛡️ Tanks ${index === 0 ? `(${tanks.length}/${RAID_CONFIG.tankSlots})` : ''}`)
                .setColor(0x8B0000)
                .setDescription(chunk);
            embeds.push(embed);
        });
    } else {
        const embed = new EmbedBuilder()
            .setTitle(`🛡️ Tanks (0/${RAID_CONFIG.tankSlots})`)
            .setColor(0x8B0000)
            .setDescription('No tanks signed up');
        embeds.push(embed);
    }

    // Add Healers
    if (healers.length > 0) {
        const healersText = healers.map(h => `• **${h.ign}** (${h.powerLevel}) - <@${h.userId}>`).join('\n');
        const healerChunks = chunkString(healersText);
        
        healerChunks.forEach((chunk, index) => {
            const embed = new EmbedBuilder()
                .setTitle(`💚 Healers ${index === 0 ? `(${healers.length}/${RAID_CONFIG.healerSlots})` : ''}`)
                .setColor(0x8B0000)
                .setDescription(chunk);
            embeds.push(embed);
        });
    } else {
        const embed = new EmbedBuilder()
            .setTitle(`💚 Healers (0/${RAID_CONFIG.healerSlots})`)
            .setColor(0x8B0000)
            .setDescription('No healers signed up');
        embeds.push(embed);
    }

    // Add DPS
    if (dps.length > 0) {
        const dpsText = dps.map(d => `• **${d.ign}** (${d.powerLevel}) - <@${d.userId}>`).join('\n');
        const dpsChunks = chunkString(dpsText);
        
        dpsChunks.forEach((chunk, index) => {
            const embed = new EmbedBuilder()
                .setTitle(`⚔️ DPS ${index === 0 ? `(${dps.length}/${RAID_CONFIG.dpsSlots})` : ''}`)
                .setColor(0x8B0000)
                .setDescription(chunk);
            embeds.push(embed);
        });
    } else {
        const embed = new EmbedBuilder()
            .setTitle(`⚔️ DPS (0/${RAID_CONFIG.dpsSlots})`)
            .setColor(0x8B0000)
            .setDescription('No DPS signed up');
        embeds.push(embed);
    }

    await interaction.reply({ embeds: embeds, ephemeral: true });
}

async function updateRaidEmbed(interaction) {
    try {
        // Get raid title from metadata
        const raidId = currentRaidId;
        const metadata = raidMetadata.get(raidId);
        const raidTitle = metadata ? metadata.title : 'Blue Protocol';

        // Find the original raid message and update it
        const messages = await interaction.channel.messages.fetch({ limit: 10 });
        const raidMessage = messages.find(msg => 
            msg.embeds.length > 0 && 
            msg.embeds[0].title?.includes(raidTitle) &&
            msg.author.bot
        );

        if (raidMessage) {
            // Get current signup count for the current raid
            const currentSignups = raidSignups.get(raidId);
            const totalSignups = currentSignups ? currentSignups.size : 0;

             const updatedEmbed = EmbedBuilder.from(raidMessage.embeds[0])
                 .setFields(
                     { 
                         name: '**Current Signups**', 
                         value: `> **${totalSignups}** players signed up (${totalSignups >= RAID_CONFIG.minPlayers ? '✅ Ready!' : `Need ${RAID_CONFIG.minPlayers - totalSignups} more`})\n> Use "View Roster" to see details` 
                     }
                 );

            await raidMessage.edit({ embeds: [updatedEmbed] });
        }
    } catch (error) {
        console.error('[RAID] Error updating raid embed:', error);
    }
}

async function handleSuggestTimes(interaction) {
    console.log('[RAID] Suggest times clicked by', interaction.user.tag);

    // Use the current raid ID
    const raidId = currentRaidId;

    if (!raidSignups.has(raidId) || raidSignups.get(raidId).size === 0) {
        await interaction.reply({
            content: '❌ No raid signups found!',
            ephemeral: true
        });
        return;
    }

    const signups = raidSignups.get(raidId);
    const signupArray = Array.from(signups.values());

    // Get times from metadata
    const metadata = raidMetadata.get(raidId);
    if (!metadata || !metadata.times || metadata.times.length === 0) {
        await interaction.reply({
            content: '❌ No raid times configured! Please create a raid first.',
            ephemeral: true
        });
        return;
    }

    const raidTimes = metadata.times;

    // Initialize voting data if it doesn't exist
    if (!raidVoting.has(raidId)) {
        raidVoting.set(raidId, {
            votes: new Map()
        });
    }

    // Get current vote counts
    const voteCounts = new Array(raidTimes.length).fill(0);
    const votingData = raidVoting.get(raidId);
    for (let i = 0; i < raidTimes.length; i++) {
        voteCounts[i] = votingData.votes.get(i)?.size || 0;
    }

    // Get minimum ability scores from metadata
    const minimumAbilityScores = metadata ? metadata.minimumAbilityScores : {};

    // Create voting embed
    const votingEmbed = new EmbedBuilder()
        .setTitle('⏰ Raid Time Selection')
        .setColor(0x0099ff)
        .setDescription(`Vote for your preferred raid time! (${signupArray.length} signup${signupArray.length === 1 ? '' : 's'} so far)`)
        .addFields(
            raidTimes.map((time, index) => {
                const raidLabel = time.raid ? ` (${time.raid.split(' ')[0]})` : '';
                const minScore = time.raid && minimumAbilityScores[time.raid] 
                    ? `\nMin: ${minimumAbilityScores[time.raid]}` 
                    : '';
                return {
                    name: `Option ${index + 1}${raidLabel}`,
                    value: `${time.display}${minScore}\nVotes: ${voteCounts[index]}`,
                    inline: true
                };
            })
        )
        .setFooter({ text: 'Vote for your preferred time!' })
        .setTimestamp();

    // Create voting buttons
    const votingButtons = raidTimes.map((time, index) => 
        new ButtonBuilder()
            .setCustomId(`raid_vote_${index}`)
            .setLabel(`Vote ${index + 1}`)
            .setStyle(ButtonStyle.Primary)
    );

    const rows = [];
    for (let i = 0; i < votingButtons.length; i += 4) {
        rows.push(new ActionRowBuilder().addComponents(votingButtons.slice(i, i + 4)));
    }

    await interaction.reply({ embeds: [votingEmbed], components: rows, ephemeral: true });
}


async function handleTimeVote(interaction) {
    try {
        console.log(`[RAID] Vote button clicked with customId: ${interaction.customId}`);
        
        // Parse the option number from customId (format: raid_vote_0, raid_vote_1, etc.)
        const optionNumber = parseInt(interaction.customId.split('_')[2]);
        
        console.log(`[RAID] Parsed option number: ${optionNumber}`);
        
        // Get metadata to check valid option range
        const raidId = currentRaidId;
        const metadata = raidMetadata.get(raidId);
        const maxOptions = metadata && metadata.times ? metadata.times.length : 0;
        
        if (isNaN(optionNumber) || optionNumber < 0 || (maxOptions > 0 && optionNumber >= maxOptions)) {
            await interaction.reply({
                content: '❌ Invalid vote option! Please try again.',
                ephemeral: true
            });
            return;
        }

        // Get the time option and its associated raid
        const timeOption = metadata.times[optionNumber];
        const raidForTime = timeOption ? timeOption.raid : null;
        const minimumAbilityScores = metadata ? metadata.minimumAbilityScores : {};

        // Check if user has signed up and get their ability score
        const userSignup = raidSignups.get(raidId)?.get(interaction.user.id);
        if (!userSignup) {
            await interaction.reply({
                content: '❌ You must sign up for the raid first before voting!',
                ephemeral: true
            });
            return;
        }

        // If this time option is for a specific raid, check ability score
        if (raidForTime && minimumAbilityScores[raidForTime]) {
            const userAbilityScore = parseInt(userSignup.powerLevel);
            const requiredScore = minimumAbilityScores[raidForTime];
            
            if (isNaN(userAbilityScore) || userAbilityScore < requiredScore) {
                await interaction.reply({
                    content: `❌ Your ability score (${userSignup.powerLevel}) is below the minimum required (${requiredScore}) for **${raidForTime}**. You cannot vote for this time option.`,
                    ephemeral: true
                });
                return;
            }
        }

        // Initialize voting data if it doesn't exist
        if (!raidVoting.has(currentRaidId)) {
            raidVoting.set(currentRaidId, {
                votes: new Map()
            });
        }

        const votingData = raidVoting.get(currentRaidId);
        
        // Initialize the vote set for this option if it doesn't exist
        if (!votingData.votes.has(optionNumber)) {
            votingData.votes.set(optionNumber, new Set());
        }
        
        // Check if user already voted for this option - toggle it
        if (votingData.votes.get(optionNumber).has(interaction.user.username)) {
            // Remove the vote (undo)
            votingData.votes.get(optionNumber).delete(interaction.user.username);

            // Save data to file
            await saveRaidData();

            // Update voting results
            await updateVotingResults(interaction);

            const raidLabel = raidForTime ? ` for **${raidForTime}**` : '';
            await interaction.reply({
                content: `🗑️ Removed vote for **Option ${optionNumber + 1}**${raidLabel}!`,
                ephemeral: true
            });
            return;
        }
        
        // Add the vote
        votingData.votes.get(optionNumber).add(interaction.user.username);

        // Save data to file
        await saveRaidData();

        // Update voting results
        await updateVotingResults(interaction);

        const raidLabel = raidForTime ? ` for **${raidForTime}**` : '';
        await interaction.reply({
            content: `✅ Voted for **Option ${optionNumber + 1}**${raidLabel}!`,
            ephemeral: true
        });
        
    } catch (error) {
        console.error('[RAID] Error in handleTimeVote:', error);
        await interaction.reply({
            content: '❌ There was an error processing your vote. Please try again.',
            ephemeral: true
        });
    }
}

async function updateVotingResults(interaction) {
    try {
        const raidId = currentRaidId;
        const votingData = raidVoting.get(raidId);
        if (!votingData) return;

        // Get times from metadata
        const metadata = raidMetadata.get(raidId);
        if (!metadata || !metadata.times || metadata.times.length === 0) {
            return;
        }

        const raidTimes = metadata.times;
        const minimumAbilityScores = metadata ? metadata.minimumAbilityScores : {};

        // Find the voting message (should be the second message with Vote for Raid Times title)
        const messages = await interaction.channel.messages.fetch({ limit: 10 });
        const votingMessage = messages.find(msg => 
            msg.embeds.length > 0 && 
            msg.embeds[0].title?.includes('Vote for Raid Times') &&
            msg.author.bot
        );

        if (votingMessage) {
            // Calculate vote counts (keep original order, don't sort)
            const voteCounts = raidTimes.map((time, index) => ({
                display: time.display,
                votes: votingData.votes.get(index)?.size || 0,
                raid: time.raid
            }));

            const updatedVotingEmbed = new EmbedBuilder()
                .setTitle('⏰ Vote for Raid Times')
                .setColor(0x0099ff)
                .setDescription('Vote for the times that best suit your availability. You can select multiple options!')
                .addFields(
                    voteCounts.map((time, index) => {
                        const raidLabel = time.raid ? ` (${time.raid.split(' ')[0]})` : '';
                        const minScore = time.raid && minimumAbilityScores[time.raid] 
                            ? ` Min: ${minimumAbilityScores[time.raid]}` 
                            : '';
                        return {
                            name: `Option ${index + 1}${raidLabel} (${time.votes} votes)${minScore}`,
                            value: `${time.display}`,
                            inline: true
                        };
                    })
                )
                .setFooter({ text: 'Click the buttons below to vote for your preferred times' })
                .setTimestamp();

            // Replace the voting embed
            await votingMessage.edit({ embeds: [updatedVotingEmbed] });
        }
    } catch (error) {
        console.error('[RAID] Error updating voting results:', error);
    }
}


async function handleResetRaid(interaction) {
    console.log('[RAID] Reset raid clicked by', interaction.user.tag);

    // Check if user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
        await interaction.reply({
            content: '❌ You need Administrator permissions to reset the raid!',
            ephemeral: true
        });
        return;
    }

    // Clear all raid data
    raidSignups.clear();
    raidVoting.clear();
    raidMetadata.clear();
    activeRaids.clear();

    // Save cleared data
    await saveRaidData();

    await interaction.reply({
        content: '✅ Raid data has been reset! All signups, voting data, and metadata have been cleared.',
        ephemeral: true
    });

    console.log('[RAID] Raid data reset by', interaction.user.tag);
}

async function handleRaidStatus(interaction) {
    console.log('[RAID] Status requested by', interaction.user.tag);

    // Check if user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
        await interaction.reply({
            content: '❌ You need Administrator permissions to view raid status!',
            ephemeral: true
        });
        return;
    }

    const raidId = currentRaidId;
    const signups = raidSignups.get(raidId);
    const voting = raidVoting.get(raidId);
    const metadata = raidMetadata.get(raidId);
    
    const signupCount = signups ? signups.size : 0;
    
    // Get vote counts dynamically based on metadata
    let voteText = 'No voting data';
    if (voting && metadata && metadata.times) {
        const voteCounts = metadata.times.map((time, index) => {
            const count = voting.votes.get(index)?.size || 0;
            return `Option ${index + 1}: ${count}`;
        });
        voteText = voteCounts.join(', ');
    } else if (voting) {
        // Fallback for old data
        const voteCounts = [];
        for (let i = 0; i < 10; i++) {
            const count = voting.votes.get(i)?.size || 0;
            if (count > 0 || i < 4) {
                voteCounts.push(`Option ${i + 1}: ${count}`);
            }
        }
        voteText = voteCounts.length > 0 ? voteCounts.join(', ') : 'No votes';
    }

    const raidTitle = metadata ? metadata.title : 'No raid configured';

    const statusEmbed = new EmbedBuilder()
        .setTitle('📊 Raid System Status')
        .setColor(0x0099ff)
        .setDescription('Current raid data status and persistence info')
        .addFields(
            { name: '📝 Current Raid', value: raidTitle, inline: false },
            { name: '📝 Signups', value: `${signupCount} players signed up`, inline: true },
            { name: '🗳️ Votes', value: voteText, inline: false },
            { name: '💾 Data Files', value: `Signups: ${SIGNUPS_FILE}\nVoting: ${VOTING_FILE}\nMetadata: ${METADATA_FILE}`, inline: false },
            { name: '🔄 Auto-Save', value: 'Every 5 minutes + on every change', inline: true }
        )
        .setFooter({ text: 'Dawn | Starlight - Blue Protocol' })
        .setTimestamp();

    await interaction.reply({ embeds: [statusEmbed], ephemeral: true });
}

function getRoleEmoji(role) {
    switch (role) {
        case 'tank': return '🛡️';
        case 'healer': return '💚';
        case 'dps': return '⚔️';
        default: return '❓';
    }
}

module.exports = {
    handleRaidCommand,
    handleRaidSignupButton,
    handleRoleSelection,
    handleRaidAvailabilitySubmit,
    handleViewRoster,
    handleSuggestTimes,
    handleTimeVote,
    handleResetRaid,
    handleRaidStatus
};
