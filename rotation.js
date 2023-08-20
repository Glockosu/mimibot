const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');


const rotationVideo = {
  'alyss-icarus-yulan': `https://www.youtube.com/watch?v=_3Lt7EicOBA`,
  'alyss-fiona-yulan': `https://youtu.be/dzJsBQVVNe0?t=615`,
};

const validCharacters = [
  { name: 'alyss', value: 'alyss' },
  { name: 'annabella', value: 'annabella' },
  { name: 'claudia', value: 'claudia' },
  { name: 'cobalt-b', value: 'cobalt-b' },
  { name: 'cocoritter', value: 'cocoritter' },
  { name: 'crow', value: 'crow' },
  { name: 'fenrir', value: 'fenrir' },
  { name: 'fiona', value: 'fiona' },
  { name: 'frigg', value: 'frigg' },
  { name: 'garnett', value: 'garnett' },
  { name: 'gnonno', value: 'gnonno' },
  { name: 'huma', value: 'huma' },
  { name: 'icarus', value: 'icarus' },
  { name: 'king', value: 'king' },
  { name: 'lan', value: 'lan' },
  { name: 'lin', value: 'lin' },
  { name: 'lyra', value: 'lyra' },
  { name: 'meryl', value: 'meryl' },
  { name: 'nemesis', value: 'nemesis' },
  { name: 'rubillia', value: 'rubillia' },
  { name: 'ruby', value: 'ruby' },
  { name: 'saki-fuwa', value: 'saki-fuwa' },
  { name: 'samir', value: 'samir' },
  { name: 'shiro', value: 'shiro' },
  { name: 'tian-lang', value: 'tian-lang' },
  { name: 'tsubasa', value: 'tsubasa' },
  { name: 'umi', value: 'umi' },
  { name: 'yulan', value: 'yulan' },
  { name: 'zero', value: 'zero' }
];

function isValidCharacter(character) {
  const lowercaseCharacter = character.toLowerCase().trim();
  return validCharacters.some((charObj) => charObj.value === lowercaseCharacter);
}

function createRotationEmbed(rotationData) {
  const { rotationDescription, rotationTitle, rotationVideoLink } = rotationData;

  const embed = new MessageEmbed()
    .setTitle(rotationTitle)
    .setDescription(rotationDescription)
    .setColor('#00ff00'); // You can change the color to your liking

  if (rotationVideoLink) {
    embed.addField('Rotation Video', rotationVideoLink);
  }

  return embed;
}

function generateRotationData(charactersInput) {
  // Split the characters input by commas and convert to lowercase
  const characters = charactersInput.toLowerCase().split(',').map((char) => char.trim());

  // Check for duplicate characters
  const characterDupe = new Set(characters).size !== characters.length;

  // Collect incorrect characters
  const incorrectCharacters = characters.filter((char) => !isValidCharacter(char));

  if (incorrectCharacters.length > 0 || characterDupe || characters.length !==3) {
    if (characters.length !== 3) {
      return `Please input 3 characters in the format **character1, character2, character3**. Thank you! <3`;
    }
    if (incorrectCharacters.length === 1) {
      return `Character **"${incorrectCharacters[0]}"** not found in our database.`;
    } 
    if (incorrectCharacters.length >= 2) {
      return `Characters **"${incorrectCharacters.join('**, **"')}**" were not found in our database.`;
    }
    if (characterDupe) {
      return `Duplicate character queries. Please don't put the same character more than once.`;
    }
  } else {
    // Process the characters as needed
    const [character1, character2, character3] = characters;

    // For example, you can generate a rotation key as a single string
    const rotationKey = [character1, character2, character3].sort().join('-');

    const rotationDescription = `The rotation is done with ${character1}, ${character2}, and ${character3}.`;
    const rotationVideoLink = rotationVideo[rotationKey] || null; // Get the video link from the rotationVideo object, or null if not found

    const rotationTitle = `Rotation for ${character1}, ${character2}, and ${character3}`;

    const rotationData = { rotationDescription, rotationTitle, rotationVideoLink };

    // If the rotation is valid, return the embed
    return createRotationEmbed(rotationData);
  }
}

async function rotationHandler(interaction) {
  const { commandName, options } = interaction;
    if (commandName === 'rotation') {
      const characterList = interaction.options.getString('characters');

      // Generate the rotation data
      const rotationData = generateRotationData(characterList);

      if (typeof rotationData === 'string') {
        // If it's a string, send the plain text error message
        await interaction.reply(rotationData);
      } else {
        // If it's an object, send the embed with the rotation information
        await interaction.reply({ embeds: [rotationData] });
      }
    }
}

module.exports = {
  rotationHandler
};

