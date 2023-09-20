const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { characterEmoji, matriceEmoji, skillEmoji } = require('./storage');
const stringSimilarity = require('string-similarity');
const { calculateDPS } = require('./dpscalc');

const flameCompsWhale = {
  annaLiuZekeFlame: {
    characters: ["annagas6", "liu6", "zeke6"],
    sets: ["anna4pc3", "liu4pc3", "zeke4pc3"],
    trait: ["liu"],
    skills: [],
  },
  annaLanZekeFlame: {
    characters: ["annagas6", "lan6", "zeke6"],
    sets: ["anna4pc3", "liu4pc3", "zeke4pc3"],
    trait: ["liu"],
    skills: [],
  },
  annaLiuLanFlame: {
    characters: ["annagas6", "lan6", "liu6"],
    sets: ["anna4pc3", "liu4pc3", "lan4pc3"],
    trait: ["liu"],
    skills: [],
  },
  fionaLiuZekeFlame: {
    characters: ["zeke6", "liu6", "fiona6"],
    sets: ["zeke4pc3", "liu4pc3", "fiona4pc3"],
    trait: ["zeke"],
    skills: ["wellspring", "maelstrom"],
  },
  fionaLiuLanFlame: {
    characters: ["liu6", "lan6", "fiona6"],
    sets: ["liu4pc3", "lan4pc3", "fiona4pc3"],
    trait: ["liu"],
    skills: ["wellspring", "maelstrom"],
  },
};

const frostCompsWhale = {
  yulanFionaAlyssFrost: {
    characters: ["yulanmartial6", "fiona6", "alyss6"],
    sets: ["lyrasamir2pc3", "fiona4pc3", "yulan4pc3"],
    trait: ["yulan"],
    skills: ["wellspring", "maelstrom"],
  },
  yulanFionaIcarusFrost: {
    characters: ["yulansweeping6", "fiona6", "icarus6"],
    sets: ["fiona4pc3", "yulan4pc3", "icarus4pc3"],
    trait: ["yulan"],
    skills: ["hydro", "torrential"],
  },
  yulanFionaZekeFrost: {
    characters: ["yulanmartial6", "fiona6", "zeke6"],
    sets: ["lyrasamir2pc3", "fiona4pc3", "yulan4pc3"],
    trait: ["yulan"],
    skills: ["wellspring", "maelstrom"],
  },
  tripleFrost: {
    characters: ["yulansweeping6", "icarus6", "alyss6"],
    sets: ["yulan4pc3", "icarus4pc3", "alyss4pc3"],
    trait: ["yulan"],
    skills: [],
  },
}

function getCharacterEmoji(characterInput) {
  const characterNames = Object.keys(characterEmoji);
  const matches = stringSimilarity.findBestMatch(characterInput, characterNames);

  // Get the best match
  const bestMatch = matches.bestMatch;

  // Lower the similarity threshold (e.g., 0.6) to make matching less strict
  if (bestMatch.rating >= 0.3) {
    const characterName = bestMatch.target;
    return characterEmoji[characterName];
  } else {
    // If no suitable match is found, return 'Invalid Character'
    return 'Invalid Character';
  }
}

function getMatrixEmoji(matrixInput) {
  console.log(matrixInput)

  const matrixNames = Object.keys(matriceEmoji);
  const matches = stringSimilarity.findBestMatch(matrixInput, matrixNames);

  // Get the best match
  const bestMatch = matches.bestMatch;

  // Lower the similarity threshold (e.g., 0.6) to make matching less strict
  if (bestMatch.rating >= 0.3) {
    const matrixName = bestMatch.target;
    return matriceEmoji[matrixName];
  } else {
    // If no suitable match is found, return 'Invalid Matrix'
    return 'Invalid Matrix';
  }
}

// Function to get the emoji for a skill name
function getSkillEmoji(skillInput) {
  const skillNames = Object.keys(skillEmoji);
  const matches = stringSimilarity.findBestMatch(skillInput, skillNames);

  // Get the best match
  const bestMatch = matches.bestMatch;

  // Lower the similarity threshold (e.g., 0.3) to make matching less strict
  if (bestMatch.rating >= 0.3) {
      const skillName = bestMatch.target;
      return skillEmoji[skillName];
  } else {
      // If no suitable match is found, return 'Invalid Skill'
      return 'Invalid Skill';
  }
}


