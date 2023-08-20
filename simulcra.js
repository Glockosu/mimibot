const fs = require('fs');
const path = require('path');
const { MessageSelectMenu, MessageActionRow, MessageEmbed } = require('discord.js');

const characterDataCache = {};
const matriceDataCache = {};
const characterImageArray = {
  'alyss': 'https://i.ibb.co/fM4hBcT/alyss.png',
  'annabella': 'https://i.ibb.co/0BLt2vY/annabella.png',
  'baiyueki': 'https://i.ibb.co/whKD5FD/baiyueki.png',
  'claudia': 'https://i.ibb.co/KxJD3Pw/claudia.png',
  'cobalt-b': 'https://i.ibb.co/vXwcfjB/cobalt-b.png',
  'cocoritter': 'https://i.ibb.co/HKdLC9d/cocoritter.png',
  'crow': 'https://i.ibb.co/YdTDN0g/crow.png',
  'fenrir': 'https://i.ibb.co/8KGJ6km/fenrir.png',
  'fiona': 'https://i.ibb.co/q0w4tyV/fiona.png',
  'frigg': 'https://i.ibb.co/ctkyjJc/frigg.png',
  'garnett': 'https://i.ibb.co/94yXqRx/garnett.png',
  'gnonno': 'https://i.ibb.co/MPMhTGw/gnonno.png',
  'haboela': 'https://i.ibb.co/spSs4pX/haboela.png',
  'huma': 'https://i.ibb.co/RvhjxH3/huma.png',
  'icarus': 'https://i.ibb.co/bXsBZCQ/icarus.png',
  'king': 'https://i.ibb.co/cvfKMvW/king.png',
  'lan': 'https://i.ibb.co/khWF5ws/lan.png',
  'lin': 'https://i.ibb.co/vBnznRt/lin.png',
  'lyra': 'https://i.ibb.co/LgmdqgK/lyra.png',
  'mark': 'https://i.ibb.co/rQt7Vdd/mark.png',
  'meryl': 'https://i.ibb.co/Y2YLY9d/meryl.png',
  'nemesis': 'https://i.ibb.co/nkKZmgm/nemesis.png',
  'rubillia': 'https://i.ibb.co/YX2R6fR/rubillia.png',
  'ruby': 'https://i.ibb.co/PZnnm01/ruby.png',
  'saki-fuwa': 'https://i.ibb.co/Bq7WjLk/saki.png',
  'samir': 'https://i.ibb.co/q7Nfv6H/samir.png',
  'scylla': 'https://i.ibb.co/myC60tL/scylla.png',
  'shiro': 'https://i.ibb.co/MMLDRwt/shiro.png',
  'tian-lang': 'https://i.ibb.co/CHL64x3/tian.png',
  'tsubasa': 'https://i.ibb.co/Njk4Nw6/tsubasa.png',
  'umi': 'https://i.ibb.co/fGQ37y4/umi.png',
  'yulan': 'https://i.ibb.co/khRK30g/yulan.png',
  'zero': 'https://i.ibb.co/sqDPVQY/zero.png'
};

function readCharacterData(selectedLabel) {
  const dataDir = 'data/weapons';

  try {
    // Read and parse the selected JSON data
    const filename = `${selectedLabel.toLowerCase()}.json`;
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    const characterData = JSON.parse(data);

    return characterData;
  } catch (error) {
    console.error(`Error reading or parsing JSON for ${selectedLabel}:`, error);
    return null;
  }
}

function readMatriceData(selectedLabel) {
  const dataDir = 'data/matrices';

  try {
    // Read and parse the selected JSON data
    const filename = `${selectedLabel.toLowerCase()}.json`;
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    const matriceData = JSON.parse(data);

    return matriceData;
  } catch (error) {
    console.error(`Error reading or parsing JSON for ${selectedLabel}:`, error);
    return null;
  }
}

