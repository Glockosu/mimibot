const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const APPLICATION_CHANNEL_ID = '1426462066520358912';

// Store active applications (userId -> application data)
const activeApplications = new Map();

const applicationQuestions = [
    { 
        id: 'ign', 
        question: '**What is your in-game username in Blue Protocol?**\nPlease provide your exact character name.',
        field: 'In-Game Name'
    },
    { 
        id: 'power', 
        question: '**What is your current Power Level?**\nYou can find this in your character stats.',
        field: 'Power Level'
    },
    { 
        id: 'activity', 
        question: '**How active will you be?**\nFor example: Daily, 3-4 times a week, weekends only, etc.',
        field: 'Activity Level'
    },
    { 
        id: 'reason', 
        question: '**Why do you want to join Dawn | Starlight?**\nTell us what interests you about our guild!',
        field: 'Reason for Joining'
    },
    { 
        id: 'experience', 
        question: '**What is your experience with Blue Protocol?**\nAre you new, returning, or a veteran player?',
        field: 'Experience Level'
    },
    { 
        id: 'playstyle', 
        question: '**What is your preferred playstyle?**\nFor example: PvE, PvP, Casual, Competitive, etc.',
        field: 'Playstyle'
    },
    { 
        id: 'additional', 
        question: '**Anything else you\'d like us to know?**\nFeel free to share anything else about yourself - hobbies, favorite games, fun facts, or whatever you want!',
        field: 'Additional Comments'
    }
];

async function handleApplicationCommand(interaction) {
    console.log('[APPLICATION] Command started by', interaction.user.tag);

    // Check if user already has an active application
    if (activeApplications.has(interaction.user.id)) {
        return interaction.reply({
            content: '⚠️ You already have an application in progress! Please check your DMs to continue.',
            flags: 64 // ephemeral
        });
    }

    // Create the application embed for the channel
    const embed = new EmbedBuilder()
        .setTitle('**Blue Protocol Guild Application**')
        .setAuthor({ name: '🌟 Dawn | Starlight 🌟', iconURL: interaction.guild.iconURL() })
        .setColor(0x0099ff)
        .setDescription('> Apply to join our Blue Protocol guild! Click the button below to start your application.\n\n**What to expect:**\n> • You will be sent a DM with a series of questions\n> • Answer each question one at a time\n> • Your application will be reviewed by our officers\n> • You will be notified of the decision')
        .addFields(
            { name: '💫 **About Our Guild**', value: '> We are an active and friendly guild that welcomes players of all skill levels. Join us for raids, events, and a great community!' },
            { name: '📋 **Application Process**', value: '> 1️⃣ Click the "Apply Now" button\n> 2️⃣ Check your DMs from me\n> 3️⃣ Answer each question\n> 4️⃣ Wait for review (usually 24-48 hours)' }
        )
        .setFooter({ text: 'Dawn | Starlight', iconURL: interaction.guild.iconURL() })
        .setTimestamp();

    // Create apply button
    const applyButton = new ButtonBuilder()
        .setCustomId('bp_apply_button')
        .setLabel('Apply Now')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(applyButton);

    // Send to channel
    await interaction.reply({ embeds: [embed], components: [row] });
    console.log('[APPLICATION] Application embed posted');
}

