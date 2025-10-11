const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const scheduledInstances = new Map();

// Function to generate custom time options
function generateCustomTimeOptions(customTimes) {
  const options = customTimes.map((time, index) => {
    const timeLabel = `Group ${index + 1}`;
    return { label: timeLabel, value: timeLabel };
  });

  return options;
}

async function handleTimes(interaction) {
  console.log('Handling times...');
  const selectedTimes = interaction.values;
  const selectedUser = interaction.user.tag;
  const originalEmbed = interaction.message.embeds[0];
  let initialDescription = originalEmbed.description;

  console.log('Selected Times:', selectedTimes);
  console.log('Selected User:', selectedUser);

  selectedTimes.forEach((selectedTime) => {
    console.log('Processing time:', selectedTime);
    const scheduledGroup = scheduledGroups.get(selectedTime) || [];

    // Check if the user is already in the group
    const userIndex = scheduledGroup.indexOf(selectedUser);

    if (userIndex !== -1) {
      // User is already in the group, remove them
      scheduledGroup.splice(userIndex, 1);
      console.log("time", scheduledGroup);
      interaction.reply({
        content: `You have been removed from ${selectedTime}`,
        ephemeral: true,
      });
    } else {
      // User is not in the group, add them
      scheduledGroup.push(selectedUser);
      console.log(scheduledGroup);
      interaction.reply({
        content: `You have been added to ${selectedTime}`,
        ephemeral: true,
      });
    }

    scheduledGroups.set(selectedTime, scheduledGroup);
    console.log("array", scheduledGroups);
  });

  const scheduledTimes = {};

  // Loop through the map entries to extract and store the times
  scheduledGroups.forEach((value, key) => {
    const match = key.match(/<t:(\d+):([a-zA-Z]+)>/);
    if (match) {
      // Extract group name from the key
      const groupName = key.includes(':') ? key.split(':')[0].trim() : key;

      // Store the time in the corresponding group
      if (!scheduledTimes[groupName]) {
        scheduledTimes[groupName] = [];
      }
      scheduledTimes[groupName].push(match[0]);
    }
  });

  console.log(scheduledTimes);

  let newlineInserted = false;

  selectedTimes.forEach((selectedTime) => {
    const scheduledGroup = scheduledGroups.get(selectedTime) || [];
    const usersMention = scheduledGroup
      .map((user) => interaction.guild.members.cache.find((member) => member.user.tag === user)?.toString())
      .join(', ');

    // Find the index of the time slot in the description and update it
    const timeSlotIndex = initialDescription.indexOf(`${selectedTime}`);
    if (timeSlotIndex !== -1) {
      // Calculate scheduledTime only once outside the loop
      const scheduledTime = scheduledTimes[selectedTime];

      const nextTimeSlotIndex = initialDescription.indexOf('\n', timeSlotIndex + 1);
      const timeSlotContent = nextTimeSlotIndex !== -1
        ? initialDescription.substring(timeSlotIndex, nextTimeSlotIndex).replace(/\n/g, '')
        : initialDescription.substring(timeSlotIndex).replace(/\n/g, '');

      const replacement = `${selectedTime} ${scheduledTime}: **`;
      const userSection = `${usersMention || 'No users scheduled yet.'}`;

      // Replace the content in the initialDescription
      initialDescription = initialDescription.replace(
        timeSlotContent,
        `${replacement}${userSection}`
      );

      newlineInserted = true; // Set the flag to true after the first insertion
    }
  });
  // Update the existing embed with the new description
  originalEmbed.setDescription(initialDescription);

  // Edit the original message with the updated embed
  interaction.message.edit({ embeds: [originalEmbed], components: interaction.message.components });
}

