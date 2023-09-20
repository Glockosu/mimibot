const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { characterEmoji, matriceEmoji, skillEmoji } = require('./storage');
const stringSimilarity = require('string-similarity');
const { calculateDPS } = require('./dpscalc');

const flameCompsWhale = {
  annaLiuZekeFlame: {
    characters: ["annabellagas6", "liu6", "zeke6"],
    sets: ["annabella4pc3", "liu4pc3", "zeke4pc3"],
    extra: ["liu"],
  },
  annaLanZekeFlame: {
    characters: ["annabellagas6", "lan6", "zeke6"],
    sets: ["annabella4pc3", "liu4pc3", "zeke4pc3"],
    extra: ["liu"],
  },
  annaLiuLanFlame: {
    characters: ["annabellagas6", "lan6", "liu6"],
    sets: ["annabella4pc3", "liu4pc3", "lan4pc3"],
    extra: ["liu"],
  },
  fionaLiuZekeFlame: {
    characters: ["zeke6", "liu6", "fiona6"],
    sets: ["zeke4pc3", "liu4pc3", "fiona4pc3"],
    extra: ["zeke", "wellspring", "maelstrom"],
  },
  fionaLiuLanFlame: {
    characters: ["liu6", "lan6", "fiona6"],
    sets: ["liu4pc3", "lan4pc3", "fiona4pc3"],
    extra: ["liu", "wellspring", "maelstrom"],
  },
};

function calculateDPSForCompositions(compositions) {
    const dpsValues = {};
  
    for (const compositionName in compositions) {
      if (compositions.hasOwnProperty(compositionName)) {
        const input = compositions[compositionName];
        const { characters, sets, extra } = input;
        const dps = calculateDPS(...characters, ...sets, ...extra);
  
        dpsValues[compositionName] = dps;
      }
    }
  
    return dpsValues;
}

const frostCompsWhale = {};

function parseDpsData(compositions) {
    const parsedData = {};
  
    for (const compositionName in compositions) {
      if (compositions.hasOwnProperty(compositionName)) {
        const input = compositions[compositionName];
        const dpsResult = calculateDPSForCompositions(input);
        if (dpsResult) {
          parsedData[compositionName] = dpsResult;
        }
      }
    }
  
    return parsedData;
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

// Command handler
async function handleMetaCommand(element, investment, interaction) {
  const comps = getComps(element, investment);
  const parsedData = parseDpsData(comps);
  let investmentEmoji = `:whale:`;

  if (investment == "whale") {
    investmentEmoji = `:whale:`;
  }

  const embed = new MessageEmbed()
    .setTitle(`Meta Comps for ${element} ${investmentEmoji}`)
    .setColor('#FF5733');

  for (const key in parsedData) {
    if (parsedData.hasOwnProperty(key)) {
      embed.addField(key, parsedData[key]);
    }
  }

  // Send the embed to the channel where the interaction was invoked
  await interaction.reply({ embeds: [embed] });
}

module.exports = { handleMetaCommand };