const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function handleJoin(interaction) {
  const joinTitle = '**Welcome to Dawn | Starlight!**';
  const serverIcon = interaction.guild.iconURL();
  
  const embed = new EmbedBuilder()
    .setTitle(joinTitle)
    .setURL('https://discord.gg/dawntof')
    .setAuthor({ name: '🌟 Dawn | Starlight 🌟', iconURL: serverIcon, url: 'https://discord.gg/dawntof' })
    .setColor(0x0099ff)
    .addFields(
      { name: '✨ **About Us**', value: `> We are a vibrant, welcoming community where gamers and friends come together! Join us on this collective journey at **Dawn | Starlight**, where friendships flourish, and every member is a vital part of our shared adventure. 🌟` },
      { name: '🌟 **Gaming Together**', value: `> We play various games together and welcome all skill levels! Our crews **Dawn** and **Starlight** span multiple games. Whether you're a casual player or competitive, there's a place for you here. Feel free to reach out to <@148247329156235264>, <@336352740643045376>, or <@125509104012754944> to get started!` },
      { name: '🪐 **Events & Activities**', value: `> Embark on adventures with us! We organize diverse events, game nights, giveaways, and community activities. Join in for exciting prizes, rewards, or simply for the joy of participating with friends!` },
      { name: '📖 **Rules**', value: `> Please head over and take a quick look at the rules. You can find the rules here: https://canary.discord.com/channels/1008210198575464600/1008211720503836732. ` },
      { name: '<a:purpleverify:1172952580134023219> **Verification**', value: `> As a safety measure we require a second layer of verification to post links or send embeds as messages. You can verify below. <:ganyuHeartlove:1050313699409281075> ` }
    )
    .setFooter({ text: 'Dawn | Starlight', iconURL: serverIcon });

  // Create a button with the label "Verify" and a checkmark emoji
  const verifyButton = new ButtonBuilder()
    .setCustomId('verify_button')
    .setLabel('Verify')
    .setEmoji('<a:purpleverify:1172952580134023219>')
    .setStyle(ButtonStyle.Secondary);

  // Create an action row with the button
  const row = new ActionRowBuilder().addComponents(verifyButton);

  // Send the embed with the button
  await interaction.reply({ embeds: [embed], components: [row] });

  // Add functionality to handle button click
  const filter = (i) => i.customId === 'verify_button';
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: 600000 }); // 10 minutes

  collector.on('collect', async (buttonInteraction) => {
    try {
      // Handle the verification button interaction here
      const member = buttonInteraction.member;

      // Check if the member already has the @starlight role
      if (member.roles.cache.some(role => role.name === 'Starlight')) {
        await buttonInteraction.reply({
          content: `You are already verified!`,
          ephemeral: true,
        });
      } else {
        // Add the @starlight role to the member
        const starlightRole = buttonInteraction.guild.roles.cache.find(role => role.name === 'Starlight');

        if (starlightRole) {
          try {
            await member.roles.add(starlightRole);
            await buttonInteraction.reply({
              content: `Verification successful! You can now access the rest of the server.`,
              ephemeral: true,
            });
          } catch (error) {
            console.error('Error adding role:', error);
            await buttonInteraction.reply({
              content: `There was an error verifying you. Please contact an admin.`,
              ephemeral: true,
            });
          }
        } else {
          console.error('Role not found');
          await buttonInteraction.reply({
            content: `Verification role not found. Please contact an admin.`,
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.error('Error in button interaction:', error);
    }
  });

  collector.on('end', (collected) => {
    console.log(`Collected ${collected.size} interactions`);
  });
}

module.exports = {
  handleJoin,
};