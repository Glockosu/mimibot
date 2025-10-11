const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
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
require('dotenv/config');

const fs = require('fs');
const path = require('path');
const scheduledGroups = new Map();

const mimibot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers, // Required to fetch and manage members
  ],
});

mimibot.once('ready', () => {
  console.log('Ready!');
  // Register the slash command globally
  registerSlashCommands(mimibot);
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
  } else if (interaction.isButton() && interaction.customId === 'ScheduleTime') {
    await handleTimes(interaction);
  }
});
  
mimibot.login(process.env.TOKEN);