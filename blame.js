const { AttachmentBuilder } = require('discord.js');

// Create a map to store the blame counts for each user
const blameCounts = new Map();

async function blameCommand(interaction) {
  try {
    // Get the blamed user from the interaction options
    const blamedUser = interaction.options.getString('user');

    if (!blamedUser) {
      return interaction.reply('Please provide the name of the person you want to blame.');
    }

    // Check if the blamed user is you
    const isBlamingYou = blamedUser.toLowerCase() === 'glock' || blamedUser === '<@336352740643045376>';

    if (isBlamingYou) {
      // Respond with a special message for you
      const specialResponse = 'Never blame Glock! \n https://tenor.com/view/huang-qinglong-disappointed-unamused-not-impressed-anime-girl-gif-17671665136768842080';
      return interaction.reply(specialResponse);
    }

    // Increment the blame count for the user
    const blameCount = blameCounts.get(blamedUser) || 0;
    blameCounts.set(blamedUser, blameCount + 1);

    // Get the blame count for the user
    const currentBlameCount = blameCounts.get(blamedUser) + 4;

    // Construct the response with the blame count
    const response = `${blamedUser} has been blamed a total of ${currentBlameCount} times.`;

    const blameUrl = 'https://tenor.com/view/huang-qinglong-facepalm-epic-fail-anime-girl-huang-gif-4363881028432147451';

    // Reply to the interaction with the response and GIF
    interaction.reply({
      content: response + '\n' + blameUrl,
    });
  } catch (error) {
    console.error('Error in blameCommand:', error);
    interaction.reply('An error occurred while processing the command. Please try again.');
  }
}

module.exports = {
  blameCommand,
};