const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

async function handleDPSHelpCommand(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('DPS Calculator Help')
      .setColor('#0099ff')
      .setDescription('This command is used to calculate DPS (Damage Per Second) for various compositions.')
      .addFields(
        { name: 'Command Usage', value: 'To calculate DPS, use the `/dps` command followed by the composition details. For example:\n`/dps character1: tian6 character2: rubilia6 character3: fenrir6 matrices1: fenrir4pc3 matrices2: mimi4pc3 matrices3: rubilia4pc3 trait: rubilia`\nThis will calculate DPS for the specified characters, matrices, and traits.' },
        { name: 'Fiona Skills', value: 'If the composition provided contains Fiona, you must add Fiona skills as optional parameters. For example:\n`/dps character1: yulansweeping6 character2: fiona6 character3: icarus6 matrices1: fiona4pc3 matrices2: yulan4pc3 matrices3: icarus4pc3 trait: yulan skill1: hydro skill2: torrential`\n' },
        { name: 'Character Format', value: 'Characters should be entered in the format: `characterNameX`, where `X` represents the number of advancements they have. For example, if you have a 6-star Icarus, it should be entered as `icarus6`.' },
        { name: 'Matrices Format', value: 'Matrices should be entered in the format: `matriceNameYpcZ`, where `Y` represents the number of pieces (2pc or 4pc) and `Z` represents the star advancements (0, 1, 2, or 3). For example, a 4-piece Fenrir set with 3-star advancements would be entered as `fenrir4pc3`.' },
        { name: 'Composition Details', value: 'Compositions consist of characters, matrices, traits, and optional skills. You can customize these details in your calculations.' },
        { name: 'Examples', value: 'For examples and detailed usage, refer to the documentation or ask for assistance.' }
      );
  
    await interaction.reply({ embeds: [embed] });
}

module.exports = {
    handleDPSHelpCommand
}