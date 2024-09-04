import { EmbedBuilder } from "discord.js";


export const handleError = async (interaction, error) => {

    let channel;
    try {
        channel = await interaction.client.channels.fetch('1280786606852276335');
    } catch (error) {
        console.log('Could not fetch the error logs channel');
    }

    if (interaction.replied || interaction.deferred) {

        if (error.message === 'Missing Permissions')
            await interaction.followUp({ 
                embeds: [ new EmbedBuilder().setDescription(`I don't have enough permission to do this.`) ]
            });

        else if (error.message === 'Unknown Ban')
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('That user is not banned.')]
            }); 

        else {
            console.log(error);

            await interaction.followUp({ 
                    embeds: [ new EmbedBuilder().setDescription(`Something went wrong.`) ]
                });

            if (channel) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('⚠️ Error Occurred')
                    .setColor('Red')
                    .addFields(
                        { name: 'Message', value: error.message || 'N/A' },
                        { name: 'Name', value: error.name || 'N/A' },
                        { name: 'Code', value: error.code || 'N/A' },
                        { name: 'Command', value: interaction.commandName || 'N/A' },
                        { name: 'Stack', value: `\`\`\`${error.stack || 'No stack trace available'}\`\`\`` || 'N/A' }
                    )
                    .setTimestamp();

                await channel.send({ embeds: [errorEmbed] });
            };
        }

    } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }


    
}