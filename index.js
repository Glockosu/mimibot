const { Client, GatewayIntentBits, PermissionFlagsBits, Partials, ChannelType } = require('discord.js');
const {handleInteraction} = require('./simulcra');
const {handleScheduleCommand, handleTimes} = require("./schedule");
const {rotationHandler} = require("./rotation");
const {registerSlashCommands} = require("./slashCommands");
const {handleFate} = require("./fate")
const {finalDmg} = require("./dpscalc");
const {handleMetaCommand} = require("./meta")
const {handleDPSHelpCommand} = require("./dpscalchelp")
const {handleJoin} = require("./join")
const {blameCommand} = require("./blame")
const {handlePullCalcCommand}= require("./pullcalc")
const {handleAssignTofRole} = require("./assignrole")
const {handleApplicationCommand, handleApplicationButton, handleDMResponse, handleApplicationReview} = require("./application")
const {handleRaidCommand, handleRaidSignupButton, handleRoleSelection, handleRaidAvailabilitySubmit, handleViewRoster, handleSuggestTimes, handleTimeVote, handleResetRaid, handleRaidStatus} = require("./raid")
require('dotenv/config');

const fs = require('fs');
const path = require('path');
const scheduledGroups = new Map();

const mimibot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers, // Required to fetch and manage members
    GatewayIntentBits.DirectMessages, // Required to receive DMs for applications
    GatewayIntentBits.MessageContent, // Required to read message content in DMs
  ],
  partials: [Partials.Channel], // Required to receive DMs
});

mimibot.once('ready', () => {
  console.log('Ready!');
  // Register the slash command globally
  registerSlashCommands(mimibot);
});

// Handle DM messages for applications
mimibot.on('messageCreate', async (message) => {
  // Only handle DMs
  if (message.channel.type === ChannelType.DM) {
    await handleDMResponse(message);
  }
});

mimibot.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    try {
      switch (interaction.commandName) {
        case 'rotation':
          await rotationHandler(interaction);
          break;
        case 'fate':
          await handleFate(interaction);
          break;
        case 'dps':
          await finalDmg(interaction);
          break;
        case 'schedule':
          const selectedTimes = interaction.options.getString('times').split(',').map((time) => time.trim());
          await handleScheduleCommand(interaction, selectedTimes);
          break;
        case 'meta':
          const element = interaction.options.getString('element');
          const investment = interaction.options.getString('investment');
          await handleMetaCommand(element, investment, interaction);
          break;
        case 'dpshelp':
          await handleDPSHelpCommand(interaction);
          break;
        case 'blame':
          await blameCommand(interaction);
          break;
        case 'join':
          if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await handleJoin(interaction);
          } else {
            await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
          }
          break;
        case 'pullcalc':
          await handlePullCalcCommand(interaction);
          break;
        case 'assigntofrole':
          if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await handleAssignTofRole(interaction);
          } else {
            await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
          }
          break;
        case 'bpapply':
          await handleApplicationCommand(interaction);
          break;
        case 'raid':
          await handleRaidCommand(interaction);
          break;
        case 'raidreset':
          if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await handleResetRaid(interaction);
          } else {
            await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
          }
          break;
        case 'raidstatus':
          if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await handleRaidStatus(interaction);
          } else {
            await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
          }
          break;
        default:
          await handleInteraction(interaction);
          break;
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
      const errorMessage = { content: 'There was an error executing this command!', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
    } else if (interaction.isButton()) {
    try {
      if (interaction.customId === 'ScheduleTime') {
        await handleTimes(interaction);
      } else if (interaction.customId === 'bp_apply_button') {
        await handleApplicationButton(interaction);
      } else if (interaction.customId.startsWith('bp_approve_')) {
        await handleApplicationReview(interaction, true);
      } else if (interaction.customId.startsWith('bp_deny_')) {
        await handleApplicationReview(interaction, false);
      } else if (interaction.customId === 'raid_signup_button') {
        await handleRaidSignupButton(interaction);
      } else if (interaction.customId === 'raid_view_roster') {
        await handleViewRoster(interaction);
      } else if (interaction.customId === 'raid_suggest_times') {
        await handleSuggestTimes(interaction);
      } else if (interaction.customId.startsWith('raid_vote_')) {
        await handleTimeVote(interaction);
      }
    } catch (error) {
      console.error('Error handling button interaction:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'There was an error processing this button. Please try again.', ephemeral: true });
      }
    }
  } else if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'raid_role_select') {
      await handleRoleSelection(interaction);
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('raid_availability_')) {
      await handleRaidAvailabilitySubmit(interaction);
    }
  }
});
  
mimibot.login(process.env.TOKEN);