import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('avatar')
        .setDescription('Get avatar of a user')

        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('A user whose info you want to see')
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        
        const user = interaction.options.getUser('user');

        let userName, avatar;

        if (!user) {
            userName = interaction.user.username;
            avatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
        }

        else {
            userName = user.username;
            avatar = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
        }

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
    
        const embed = new EmbedBuilder()
            .setTitle(`User Avatar For ${userName}`)
            .setImage(avatar)
            .setTimestamp()
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        await interaction.editReply({ embeds: [embed]});
    }

}