function parseMatriceInfo(setsData) {
  // Assuming "sets" is an array property in your matriceData
  if (Array.isArray(setsData.sets)) {
    return setsData.sets.map((set) => ({
      name: set.pieces + 'pc',
      description: set.description,
    }));
  }

  // Return an empty array if "sets" is not found in matriceData
  return [];
}


function generateCharacterMenuRow() {
  const characterMenu = new MessageSelectMenu()
    .setCustomId('SimulcraCharacter')
    .setPlaceholder('Select a character')
    .addOptions([
      { label: 'alyss', emoji: "<:alyss:1138553284555190384>", value: 'Alyss', description: "Unyielding Wing" },
      { label: 'annabella', emoji: "<:annabella:1138553286333583370>", value: 'Annabella', description: "Clover Cross" },
      { label: 'claudia', emoji: "<:claudia:1138553288896294972>", value: 'Claudia', description: "Guren Blade" },
      { label: 'cobalt-b', emoji: "<:cobaltb:1138553291391897611>", value: 'Cobalt-B', description: "Flaming Revolver" },
      { label: 'fenrir', emoji: "<:fenrir:1138553326850560060>", value: 'Fenrir', description: "Gleipnir" },
      { label: 'fiona', emoji: "<:fiona:1138553328637325372>", value: 'Fiona', description: "Moonstar Bracelet" },
      { label: 'frigg', emoji: "<:frigg:1138553361885581483>", value: 'Frigg', description: "Balmung" },
      { label: 'garnett', emoji: "<:garnett:1138553363961753650>", value: 'Liu Huo', description: "Pine Comet" },
      { label: 'gnonno', emoji: "<:gnonno:1138553366130204872>", value: 'Gnonno', description: "Mini Hurricane" },
      { label: 'icarus', emoji: "<:icarus:1138553395951702057>", value: 'Icarus', description: "Precious One" },
      { label: 'lan', emoji: "<:lan:1138553400024383569>", value: 'Lan', description: "Lingguang" },
      { label: 'lin', emoji: "<:lin:1138553401844715690>", value: 'Lin', description: "Shadoweave" },
      { label: 'lyra', emoji: "<:lyra:1138553428365283388>", value: 'Lyra', description: "Vesper" },
      { label: 'nemesis', emoji: "<:nemesis:1138553433763348580>", value: 'Nemesis', description: "Venus" },
      { label: 'rubilia', emoji: "<:rubillia:1138553456492290048>", value: 'Rubilia', description: "Lost Art" },
      { label: 'ruby', emoji: "<:ruby:1138553458677534822>", value: 'Ruby', description: "Spark" },
      { label: 'saki-fuwa', emoji: "<:saki:1138553460573347953>", value: 'Saki Fuwa', description: "Heartstream" },
      { label: 'tian-lang', emoji: "<:tianlang:1138553512515604550>", value: 'Tian Lang', description: "Thunderbreaker" },
      { label: 'umi', emoji: "<:umi:1138553515996893244>", value: 'Umi', description: "Mobius" },
      { label: 'yulan', emoji: "<:yulan:1138553482694111232>", value: 'Yulan', description: "Unity" },
    ]);

  const characterRow = new MessageActionRow().addComponents(characterMenu);

  return characterRow;
}

