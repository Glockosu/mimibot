const { EmbedBuilder, InteractionContextType } = require('discord.js');

const TOF_ROLE_ID = '1425800618236313723';
const DAWN_SERVER_ID = '1008210198575464600';

async function handleAssignTofRole(interaction) {
    console.log('[ASSIGN ROLE] Command started by', interaction.user.tag);
    
    // Verify this is the correct server
    if (interaction.guild.id !== DAWN_SERVER_ID) {
        console.log('[ASSIGN ROLE] Wrong server:', interaction.guild.id);
        return interaction.reply({
            content: 'This command can only be used in the Dawn server.',
            flags: 64 // ephemeral flag
        });
    }

    // Defer the reply since this will take time
    console.log('[ASSIGN ROLE] Deferring reply...');
    await interaction.deferReply({ flags: 64 }); // ephemeral flag
    console.log('[ASSIGN ROLE] Reply deferred');

    try {
        // Fetch the role
        console.log('[ASSIGN ROLE] Fetching role:', TOF_ROLE_ID);
        const role = await interaction.guild.roles.fetch(TOF_ROLE_ID);
        
        if (!role) {
            console.log('[ASSIGN ROLE] Role not found!');
            return interaction.editReply({
                content: 'Could not find the Tower of Fantasy role. Please check the role ID.',
            });
        }
        console.log('[ASSIGN ROLE] Found role:', role.name);

        // Fetch all members with extended timeout for large servers
        console.log('[ASSIGN ROLE] Fetching all members...');
        await interaction.guild.members.fetch({ 
            force: true, 
            time: 120000 // 2 minute timeout for large servers
        });
        const members = interaction.guild.members.cache;
        console.log('[ASSIGN ROLE] Total members in server:', members.size);

        // Filter members who don't have the role yet
        const membersWithoutRole = members.filter(member => 
            !member.roles.cache.has(TOF_ROLE_ID) && 
            !member.user.bot // Don't assign to bots
        );
        console.log('[ASSIGN ROLE] Members without role:', membersWithoutRole.size);

        if (membersWithoutRole.size === 0) {
            console.log('[ASSIGN ROLE] All members already have the role');
            return interaction.editReply({
                content: 'All members already have the Tower of Fantasy role!',
            });
        }

        // Send initial progress message
        console.log('[ASSIGN ROLE] Starting role assignment...');
        await interaction.editReply({
            content: `Starting to assign the **${role.name}** role to ${membersWithoutRole.size} members...\nThis may take a while.`,
        });

        let successCount = 0;
        let failCount = 0;
        const errors = [];
        let lastUpdateTime = Date.now();

        // Assign roles with rate limiting (500ms per member for better speed)
        for (const [memberId, member] of membersWithoutRole) {
            try {
                console.log(`[ASSIGN ROLE] Assigning role to ${member.user.tag} (${successCount + failCount + 1}/${membersWithoutRole.size})`);
                await member.roles.add(role, 'Bulk role assignment by admin');
                successCount++;
                console.log(`[ASSIGN ROLE] ✓ Success for ${member.user.tag}`);
                
                // Update progress every 5 members OR every 30 seconds (whichever comes first)
                const timeSinceLastUpdate = Date.now() - lastUpdateTime;
                if (successCount % 5 === 0 || timeSinceLastUpdate > 30000) {
                    console.log(`[ASSIGN ROLE] Updating progress: ${successCount}/${membersWithoutRole.size}`);
                    await interaction.editReply({
                        content: `Progress: ${successCount + failCount}/${membersWithoutRole.size} members processed (${successCount} successful, ${failCount} failed)...`,
                    });
                    lastUpdateTime = Date.now();
                }
                
                // Wait 500ms between each assignment to avoid rate limits (faster than 1 second)
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                failCount++;
                errors.push(`${member.user.tag}: ${error.message}`);
                console.error(`[ASSIGN ROLE] ✗ Failed for ${member.user.tag}:`, error.message);
            }
        }
        
        console.log('[ASSIGN ROLE] Assignment complete! Success:', successCount, 'Failed:', failCount);

        // Create completion embed
        console.log('[ASSIGN ROLE] Creating completion embed...');
        const embed = new EmbedBuilder()
            .setTitle('✅ Role Assignment Complete')
            .setColor('#00FF00')
            .addFields(
                { name: 'Role', value: role.name, inline: true },
                { name: 'Successfully Assigned', value: `${successCount}`, inline: true },
                { name: 'Failed', value: `${failCount}`, inline: true },
                { name: 'Total Members Processed', value: `${membersWithoutRole.size}`, inline: false }
            )
            .setTimestamp();

        if (errors.length > 0 && errors.length <= 5) {
            embed.addFields({
                name: 'Errors (first 5)',
                value: errors.slice(0, 5).join('\n')
            });
        } else if (errors.length > 5) {
            embed.addFields({
                name: 'Errors (first 5)',
                value: errors.slice(0, 5).join('\n') + `\n... and ${errors.length - 5} more errors`
            });
        }

        console.log('[ASSIGN ROLE] Sending final report...');
        await interaction.editReply({
            content: null,
            embeds: [embed]
        });
        console.log('[ASSIGN ROLE] Command completed successfully');

    } catch (error) {
        console.error('[ASSIGN ROLE] Fatal error:', error);
        try {
            await interaction.editReply({
                content: `An error occurred: ${error.message}`,
            });
        } catch (editError) {
            console.error('[ASSIGN ROLE] Failed to send error message:', editError);
        }
    }
}

module.exports = {
    handleAssignTofRole,
};

