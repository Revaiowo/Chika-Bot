import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('test')
        .setDescription('Get all information of a user')

        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('A user whose info you want to see')
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        

        await interaction.editReply({ embeds: [embed]});

        
        
    }

}