function formatCharacterNamesWithEmoji(compsData) {
  const formattedData = {};

  for (const key in compsData) {
    if (compsData.hasOwnProperty(key)) {
      const characters = compsData[key].characters;

      // Iterate over characters and format their names with emojis
      const formattedCharacters = characters.map(character => {
        const parts = character.split(/[0-9]/); // Split by digits
        const name = parts[0].trim();
        const stars = character.match(/[0-9]+/) || []; // Extract stars
        const emoji = getCharacterEmoji(name); // Get character emoji
        return `${emoji} ${name} ${stars[0] || ''}☆`; // Format with emoji
      });

      formattedData[key] = formattedCharacters;
    }
  }

  return formattedData;
}

function formatSetNamesWithEmoji(compsData) {
  const formattedData = {};

  for (const key in compsData) {
    if (compsData.hasOwnProperty(key)) {
      const sets = compsData[key].sets;

      // Iterate over sets and format their names with emojis
      const formattedSets = sets.map(set => {
        const emoji = getMatrixEmoji(set); // Get set emoji
        return `${emoji} ${set}`; // Format with emoji
      });

      formattedData[key] = formattedSets;
    }
  }

  return formattedData;
}


function calculateDPSForCompositions(compositions) {
  const dpsValues = {};

  for (const compositionName in compositions) {
    if (compositions.hasOwnProperty(compositionName)) {
      const input = compositions[compositionName];
      const { characters, sets, trait, skills } = input; // Include sets in destructuring

      // Spread the values as separate arguments to calculateDPS
      const dps = calculateDPS(...characters, ...sets, ...trait, ...skills); // Include sets in arguments

      dpsValues[compositionName] = dps;
    }
  }
  return dpsValues;
}




function getComps(element, investment) {
  // Replace 'element' and 'investment' with the actual values passed from the command
  if (element === 'flame' && investment === 'whale') {
    return flameCompsWhale;
  } else if (element === 'frost' && investment === 'whale') {
    return frostCompsWhale;
  }
  // Add more conditions for other elements and investments as needed

  // Default to an empty object if no matching conditions are found
  return {};
}

function parseDmgPercentData(dpsValues) {
  const parsedData = {};

  for (const key in dpsValues) {
    if (dpsValues.hasOwnProperty(key)) {
      parsedData[key] = dpsValues[key].dmgPercentPerMin;
    }
  }

  return parsedData;
}

// Command handler
async function handleMetaCommand(element, investment, interaction) {
  const comps = getComps(element, investment);
  const dpsValues = calculateDPSForCompositions(comps);
  const parsedData = parseDmgPercentData(dpsValues);
  const formattedCharacterData = formatCharacterNamesWithEmoji(comps);
  const formattedSetData = formatSetNamesWithEmoji(comps);

  let investmentEmoji = `:whale:`;

  if (investment == "whale") {
    investmentEmoji = `:whale:`;
  }

  const embed = new MessageEmbed()
    .setTitle(`Meta Comps for ${element} ${investmentEmoji}`)
    .setColor('#FF5733');

  const keys = Object.keys(parsedData);
  const numColumns = 3; // Change this number to the desired number of columns
  const numRows = Math.ceil(keys.length / numColumns);

  for (let row = 0; row < numRows; row++) {
    for (let column = 0; column < numColumns; column++) {
      const index = row + column * numRows;
      if (index < keys.length) {
        const key = keys[index];
        const value = parsedData[key];
        const formattedChars = formattedCharacterData[key];
        const formattedSets = formattedSetData[key];

        if (Array.isArray(formattedChars) && formattedChars.length > 0) {
          embed.addField('Characters', formattedChars.join('\n'), true);
        } else {
          console.error(`Invalid or empty formatted characters for key "${key}"`);
        }

        if (Array.isArray(formattedSets) && formattedSets.length > 0) {
          embed.addField('Sets', formattedSets.join('\n'), true);
        } else {
          console.error(`Invalid or empty formatted sets for key "${key}"`);
        }

        // Add Trait and Skills inline with Dmg%/Min
        if (typeof value === 'string' && value.trim() !== '') {
          // Use a non-empty string as a placeholder for the field name
          const fieldName = 'Final';
          const trait = comps[key].trait.join(', ');
          const skills = comps[key].skills.join(', ');

          const traitEmoji = getCharacterEmoji(trait);
          const skillsEmoji = getSkillEmoji(skills);
          embed.addField(fieldName, `**Trait:** ${traitEmoji}  ${trait} \n**Skills:**  ${skillsEmoji}  ${skills} \n \`${value} Dmg%/Min\`\n`, true);
        } else {
          console.error(`Invalid or empty value for field "${key}"`);
        }
      }
    }
  }

  await interaction.reply({ embeds: [embed] });
}

module.exports = { handleMetaCommand };