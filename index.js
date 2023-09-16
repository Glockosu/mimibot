const { Client, Intents} = require('discord.js');
const {handleInteraction} = require('./simulcra');
const {handleScheduleCommand, handleTimes} = require("./schedule");
const {rotationHandler} = require("./rotation");
const {registerSlashCommands} = require("./slashCommands");
const {handleFate} = require("./fate")
const {finalDmg} = require("./dpscalc");
require('dotenv/config');

const fs = require('fs');
const path = require('path');
const scheduledGroups = new Map();

const mimibot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

mimibot.once('ready', () => {
  console.log('Ready!');
  // Register the slash command globally
  registerSlashCommands(mimibot);
});

mimibot.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === 'rotation') {
    rotationHandler(interaction);
  }
  if (interaction.isCommand() && interaction.commandName === 'fate') {
    handleFate(interaction);
  }
  if (interaction.isCommand() && interaction.commandName === 'dps') {
    finalDmg(interaction);
  }
  if (interaction.isCommand() && interaction.commandName === 'schedule') {
    const selectedTimes = interaction.options.getString('times').split(',').map((time) => time.trim());
    handleScheduleCommand(interaction, selectedTimes); // Pass selectedTimes to the handleScheduleCommand function
  } else if (interaction.customId === 'ScheduleTime') {
    handleTimes(interaction);
  }
  if (!interaction.isCommand() && !interaction.isSelectMenu()) return;
  else {
    await handleInteraction(interaction);
  } 
});
  
mimibot.login(process.env.TOKEN);