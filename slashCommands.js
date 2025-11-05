const { ApplicationCommandOptionType } = require('discord.js');

async function registerSlashCommands(mimibot) {
  try {
    // Wait for the application's commands to be loaded
    await mimibot.application?.commands.fetch();

    const commandData = [
      {
        name: 'simulcra',
        description: 'Pull up a drop-down menu',
      },
      {
        name: 'schedule',
        description: 'Schedule raids, oow (origins of war), or void abyss.',
        options: [
          {
            name: 'type',
            type: ApplicationCommandOptionType.String,
            description: 'The type of event to schedule (raids, oow, or voidabyss).',
            required: true,
            choices: [
              { name: 'raids', value: 'raids' },
              { name: 'oow', value: 'oow' },
              { name: 'voidabyss', value: 'voidabyss' },
            ],
          },
          {
            name: 'times',
            type: ApplicationCommandOptionType.String,
            description: 'Custom times in discord timestamp format <t:xxxxx>, separated by commas.',
            required: true,
          },
        ],
      },
      {
        name: 'pullcalc',
        description: 'Calculate the probability of getting a certain number of copies in a limited banner.',
        options: [
          {
            name: 'current_counter',
            type: ApplicationCommandOptionType.Integer,
            description: 'Your current counter out of 80.',
            required: true,
          },
          {
            name: 'flame_gold',
            type: ApplicationCommandOptionType.Integer,
            description: 'Your current amount of flame gold.',
            required: true,
          },
          {
            name: 'number_of_copies',
            type: ApplicationCommandOptionType.Integer,
            description: 'Number of limited banner weapon copies you want.',
            required: true,
          },
          {
            name: 'total_pulls',
            type: ApplicationCommandOptionType.Integer,
            description: 'Total amount of pulls.',
            required: true,
          },
          {
            name: 'last_two_outcomes',
            type: ApplicationCommandOptionType.Integer,
            description: 'Last 2 outcomes (-1 for lost both, 0 for lost last, 0 for won last, 1 for won both).',
            required: true,
          },
        ],
      },
      /*{
        name: 'fate',
        description: 'Check the fate of another user.',
        options: [
          {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user whose fate you want to check.',
            required: true,
          },
        ],
      }, */
      {
        name: 'dps',
        description: 'Calculate DPS for characters with matrices and a trait.',
        options: [
          {
            name: 'character1',
            type: ApplicationCommandOptionType.String,
            description: 'The first character.',
            required: true,
          },
          {
            name: 'character2',
            type: ApplicationCommandOptionType.String,
            description: 'The second character.',
            required: true,
          },
          {
            name: 'character3',
            type: ApplicationCommandOptionType.String,
            description: 'The third character.',
            required: true,
          },
          {
            name: 'matrices1',
            type: ApplicationCommandOptionType.String,
            description: 'Matrices for the first character (comma-separated).',
            required: true,
          },
          {
            name: 'matrices2',
            type: ApplicationCommandOptionType.String,
            description: 'Matrices for the second character (comma-separated).',
            required: true,
          },
          {
            name: 'matrices3',
            type: ApplicationCommandOptionType.String,
            description: 'Matrices for the third character (comma-separated).',
            required: true,
          },
          {
            name: 'trait',
            type: ApplicationCommandOptionType.String,
            description: 'The trait used by the characters.',
            required: true,
          },
          {
            name: 'skill1',
            type: ApplicationCommandOptionType.String,
            description: 'First fiona skill',
            required: false,
          },
          {
            name: 'skill2',
            type: ApplicationCommandOptionType.String,
            description: 'Second fiona skill',
            required: false,
          }
        ],
      },
      {
        name: 'meta',
        description: 'Meta team comps at various investment levels',
        options: [
          {
            name: 'element',
            type: ApplicationCommandOptionType.String,
            description: 'The type of element',
            required: true,
            choices: [
              { name: 'Frost', value: 'frost' },
              { name: 'Flame', value: 'flame' },
              { name: 'Volt', value: 'volt' },
              { name: 'Physical', value: 'physical'},
              { name: 'Altered', value: 'altered'}
            ],
          },
          {
            name: 'investment',
            type: ApplicationCommandOptionType.String,
            description: 'Level of investment $$',
            required: true,
            choices: [
              { name: 'Whale', value: 'whale' },
              { name: 'Dolphin', value: 'dolphin' },
              { name: 'F2P+', value: 'f2p+' },
              { name: 'F2P', value: 'f2p' },
            ],
          },
        ],
      },
      {
        name: 'dpshelp',
        description: 'Dps calc helper!',
      },
      {
        name: 'join',
        description: 'join embed',
      },
      {
        name: 'blame',
        description: 'blame people',
        options: [
          {
            name: 'user',
            type: ApplicationCommandOptionType.String,
            description: 'usually eresh',
            required: true,
          },
        ]
      },
      {
        name: 'assigntofrole',
        description: '[ADMIN ONLY] Assign the Tower of Fantasy role to all server members',
      },
      {
        name: 'bpapply',
        description: 'Post the Blue Protocol guild application form in the current channel',
      },
      {
        name: 'raid',
        description: 'Organize a 20-man raid with role selection and availability signup',
        options: [
          {
            name: 'times',
            type: ApplicationCommandOptionType.String,
            description: 'Comma-separated Discord time codes (e.g., <t:1762328496:F>, <t:1762328497:F>)',
            required: true,
          },
          {
            name: 'type',
            type: ApplicationCommandOptionType.String,
            description: 'Type of raid difficulty',
            required: true,
            choices: [
              { name: 'Normal', value: 'normal' },
              { name: 'Hard', value: 'hard' },
              { name: 'Both', value: 'both' },
            ],
          },
          {
            name: 'raid',
            type: ApplicationCommandOptionType.String,
            description: 'Which raid boss',
            required: true,
            choices: [
              { name: 'Bone Dragon', value: 'bone dragon' },
              { name: 'Ice Dragon', value: 'ice dragon' },
            ],
          },
          {
            name: 'minimum_ability_score',
            type: ApplicationCommandOptionType.Integer,
            description: 'Minimum ability score required to join the raid',
            required: true,
          },
        ],
      },
      {
        name: 'raidreset',
        description: '[ADMIN ONLY] Reset all raid signups and voting data',
      },
      {
        name: 'raidstatus',
        description: '[ADMIN ONLY] View current raid data status and persistence info',
      },
    ];
    for (const command of commandData) {
      await mimibot.application?.commands.create(command);
    }

    console.log('Slash commands registered globally!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}

module.exports = {
  registerSlashCommands,
};