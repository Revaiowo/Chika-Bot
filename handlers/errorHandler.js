import { EmbedBuilder } from "discord.js";


export const handleError = async (interaction, error) => {

    console.log(error);

    if (interaction.replied || interaction.deferred) {

        if (error.message === 'Missing Permissions')
            await interaction.followUp({ 
                embeds: [ new EmbedBuilder().setDescription(`I don't have enough permission to do this.`) ]
            });

        else if (error.message === 'Unknown Ban')
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('That user is not banned.')]
            }); 

        else
            await interaction.followUp({ 
                    embeds: [ new EmbedBuilder().setDescription(`Something went wrong: ${error.message}`) ]
                });

    } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }


    
}