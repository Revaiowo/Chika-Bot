import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";
import { evaluate } from 'mathjs';

export default {

    data: new SlashCommandBuilder()
        
        .setName('calculate')
        .setDescription('Your personal calculatorj')

        .addStringOption(option =>
            option
                .setName('expression')
                .setDescription('Any mathematical expression')
                .setRequired(true)
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        
        const expression = interaction.options.getString('expression');

        let result;

        try {
            result = evaluate(expression);
        } catch (error) {
            console.log(error)
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('You entered an invalid expression')]
                });
        }

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
    
        const embed = new EmbedBuilder()
            .setDescription(`\`${expression}\` = **${result?.toString()}**` || "Couldn't calculate that.")
            .setTimestamp()
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        await interaction.editReply({ embeds: [embed]});
    }

}