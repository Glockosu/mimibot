const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

// Store active raid signups (raidId -> raid data)
const activeRaids = new Map();
const raidSignups = new Map(); // raidId -> Map of userId -> signup data
const currentRaidId = 'dragon_shackles_current'; // Use a consistent ID for the current raid

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

        // Save to files
        await fs.writeFile(SIGNUPS_FILE, JSON.stringify(signupsData, null, 2));
        await fs.writeFile(VOTING_FILE, JSON.stringify(votingData, null, 2));
        
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

async function handleRaidCommand(interaction) {
    console.log('[RAID] Command started by', interaction.user.tag);

    // Create the raid embed
    const embed = new EmbedBuilder()
        .setTitle('Blue Protocol - Dragon Shackles Raid')
        .setColor(0x8B0000) // Dark red for dragon theme
        .setDescription('\n**Raid Information:**\n> • **Minimum Players:** 20 (unlimited signups)\n> • **Healers:** 4 slots\n> • **Tanks:** 3-4 slots\n> • **DPS:** 12-13 slots\n> • **Video Guide:** [Click here for strategy guide](' + RAID_CONFIG.videoGuide + ')')
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
    const raidId = currentRaidId;
    if (!raidVoting.has(raidId)) {
        raidVoting.set(raidId, {
            votes: new Map()
        });
    }

    // Pre-defined raid times
    const predefinedTimes = [
        { time: 'Morning (10 AM)', timestamp: 1761580800, display: '<t:1761580800:F>' },
        { time: 'Afternoon (1 PM)', timestamp: 1761591600, display: '<t:1761591600:F>' },
        { time: 'Evening (4 PM)', timestamp: 1761602400, display: '<t:1761602400:F>' },
        { time: 'Night (7 PM)', timestamp: 1761613200, display: '<t:1761613200:F>' }
    ];

    // Get current vote counts
    const voteCounts = [0, 0, 0, 0];
    const votingData = raidVoting.get(raidId);
    for (let i = 0; i < 4; i++) {
        voteCounts[i] = votingData.votes.get(i)?.size || 0;
    }

    // Create voting embed
    const votingEmbed = new EmbedBuilder()
        .setTitle('⏰ Vote for Raid Times')
        .setColor(0x0099ff)
        .setDescription('Vote for the times that best suit your availability. You can select multiple options!')
        .addFields(
            predefinedTimes.map((time, index) => ({
                name: `Option ${index + 1} (${voteCounts[index]} votes)`,
                value: `${time.display}`,
                inline: true
            }))
        )
        .setFooter({ text: 'Click the buttons below to vote for your preferred times' })
        .setTimestamp();

    // Create voting buttons
    const votingButtons = predefinedTimes.map((time, index) => 
        new ButtonBuilder()
            .setCustomId(`raid_vote_${index}`)
            .setLabel(`Vote ${index + 1}`)
            .setStyle(ButtonStyle.Primary)
    );

    const votingRows = [];
    for (let i = 0; i < votingButtons.length; i += 4) {
        votingRows.push(new ActionRowBuilder().addComponents(votingButtons.slice(i, i + 4)));
    }

    // Send second message with voting
    await interaction.channel.send({ embeds: [votingEmbed], components: votingRows });
    console.log('[RAID] Raid embeds posted (2 messages)');
}

