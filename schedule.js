const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

const scheduledGroups = new Map();

// Function to generate custom time options
function generateCustomTimeOptions(customTimes) {
  const options = customTimes.map((time) => {
    const estTime = convertUTCToEST(time); // Convert UTC to Eastern Standard Time (EST) with 1 hour added
    const timeLabel = `${estTime}`;
    const timeValue = timeLabel;
    return { label: timeLabel, value: timeValue };
  });

  return options;
}

// Function to convert UTC time to Eastern Standard Time (EST)
function convertUTCToEST(utcTime) {
  const [hours, minutes] = utcTime.split(':');
  const date = new Date(Date.UTC(0, 0, 1, parseInt(hours), parseInt(minutes))); // Use Date.UTC to avoid daylight saving time shifts

  // Add 1 hour to the date to reflect the time difference (1 hour behind)
  date.setHours(date.getHours() + 1);

  // Create an options object with the time zone set to Eastern Standard Time (EST)
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'America/New_York',
  };

  // Format the date to Eastern Standard Time (EST) and get the formatted time string
  const estTime = date.toLocaleString('en-US', options);

  // Manually handle the time zone name based on Daylight Saving Time (DST)
  const timeZoneName = date.getTimezoneOffset() === 240 ? 'EDT' : 'EST';

  return `${estTime} ${timeZoneName}`;
}


async function handleTimes(interaction) {
  const selectedTimes = interaction.values;
  const selectedUser = interaction.user.tag; // Use interaction.user.toString() to mention the user

  // Get the original embed from the interaction
  const originalEmbed = interaction.message.embeds[0];

  // Get the initial description from the original embed
  let initialDescription = originalEmbed.description;

  selectedTimes.forEach((selectedTime) => {
    const scheduledGroup = scheduledGroups.get(selectedTime) || [];
    
    // Check if the user is already in the group
    const userIndex = scheduledGroup.indexOf(selectedUser);
    
    if (userIndex !== -1) {
      // User is already in the group, remove them
      scheduledGroup.splice(userIndex, 1);
      interaction.reply({
        content: `You have been removed from the ${selectedTime} group.`,
        ephemeral: true,
      });
    } else {
      // User is not in the group, add them
      scheduledGroup.push(selectedUser);
      interaction.reply({
        content: `You have been added to the ${selectedTime} group.`,
        ephemeral: true,
      });
    }
    
    scheduledGroups.set(selectedTime, scheduledGroup);
  });


    selectedTimes.forEach((selectedTime) => {
      const scheduledGroup = scheduledGroups.get(selectedTime) || [];
      const usersMention = scheduledGroup.map((user) => interaction.guild.members.cache.find((member) => member.user.tag === user)?.toString()).join(', ');
    
      // Find the index of the time slot in the description and update it
      const timeSlotIndex = initialDescription.indexOf(`**${selectedTime} group:**`);
      if (timeSlotIndex !== -1) {
        const nextTimeSlotIndex = initialDescription.indexOf('\n', timeSlotIndex + 1);
        if (nextTimeSlotIndex !== -1) {
          const timeSlotContent = initialDescription.substring(timeSlotIndex, nextTimeSlotIndex);
          initialDescription = initialDescription.replace(timeSlotContent, `**${selectedTime} group:** ${usersMention || 'No users scheduled yet'}`);
        }
      }
    });


    // Update the existing embed with the new description
    originalEmbed.setDescription(initialDescription);

    // Edit the original message with the updated embed
    interaction.message.edit({ embeds: [originalEmbed], components: interaction.message.components });
  }


// Function to handle the /schedule command
function handleScheduleCommand(interaction, selectedTimes) {
  // Check if the user is a server admin before allowing them to use the command
  if (!interaction.member.permissions.has('ADMINISTRATOR')) {
    interaction.reply({
      content: 'You must be a server admin to use this command.',
      ephemeral: true,
    });
    return;
  }

  const [scheduleType, scheduleDay, customTimesStr] = [
    interaction.options.getString('type').toLowerCase(),
    interaction.options.getString('day').toLowerCase(),
    interaction.options.getString('times'), // Get the custom times as a single string
  ];

  let title, description;

  // Set title and description based on the scheduleType and scheduleDay
  if (scheduleType === 'raids') {
    title = 'Raids: Challenge Mode';
    description = `Come join ${scheduleDay}'s raids group.`;
  } else if (scheduleType === 'oow') {
    title = 'Origin of War';
    description = `Come join ${scheduleDay}'s Origins of War group.`;
  } else if (scheduleType === 'voidabyss') {
    title = 'Void Abyss 1-6';
    description = `Come join ${scheduleDay}'s Void Abyss 1-6 group.`;
  } else {
    // If an invalid schedule type is provided, send an error message
    interaction.reply('Invalid schedule type. Please use `/schedule raids`, `/schedule oow`, or `/schedule voidabyss`.');
    return;
  }

  // Parse customTimesStr into an array of custom times (if provided)
  const customTimes = customTimesStr ? customTimesStr.split(',').map((time) => time.trim()) : [];

  // Create mentions for the custom times and store them in the description
  if (customTimes.length > 0) {
    customTimes.forEach((time) => {
      if (!scheduledGroups.has(time)) {
        scheduledGroups.set(time, []);
      }
    });
  }

  // Validate the custom times to ensure they are in the correct format (hh:mm)
  const validCustomTimes = customTimes.every((time) => /^[0-9]{2}:[0-9]{2}$/.test(time));
  if (!validCustomTimes) {
    interaction.reply('Invalid time format. Please use the hh:mm UTC format for custom times.');
    return;
  }

  // Create mentions for the custom times and store them in the description
  if (customTimes.length > 0) {
    customTimes.forEach((time) => {
      scheduledGroups.set(time, []);
      const localTime = convertUTCToEST(time); // Convert UTC to local time in Discord format
      description += `\n\n**${localTime} group:** No users scheduled yet.`;
    });
  }

  const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor('#FF0000');

  // Loop through the selected times to update the embed
  selectedTimes.forEach((selectedTime) => {
    const scheduledGroup = scheduledGroups.get(selectedTime) || [];
    const usersMention = scheduledGroup.map((user) => interaction.guild.members.cache.find((member) => member.user.tag === user)?.toString()).join(', ');
    embed.setDescription(embed.description.replace(`**${selectedTime} group:** No users scheduled yet.`, `**${selectedTime} group:** ${usersMention}`));
  });

  // Create a MessageSelectMenu with the time options (using custom time options)
  const timeMenu = new MessageSelectMenu()
    .setCustomId('ScheduleTime')
    .setPlaceholder('Select times')
    .addOptions(generateCustomTimeOptions(customTimes)); // Use the custom time options

  // Create a MessageActionRow with the timeMenu
  const timeRow = new MessageActionRow().addComponents(timeMenu);
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