async function handleInteraction(interaction) {

  if (interaction.commandName === 'simulcra') {
    const characterRow = generateCharacterMenuRow();

    await interaction.reply({
      content: 'Please select a character:',
      components: [characterRow],
    });
  } else if (interaction.isSelectMenu()) {
    if (interaction.customId === 'SimulcraCharacter') {
      const selectedCharacterLabel = interaction.values[0];
      let characterData;

      // Check if characterData is already fetched and stored in the cache
      characterData = characterDataCache[selectedCharacterLabel];
      
      if (!characterData) {
        // If not found in the cache, fetch the character data using readCharacterData
        characterData = readCharacterData(selectedCharacterLabel);

        if (!characterData) {
          interaction.reply({
            content: 'Character data not found.',
            ephemeral: true,
          });
          return;
        }
        // Store the characterData in the cache for future reference
        characterDataCache[selectedCharacterLabel] = characterData;
        console.log(`Stored ${selectedCharacterLabel} in characterDataCache`);
      }

      interaction.message.selectedCharacterLabel = selectedCharacterLabel;

      const infoMenu = new MessageSelectMenu()
          .setCustomId('SimulcraData')
          .setPlaceholder('Select the info type')
          .addOptions([
            { label: 'matrices', emoji: '✨', value: 'sets', description: `${selectedCharacterLabel}'s Matrices!` },
            { label: 'weaponEffects', emoji: '✨', value: 'weaponEffects', description: `${selectedCharacterLabel}'s Weapon Effects!` },
            { label: 'advancements', emoji: '🎭', value: 'advancements', description: `${selectedCharacterLabel}'s Advancements!` },
            { label: 'abilities', emoji: '🔮', value: 'abilities', description: `${selectedCharacterLabel}'s Abilities!` },
            // { label: 'recommendedPairings', emoji: '👥', value: 'recommendedPairings', description: `${selectedCharacterLabel}'s Recommended Pairings!` },
            { label: 'recommendedMatrices', emoji: '🔢', value: 'recommendedMatrices', description: `${selectedCharacterLabel}'s Recommended Matrices!` },
            // Add other info type options here if needed
          ]);
  
        const infoRow = new MessageActionRow().addComponents(infoMenu);
  
        interaction.update({
          content: `You selected: ${selectedCharacterLabel}\nPlease select the info type:`,
          components: [infoRow],
          ephemeral: true,
        });
    } else if (interaction.customId === 'SimulcraData') {
        const selectedCharacterLabel = interaction.message.selectedCharacterLabel;
        const selectedInfoType = interaction.values[0];
        const specificData = parseCharacterInfo(characterDataCache[selectedCharacterLabel], selectedInfoType);
  
      if (selectedInfoType === 'weaponEffects') {
          // Create a MessageEmbed to display the formatted data
          const embed = new MessageEmbed()
            .setTitle(`${selectedCharacterLabel}'s Weapon Effects`)
            .setColor('#00bfff') // Set a blue color for weapon effects
            .setDescription(specificData.map((effect) => `**${effect.title}**: ${effect.description}`).join('\n\n'));
  
          interaction.reply({ embeds: [embed] });
      } else if (selectedInfoType === 'advancements') {
          // Create a MessageEmbed to display the formatted data
          const embed = new MessageEmbed()
            .setTitle(`${selectedCharacterLabel}'s Advancements`)
            .setColor('#32c980') // Set mimi color
            .setDescription(specificData.map((advancement, index) => `**${index + 1}★:**  ${advancement}`).join('\n\n'));
  
          interaction.reply({ embeds: [embed] });
      } else if (selectedInfoType === 'abilities') {
        const abilitiesDescription = specificData.map((ability) => {
            const breakdown = ability.breakdown && ability.breakdown.length > 0
                ? `**Damage Breakdown:**\n${ability.breakdown.map((dmg) => `-${dmg}`).join('\n')}`
                : '';
            const descriptionWithBreakdown = breakdown ? `${ability.description}\n\n${breakdown}` : ability.description;
            return `**${ability.name}**: ${descriptionWithBreakdown}\n\n`;
        }).join('');
        
        const descriptionChunks = splitDescriptionIntoChunks(abilitiesDescription);
    
        // Create an array of embeds with the ability information
        const embeds = descriptionChunks.map((chunk, index) => {
            const title = index === 0 ? `${selectedCharacterLabel}'s Abilities` : '';
            return new MessageEmbed()
                .setTitle(title)
                .setColor('#ff9900') // Set a different color for abilities
                .setDescription(chunk);
        });
    
        interaction.reply({ embeds });
      } else if (selectedInfoType === 'recommendedPairings') {
        // Create a MessageEmbed to display the formatted data
        const embed = new MessageEmbed()
            .setTitle(`${selectedCharacterLabel}'s Recommended Pairings`)
            .setColor('#ff3399') // Set a different color for recommended pairings
            .setDescription(specificData.join('\n'));
  
          interaction.reply({ embeds: [embed] });
      } else if (selectedInfoType === 'recommendedMatrices') {
          // Create a MessageEmbed to display the formatted data
          const embed = new MessageEmbed()
            .setTitle(`${selectedCharacterLabel}'s Recommended Matrices`)
            .setColor('#9933ff') // Set a different color for recommended matrices
            .setDescription(specificData.map((matrix) => `**${matrix.name}**: ${matrix.description}`).join('\n\n'));
  
          interaction.reply({ embeds: [embed] });
      } else if (selectedInfoType === 'sets') {
        let matriceData;
        matriceData = matriceDataCache[selectedCharacterLabel];

        if (!matriceData) {
          // If not found in the cache, fetch the matrice data using readMatriceData
          matriceData = readMatriceData(selectedCharacterLabel);

          if (!matriceData) {
            interaction.reply({
              content: 'Matrice data not found.',
              ephemeral: true,
            });
            return;
          }
          // Store the matriceData in the cache for future reference
          matriceDataCache[selectedCharacterLabel] = matriceData;
        }

        const specificData = parseMatriceInfo(matriceDataCache[selectedCharacterLabel]);
        const characterImageURL = characterImageArray[selectedCharacterLabel.toLowerCase()];

        // Create a MessageEmbed to display the formatted data
        const embed = new MessageEmbed()
          .setTitle(`${selectedCharacterLabel}'s Matrices`)
          .setColor('#9933ff') // Set a different color for recommended matrices
          .setDescription(specificData.map((matrix) => `**${matrix.name}**: ${matrix.description}`).join('\n\n'))
          .setThumbnail(characterImageURL);

        interaction.reply({ embeds: [embed] });
      }
    }
  }
}

