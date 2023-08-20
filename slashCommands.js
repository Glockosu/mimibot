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
            type: 'STRING',
            description: 'The type of event to schedule (raids, oow, or voidabyss).',
            required: true,
            choices: [
              { name: 'raids', value: 'raids' },
              { name: 'oow', value: 'oow' },
              { name: 'voidabyss', value: 'voidabyss' },
            ],
          },
          {
            name: 'day',
            type: 'STRING',
            description: 'The day for the scheduled event.',
            required: true,
            choices: [
              { name: 'Monday', value: 'monday' },
              { name: 'Tuesday', value: 'tuesday' },
              { name: 'Wednesday', value: 'wednesday' },
              { name: 'Thursday', value: 'thursday' },
              { name: 'Friday', value: 'friday' },
              { name: 'Saturday', value: 'saturday' },
              { name: 'Sunday', value: 'sunday' }
            ],
          },
          {
            name: 'times',
            type: 'STRING', // Change the type to STRING
            description: 'Custom times in UTC format (hh:mm), separated by spaces.',
            required: true, // Make this parameter optional
          },
        ],
      },
      {
        name: 'rotation',
        description: 'Get rotations for characters.',
        options: [
          {
            name: 'characters',
            type: 'STRING',
            description: 'The characters for which you want to get rotations (comma-separated).',
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
            type: 'USER',
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
            type: 'STRING',
            description: 'The first character.',
            required: true,
          },
          {
            name: 'character2',
            type: 'STRING',
            description: 'The second character.',
            required: true,
          },
          {
            name: 'character3',
            type: 'STRING',
            description: 'The third character.',
            required: true,
          },
          {
            name: 'matrices1',
            type: 'STRING',
            description: 'Matrices for the first character (comma-separated).',
            required: true,
          },
          {
            name: 'matrices2',
            type: 'STRING',
            description: 'Matrices for the second character (comma-separated).',
            required: true,
          },
          {
            name: 'matrices3',
            type: 'STRING',
            description: 'Matrices for the third character (comma-separated).',
            required: true,
          },
          {
            name: 'trait',
            type: 'STRING',
            description: 'The trait used by the characters.',
            required: true,
          },
          {
            name: 'skill1',
            type: 'STRING',
            description: 'First fiona skill',
            required: true,
          },
          {
            name: 'skill2',
            type: 'STRING',
            description: 'Second fiona skill',
            required: true,
          }
        ],
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