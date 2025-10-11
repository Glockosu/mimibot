const fs = require('fs');
const path = require('path');
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

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
  const characterMenu = new StringSelectMenuBuilder()
    .setCustomId('SimulcraCharacter')
    .setPlaceholder('Select a character')
    .addOptions([
      new StringSelectMenuOptionBuilder().setLabel('alyss').setEmoji("<:alyss:1138553284555190384>").setValue('Alyss').setDescription("Unyielding Wing"),
      new StringSelectMenuOptionBuilder().setLabel('annabella').setEmoji("<:annabella:1138553286333583370>").setValue('Annabella').setDescription("Clover Cross"),
      new StringSelectMenuOptionBuilder().setLabel('claudia').setEmoji("<:claudia:1138553288896294972>").setValue('Claudia').setDescription("Guren Blade"),
      new StringSelectMenuOptionBuilder().setLabel('cobalt-b').setEmoji("<:cobaltb:1138553291391897611>").setValue('Cobalt-B').setDescription("Flaming Revolver"),
      new StringSelectMenuOptionBuilder().setLabel('fenrir').setEmoji("<:fenrir:1138553326850560060>").setValue('Fenrir').setDescription("Gleipnir"),
      new StringSelectMenuOptionBuilder().setLabel('fiona').setEmoji("<:fiona:1138553328637325372>").setValue('Fiona').setDescription("Moonstar Bracelet"),
      new StringSelectMenuOptionBuilder().setLabel('frigg').setEmoji("<:frigg:1138553361885581483>").setValue('Frigg').setDescription("Balmung"),
      new StringSelectMenuOptionBuilder().setLabel('garnett').setEmoji("<:garnett:1138553363961753650>").setValue('Liu Huo').setDescription("Pine Comet"),
      new StringSelectMenuOptionBuilder().setLabel('gnonno').setEmoji("<:gnonno:1138553366130204872>").setValue('Gnonno').setDescription("Mini Hurricane"),
      new StringSelectMenuOptionBuilder().setLabel('icarus').setEmoji("<:icarus:1138553395951702057>").setValue('Icarus').setDescription("Precious One"),
      new StringSelectMenuOptionBuilder().setLabel('lan').setEmoji("<:lan:1138553400024383569>").setValue('Lan').setDescription("Lingguang"),
      new StringSelectMenuOptionBuilder().setLabel('lin').setEmoji("<:lin:1138553401844715690>").setValue('Lin').setDescription("Shadoweave"),
      new StringSelectMenuOptionBuilder().setLabel('lyra').setEmoji("<:lyra:1138553428365283388>").setValue('Lyra').setDescription("Vesper"),
      new StringSelectMenuOptionBuilder().setLabel('nemesis').setEmoji("<:nemesis:1138553433763348580>").setValue('Nemesis').setDescription("Venus"),
      new StringSelectMenuOptionBuilder().setLabel('rubilia').setEmoji("<:rubillia:1138553456492290048>").setValue('Rubilia').setDescription("Lost Art"),
      new StringSelectMenuOptionBuilder().setLabel('ruby').setEmoji("<:ruby:1138553458677534822>").setValue('Ruby').setDescription("Spark"),
      new StringSelectMenuOptionBuilder().setLabel('saki-fuwa').setEmoji("<:saki:1138553460573347953>").setValue('Saki Fuwa').setDescription("Heartstream"),
      new StringSelectMenuOptionBuilder().setLabel('tian-lang').setEmoji("<:tianlang:1138553512515604550>").setValue('Tian Lang').setDescription("Thunderbreaker"),
      new StringSelectMenuOptionBuilder().setLabel('umi').setEmoji("<:umi:1138553515996893244>").setValue('Umi').setDescription("Mobius"),
      new StringSelectMenuOptionBuilder().setLabel('yulan').setEmoji("<:yulan:1138553482694111232>").setValue('Yulan').setDescription("Unity"),
    ]);

  const characterRow = new ActionRowBuilder().addComponents(characterMenu);

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

      const infoMenu = new StringSelectMenuBuilder()
          .setCustomId('SimulcraData')
          .setPlaceholder('Select the info type')
          .addOptions([
            new StringSelectMenuOptionBuilder().setLabel('matrices').setEmoji('✨').setValue('sets').setDescription(`${selectedCharacterLabel}'s Matrices!`),
            new StringSelectMenuOptionBuilder().setLabel('weaponEffects').setEmoji('✨').setValue('weaponEffects').setDescription(`${selectedCharacterLabel}'s Weapon Effects!`),
            new StringSelectMenuOptionBuilder().setLabel('advancements').setEmoji('🎭').setValue('advancements').setDescription(`${selectedCharacterLabel}'s Advancements!`),
            new StringSelectMenuOptionBuilder().setLabel('abilities').setEmoji('🔮').setValue('abilities').setDescription(`${selectedCharacterLabel}'s Abilities!`),
            // { label: 'recommendedPairings', emoji: '👥', value: 'recommendedPairings', description: `${selectedCharacterLabel}'s Recommended Pairings!` },
            new StringSelectMenuOptionBuilder().setLabel('recommendedMatrices').setEmoji('🔢').setValue('recommendedMatrices').setDescription(`${selectedCharacterLabel}'s Recommended Matrices!`),
            // Add other info type options here if needed
          ]);
  
        const infoRow = new ActionRowBuilder().addComponents(infoMenu);
  
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
          // Create an EmbedBuilder to display the formatted data
          const embed = new EmbedBuilder()
            .setTitle(`${selectedCharacterLabel}'s Weapon Effects`)
            .setColor('#00bfff') // Set a blue color for weapon effects
            .setDescription(specificData.map((effect) => `**${effect.title}**: ${effect.description}`).join('\n\n'));
  
          interaction.reply({ embeds: [embed] });
      } else if (selectedInfoType === 'advancements') {
          // Create an EmbedBuilder to display the formatted data
          const embed = new EmbedBuilder()
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
            return new EmbedBuilder()
                .setTitle(title)
                .setColor('#ff9900') // Set a different color for abilities
                .setDescription(chunk);
        });
    
        interaction.reply({ embeds });
      } else if (selectedInfoType === 'recommendedPairings') {
        // Create an EmbedBuilder to display the formatted data
        const embed = new EmbedBuilder()
            .setTitle(`${selectedCharacterLabel}'s Recommended Pairings`)
            .setColor('#ff3399') // Set a different color for recommended pairings
            .setDescription(specificData.join('\n'));
  
          interaction.reply({ embeds: [embed] });
      } else if (selectedInfoType === 'recommendedMatrices') {
          // Create an EmbedBuilder to display the formatted data
          const embed = new EmbedBuilder()
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

        // Create an EmbedBuilder to display the formatted data
        const embed = new EmbedBuilder()
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