function parseCharacterInfo(characterData, selectedType) {
  if (selectedType === 'weaponEffects') {
    const weaponEffectsText = characterData.weaponEffects.map((effect) => ({
      title: effect.title.replace(/\*/g, '').replace(/\n/g, ''),
      description: effect.description.replace(/\*/g, '').replace(/\n/g, '').replace(/\+/g, ''),
    }));
    return weaponEffectsText;
  } else if (selectedType === 'advancements') {
    const advancementsText = characterData.advancements.map((advancement) => {
      return advancement;
    });
    return advancementsText;
  } else if (selectedType === 'abilities') {
    const abilitiesText = characterData.abilities.map((ability) => ({
      name: ability.name,
      description: ability.description,
      breakdown: ability.breakdown,
    }));
    return abilitiesText;
  } else if (selectedType === 'recommendedPairings') {
    const pairingsText = characterData.recommendedPairings.map((pairing) => pairing);
    return pairingsText;
  } else if (selectedType === 'recommendedMatrices') {
    const matricesText = characterData.recommendedMatrices.map((matrix) => ({
      name: matrix.name,
      description: matrix.description,
    }));
    return matricesText;
  }
  // Add other info type options here if needed in the future
  return `Selected info type "${selectedType}" not found in character data.`;
}

function splitDescriptionIntoChunks(description) {
  const chunkSize = 2048; // Limit for description chunks in an embed
  const paragraphs = description.split('\n\n');
  const chunks = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const paragraphLength = paragraph.length;

    if (currentChunk.length + paragraphLength + 2 <= chunkSize) {
      currentChunk += `\n\n${paragraph}`;
    } else {
      chunks.push(currentChunk);
      currentChunk = `\n\n${paragraph}`;
    }

    // Check if the current chunk is nearing the field limit
    if (chunks.length >= 25) {
      break;
    }
  }

  // Add the last chunk if it's not empty
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

module.exports = {
  handleInteraction,
};