// Function to handle the /schedule command
function handleScheduleCommand(interaction, selectedTimes) {
  const guildId = interaction.guild.id;
  const scheduleType = interaction.options.getString('type').toLowerCase();

  if (!scheduledInstances.has(guildId)) {
    scheduledInstances.set(guildId, new Map());
  }

  const scheduleTypeMap = scheduledInstances.get(guildId);

  if (scheduleTypeMap.has(scheduleType)) {
    interaction.reply({
      content: 'Another scheduled instance of this type is currently running for this server. Please wait for it to finish.',
      ephemeral: true,
    });
    return;
  }

  // Check if scheduling has closed
  const scheduledInstance = scheduleTypeMap.get(scheduleType);
  if (scheduledInstance && Date.now() > scheduledInstance.endTime) {
    interaction.reply({
      content: 'Sorry, scheduling has closed for this type. You cannot create a new instance at this time.',
      ephemeral: true,
    });
    return;
  }

  const scheduledGroups = new Map();

  console.log('Handling /schedule command...');
  // Check if the user is a server admin before allowing them to use the command
  if (!interaction.member.permissions.has('ADMINISTRATOR')) {
    interaction.reply({
      content: 'You must be a server admin to use this command.',
      ephemeral: true,
    });
    return;
  }

  const [customTimesStr] = [
    interaction.options.getString('times'), // Get the custom times as a single string
  ];

  console.log('Schedule Type:', scheduleType);
  console.log('Custom Times String:', customTimesStr);

  let title, description;

  // Parse customTimesStr into an array of custom times (if provided)
  const customTimes = customTimesStr ? customTimesStr.split(',').map((time) => {
    // Use a regular expression to remove any ':x' at the end of the custom time
    return time.replace(/:\w+$/, '').trim();
  }) : [];

  console.log('Custom Times:', customTimes);

  // Construct the "Times <:time:1166747727049269399>" part
  const timesHeader = '**Times** <:time:1166747727049269399>';

  // Set title and description based on the scheduleType and scheduleDay
  if (scheduleType === 'raids') {
    title = 'Raids: Challenge Mode';
    description = `Come join our raids groups!\n\n${timesHeader}`;
  } else if (scheduleType === 'oow') {
    title = 'Origin of War';
    description = `Come join our Origins of War groups!\n\n${timesHeader}`;
  } else if (scheduleType === 'voidabyss') {
    title = 'Void Abyss 1-6';
    description = `Come join our Void Abyss 1-6 groups!\n\n${timesHeader}`;
  } else {
    // If an invalid schedule type is provided, send an error message
    interaction.reply('Invalid schedule type. Please use `/schedule raids`, `/schedule oow`, or `/schedule voidabyss`.');
    return;
  }

  // Create mentions for the custom times and store them in the description
  if (customTimes.length > 0) {
    customTimes.forEach((time) => {
      if (!scheduledGroups.has(time)) {
        scheduledGroups.set(time, []);
      }
    });
  }

  // Validate the custom times to ensure they are in the correct format (Discord timestamp)
  const validCustomTimes = customTimes.every((time) => /<t:\d+(:\w+)?>/.test(time));
  if (!validCustomTimes) {
    interaction.reply('Invalid time format. Please use the Discord timestamp format ```e.g., <t:1698234540>``` or ```<t:1698234540:x>``` for custom times.');
    return;
  }

  // Create mentions for the custom times and store them in the description

  if (customTimes.length > 0) {
    customTimes.forEach((time, index) => {
      const timeLabel = `Group ${index + 1}: ${time}`;
      if (!scheduledGroups.has(timeLabel)) {
        scheduledGroups.set(timeLabel, []);
      }
      description += `\n\n**${timeLabel}**`;
    });
  }

  scheduleTypeMap.set(scheduleType, { scheduledGroups });

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor('#FF0000');

  // Loop through the selected times to update the embed
  selectedTimes.forEach((selectedTime) => {
    console.log('Updating embed for time:', selectedTime);
    const scheduledGroup = scheduledGroups.get(selectedTime) || [];
    const usersMention = scheduledGroup.map((user) => `@${user}`).join(', ');
    description = description.replace(`${selectedTime}**\n ${usersMention}`, `${selectedTime}**\n ${usersMention}`);
  });

  // Create a StringSelectMenu with the time options (using custom time options)
  const timeMenu = new StringSelectMenuBuilder()
    .setCustomId('ScheduleTime')
    .setPlaceholder('Select times')
    .addOptions(generateCustomTimeOptions(customTimes).map(opt => 
      new StringSelectMenuOptionBuilder()
        .setLabel(opt.label)
        .setValue(opt.value)
    )); // Use the custom time options

  // Create an ActionRow with the timeMenu
  const timeRow = new ActionRowBuilder().addComponents(timeMenu);
  const host = interaction.user.toString(); // Get the user object of the host

  // Add the host information to the embed
  embed.setDescription(`${embed.description}\n\nHosted by: ${host}`);

  // Send the embed with the timeMenu as a response
  interaction.reply({ embeds: [embed], components: [timeRow] });

}

module.exports = {
  handleScheduleCommand,
  handleTimes
};