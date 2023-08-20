const { MessageEmbed } = require('discord.js');

// List of possible fates
const possibleFates = [
  'are caught in a whirlwind romance',
  'engage in mischievous escapades together',
  'discovered they both had a foot fetish together',
  'embark on wild adventures across dimensions',
  'are passionate sex partners',
  'share a secret love potion-induced connection',
  'become partners-in-crime',
  'discover an unexpected attraction',
  'create a legendary romance that echoes through time',
  `are brother and sister`,
];

const possibleDescriptions = [
  { description: 'In most parallel worlds.....', color: '#FF0000' },
  { description: `In ${generateRandomNumber()} years.....`, color: '#00FF00' },
];

function generateRandomNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

function generateRandomFate(user1, user2) {
  const randomFate = possibleFates[Math.floor(Math.random() * possibleFates.length)];
  return `**${user1}** and **${user2}** ${randomFate}.`; // Added bold formatting
}

async function handleFate(interaction) {
  const user1 = interaction.user.username;
  const mentionedUser = interaction.options.getMember('user');

  if (!mentionedUser) {
    await interaction.reply('Please mention one user.');
    return;
  }

  const user2 = mentionedUser.user.username;

  if (mentionedUser.id === interaction.user.id) {
    await interaction.reply({ content: "You can't set a fate with yourself, dummy.", ephemeral: true });
    return;
  }

  const fateTitle = generateRandomFate(user1, user2);
  const randomDescription = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];

  const embed = new MessageEmbed()
    .setTitle(fateTitle)
    .setDescription(randomDescription.description)
    .setColor(randomDescription.color);

  await interaction.reply({ embeds: [embed] });
}

module.exports = {
  handleFate,
};