async function handleRaidSignupButton(interaction) {
    console.log('[RAID] Signup button clicked by', interaction.user.tag);

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
        content: '**Select your role for the Dragon Shackles raid:**',
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

    // Create confirmation embed
    const confirmEmbed = new EmbedBuilder()
        .setTitle(existingSignup ? '✅ Raid Signup Updated!' : '✅ Raid Signup Confirmed!')
        .setColor(0x00ff00)
        .setDescription(existingSignup ? 
            `You've successfully updated your signup for the **Dragon Shackles Raid**!` :
            `You've successfully signed up for the **Dragon Shackles Raid**!`)
        .addFields(
            { name: '🎭 Role', value: `${getRoleEmoji(role)} ${role.toUpperCase()}`, inline: true },
            { name: '👤 IGN', value: ign, inline: true },
            { name: '⚡ Ability Score', value: powerLevel, inline: true },
            { name: '📝 Additional Info', value: additionalInfo, inline: false }
        )
        .setFooter({ text: 'Dawn | Starlight - Blue Protocol' })
        .setTimestamp();

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
        // Find the original raid message and update it
        const messages = await interaction.channel.messages.fetch({ limit: 10 });
        const raidMessage = messages.find(msg => 
            msg.embeds.length > 0 && 
            msg.embeds[0].title?.includes('Dragon Shackles Raid') &&
            msg.author.bot
        );

        if (raidMessage) {
            // Get current signup count for the current raid
            const currentSignups = raidSignups.get(currentRaidId);
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

    // Pre-defined raid times (your timestamps)
    const predefinedTimes = [
        { time: 'Morning (10 AM)', timestamp: 1761580800, display: '<t:1761580800:F>' },
        { time: 'Afternoon (1 PM)', timestamp: 1761591600, display: '<t:1761591600:F>' },
        { time: 'Evening (4 PM)', timestamp: 1761602400, display: '<t:1761602400:F>' },
        { time: 'Night (7 PM)', timestamp: 1761613200, display: '<t:1761613200:F>' }
    ];

    // Initialize voting data if it doesn't exist
    if (!raidVoting.has(raidId)) {
        raidVoting.set(raidId, {
            votes: new Map()
        });
    }

    // Get current vote counts
    const voteCounts = [0, 0, 0, 0];
    const votingData = raidVoting.get(raidId);
    for (let i = 0; i < 4; i++) {
        voteCounts[i] = votingData.votes.get(i)?.size || 0;
    }

    // Create voting embed
    const votingEmbed = new EmbedBuilder()
        .setTitle('⏰ Raid Time Selection')
        .setColor(0x0099ff)
        .setDescription(`Vote for your preferred raid time! (${signupArray.length} signup${signupArray.length === 1 ? '' : 's'} so far)`)
        .addFields(
            predefinedTimes.map((time, index) => ({
                name: `Option ${index + 1}`,
                value: `${time.display}\nVotes: ${voteCounts[index]}`,
                inline: true
            }))
        )
        .setFooter({ text: 'Vote for your preferred time!' })
        .setTimestamp();

    // Create voting buttons
    const votingButtons = predefinedTimes.map((time, index) => 
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
        
        if (isNaN(optionNumber) || optionNumber < 0 || optionNumber > 3) {
            await interaction.reply({
                content: '❌ Invalid vote option! Please try again.',
                ephemeral: true
            });
            return;
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

            await interaction.reply({
                content: `🗑️ Removed vote for **Option ${optionNumber + 1}**!`,
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

        await interaction.reply({
            content: `✅ Voted for **Option ${optionNumber + 1}**!`,
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
        const votingData = raidVoting.get(currentRaidId);
        if (!votingData) return;

        // Find the voting message (should be the second message with Vote for Raid Times title)
        const messages = await interaction.channel.messages.fetch({ limit: 10 });
        const votingMessage = messages.find(msg => 
            msg.embeds.length > 0 && 
            msg.embeds[0].title?.includes('Vote for Raid Times') &&
            msg.author.bot
        );

        if (votingMessage) {
            // Pre-defined times
            const predefinedTimes = [
                { time: 'Morning (10 AM)', timestamp: 1761580800, display: '<t:1761580800:F>' },
                { time: 'Afternoon (1 PM)', timestamp: 1761591600, display: '<t:1761591600:F>' },
                { time: 'Evening (4 PM)', timestamp: 1761602400, display: '<t:1761602400:F>' },
                { time: 'Night (7 PM)', timestamp: 1761613200, display: '<t:1761613200:F>' }
            ];

            // Calculate vote counts (keep original order, don't sort)
            const voteCounts = predefinedTimes.map((time, index) => ({
                time: time.time,
                display: time.display,
                votes: votingData.votes.get(index)?.size || 0
            }));

            const updatedVotingEmbed = new EmbedBuilder()
                .setTitle('⏰ Vote for Raid Times')
                .setColor(0x0099ff)
                .setDescription('Vote for the times that best suit your availability. You can select multiple options!')
                .addFields(
                    voteCounts.map((time, index) => ({
                        name: `Option ${index + 1} (${time.votes} votes)`,
                        value: `${time.display}`,
                        inline: true
                    }))
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

    // Save cleared data
    await saveRaidData();

    await interaction.reply({
        content: '✅ Raid data has been reset! All signups and voting data have been cleared.',
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

    const signups = raidSignups.get(currentRaidId);
    const voting = raidVoting.get(currentRaidId);
    
    const signupCount = signups ? signups.size : 0;
    const voteCounts = [0, 0, 0, 0];
    
    if (voting) {
        for (let i = 0; i < 4; i++) {
            voteCounts[i] = voting.votes.get(i)?.size || 0;
        }
    }

    const statusEmbed = new EmbedBuilder()
        .setTitle('📊 Raid System Status')
        .setColor(0x0099ff)
        .setDescription('Current raid data status and persistence info')
        .addFields(
            { name: '📝 Signups', value: `${signupCount} players signed up`, inline: true },
            { name: '🗳️ Votes', value: `Option 1: ${voteCounts[0]}, Option 2: ${voteCounts[1]}, Option 3: ${voteCounts[2]}, Option 4: ${voteCounts[3]}`, inline: false },
            { name: '💾 Data Files', value: `Signups: ${SIGNUPS_FILE}\nVoting: ${VOTING_FILE}`, inline: false },
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