async function handleApplicationButton(interaction) {
    console.log('[APPLICATION] Button clicked by', interaction.user.tag);

    // Check if user already has an active application
    if (activeApplications.has(interaction.user.id)) {
        return interaction.reply({
            content: '⚠️ You already have an application in progress! Please check your DMs to continue.',
            flags: 64 // ephemeral
        });
    }

    // Defer the reply
    await interaction.deferReply({ flags: 64 });

    try {
        // Try to DM the user
        const dmChannel = await interaction.user.createDM();
        
        // Initialize application data
        activeApplications.set(interaction.user.id, {
            userId: interaction.user.id,
            username: interaction.user.tag,
            guildId: interaction.guild.id,
            guildName: interaction.guild.name,
            startTime: Date.now(),
            currentQuestion: 0,
            answers: {}
        });

        // Send welcome message
        const welcomeEmbed = new EmbedBuilder()
            .setTitle('📝 Blue Protocol Guild Application')
            .setColor(0x00ff00)
            .setDescription(`Welcome ${interaction.user.username}! Thank you for your interest in joining **Dawn | Starlight**!\n\nI'll ask you a series of ${applicationQuestions.length} questions. Please answer each one in this DM.\n\nYou can type \`cancel\` at any time to cancel your application.`)
            .setFooter({ text: 'Dawn | Starlight - Blue Protocol' })
            .setTimestamp();

        await dmChannel.send({ embeds: [welcomeEmbed] });

        // Ask first question
        await askQuestion(interaction.user, 0);

        await interaction.editReply({
            content: '✅ Application started! Please check your DMs to continue.'
        });

        console.log('[APPLICATION] Application started for', interaction.user.tag);

    } catch (error) {
        console.error('[APPLICATION] Error starting application:', error);
        
        // User has DMs disabled
        await interaction.editReply({
            content: '❌ I couldn\'t send you a DM! Please enable DMs from server members and try again.\n\n**How to enable DMs:**\n1. Right-click the server name\n2. Go to Privacy Settings\n3. Enable "Direct Messages"'
        });
    }
}

async function askQuestion(user, questionIndex) {
    const question = applicationQuestions[questionIndex];
    const dmChannel = await user.createDM();

    const questionEmbed = new EmbedBuilder()
        .setTitle(`Question ${questionIndex + 1}/${applicationQuestions.length}`)
        .setColor(0x0099ff)
        .setDescription(question.question)
        .setFooter({ text: `Type your answer below | Type "cancel" to cancel` })
        .setTimestamp();

    await dmChannel.send({ embeds: [questionEmbed] });
    console.log(`[APPLICATION] Asked question ${questionIndex + 1} to ${user.tag}`);
}

async function handleDMResponse(message) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check if user has an active application
    const application = activeApplications.get(message.author.id);
    if (!application) return;

    console.log(`[APPLICATION] Received response from ${message.author.tag}: "${message.content}"`);

    // Check for cancel
    if (message.content.toLowerCase() === 'cancel') {
        activeApplications.delete(message.author.id);
        const cancelEmbed = new EmbedBuilder()
            .setTitle('❌ Application Cancelled')
            .setColor(0xff0000)
            .setDescription('Your application has been cancelled. You can start a new one anytime!')
            .setTimestamp();
        await message.reply({ embeds: [cancelEmbed] });
        console.log('[APPLICATION] Application cancelled by', message.author.tag);
        return;
    }

    // Store the answer
    const currentQuestion = applicationQuestions[application.currentQuestion];
    application.answers[currentQuestion.id] = message.content;

    // Move to next question
    application.currentQuestion++;

    if (application.currentQuestion < applicationQuestions.length) {
        // Ask next question
        await askQuestion(message.author, application.currentQuestion);
    } else {
        // Application complete
        await submitApplication(message.author, application);
    }
}

