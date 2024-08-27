import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Warn } from '../../models/warn.js'

export default {

    data: new SlashCommandBuilder()

        .setName('warnlog')
        .setDescription('Shows all the warnings for a user')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('User name or id')
                .setRequired(true)
        )

        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.cache.get(user.id);

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages))
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Bitch you dont have enough permissions.')]
                });

        if (!member) 
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('The user does not belong to this server.')]
                });

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });

        const User = await Warn.findOne({ userId: member.user.id });
        
        if (!User || User.warn.length === 0) {
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription(`No warnings found for ${member.user.username}.`)]
                });
        };

        const globalEmbed = new EmbedBuilder()
            .setTitle(`All warnings for ${member.user.username}`)
            .setColor('Blue')
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: senderAvatar });
        
        let i = 1;

        User.warn.map(warn => {
            globalEmbed.addFields({ name: `${i}.) ${warn.reason}`, value: `Warned by: ${warn.modName}`});
            i += 1;
        });
        
        await interaction.editReply({ embeds: [globalEmbed] });
    }
}  