async function submitApplication(user, application) {
    console.log('[APPLICATION] Submitting application for', user.tag);

    try {
        // Get the guild and channel
        const guild = user.client.guilds.cache.get(application.guildId);
        if (!guild) {
            console.error('[APPLICATION] Could not find guild');
            return;
        }

        const channel = guild.channels.cache.get(APPLICATION_CHANNEL_ID);
        if (!channel) {
            console.error('[APPLICATION] Could not find application channel');
            await user.send('❌ There was an error submitting your application. Please contact an admin.');
            activeApplications.delete(user.id);
            return;
        }

        // Create the application embed
        const applicationEmbed = new EmbedBuilder()
            .setTitle('📋 New Blue Protocol Guild Application')
            .setColor(0x0099ff)
            .setAuthor({ 
                name: `${user.tag} (${user.id})`, 
                iconURL: user.displayAvatarURL() 
            })
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        // Add all answers as fields
        applicationQuestions.forEach(q => {
            applicationEmbed.addFields({
                name: `📌 ${q.field}`,
                value: application.answers[q.id] || 'No answer provided',
                inline: false
            });
        });

        applicationEmbed.addFields(
            { name: '👤 Discord User', value: `<@${user.id}>`, inline: true },
            { name: '🆔 User ID', value: user.id, inline: true },
            { name: '📅 Applied', value: `<t:${Math.floor(application.startTime / 1000)}:R>`, inline: true }
        );

        // Create action buttons for admins
        const approveButton = new ButtonBuilder()
            .setCustomId(`bp_approve_${user.id}`)
            .setLabel('Approve')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success);

        const denyButton = new ButtonBuilder()
            .setCustomId(`bp_deny_${user.id}`)
            .setLabel('Deny')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(approveButton, denyButton);

        // Send to review channel
        await channel.send({ embeds: [applicationEmbed], components: [row] });

        // Confirm to user
        const confirmEmbed = new EmbedBuilder()
            .setTitle('✅ Application Submitted!')
            .setColor(0x00ff00)
            .setDescription(`Thank you for applying to **Dawn | Starlight**!\n\nYour application has been submitted and will be reviewed by our officers. You should hear back within 24-48 hours.\n\n**What happens next?**\n• Our officers will review your application\n• You'll receive a DM with the decision\n• If approved, you'll receive an invite link`)
            .setFooter({ text: 'Dawn | Starlight' })
            .setTimestamp();

        await user.send({ embeds: [confirmEmbed] });

        // Clean up
        activeApplications.delete(user.id);
        console.log('[APPLICATION] Application submitted successfully for', user.tag);

    } catch (error) {
        console.error('[APPLICATION] Error submitting application:', error);
        await user.send('❌ There was an error submitting your application. Please contact an admin.');
        activeApplications.delete(user.id);
    }
}

async function handleApplicationReview(interaction, approved) {
    const userId = interaction.customId.split('_')[2];
    
    console.log(`[APPLICATION] Review action: ${approved ? 'APPROVE' : 'DENY'} for user ${userId}`);

    try {
        const user = await interaction.client.users.fetch(userId);
        
        if (approved) {
            const approveEmbed = new EmbedBuilder()
                .setTitle('🎉 Application Approved!')
                .setColor(0x00ff00)
                .setDescription(`Congratulations! Your application to join **Dawn | Starlight** in Blue Protocol has been **approved**!\n\nWelcome to the guild! An officer will contact you in-game soon to send you an invite.\n\nSee you in Blue Protocol!`)
                .setFooter({ text: 'Dawn | Starlight' })
                .setTimestamp();
            
            await user.send({ embeds: [approveEmbed] });
            
            await interaction.reply({ 
                content: `✅ Application approved! ${user.tag} has been notified.`,
                flags: 64 
            });
        } else {
            const denyEmbed = new EmbedBuilder()
                .setTitle('Application Update')
                .setColor(0xff9900)
                .setDescription(`Thank you for your interest in **Dawn | Starlight**.\n\nUnfortunately, we are unable to accept your application at this time. This could be due to various reasons such as guild capacity or requirements.\n\nYou're welcome to apply again in the future!`)
                .setFooter({ text: 'Dawn | Starlight' })
                .setTimestamp();
            
            await user.send({ embeds: [denyEmbed] });
            
            await interaction.reply({ 
                content: `❌ Application denied. ${user.tag} has been notified.`,
                flags: 64 
            });
        }

        // Update the original message to show it's been reviewed
        const originalEmbed = interaction.message.embeds[0];
        const updatedEmbed = EmbedBuilder.from(originalEmbed)
            .setColor(approved ? 0x00ff00 : 0xff0000)
            .setTitle(`${approved ? '✅ APPROVED' : '❌ DENIED'} - ${originalEmbed.title}`);

        await interaction.message.edit({ 
            embeds: [updatedEmbed], 
            components: [] // Remove buttons
        });

        console.log(`[APPLICATION] Review completed: ${approved ? 'APPROVED' : 'DENIED'}`);

    } catch (error) {
        console.error('[APPLICATION] Error in review process:', error);
        await interaction.reply({ 
            content: '❌ There was an error processing this review.',
            flags: 64 
        });
    }
}

module.exports = {
    handleApplicationCommand,
    handleApplicationButton,
    handleDMResponse,
    handleApplicationReview,
};

