import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Warn } from '../../models/warn.js'

export default {

    data: new SlashCommandBuilder()

        .setName('clearwarn')
        .setDescription('Clear all the warnings for a user')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('User name or id')
                .setRequired(true)
        )

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
        
        if (!User || User.warn.length === 0) 
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription(`No warnings found for ${member.user.username}.`)]
                });

        const globalEmbed = new EmbedBuilder()
            .setTitle(`All warnings removed from ${member.user.username}`)
            .setDescription(`Total ${User.warn.length} ${User.warn.length === 1 ? 'warn' : 'warns'} removed!`)
            .setColor('Blue')
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: senderAvatar });

        await Warn.updateOne({ userId: member.user.id }, { $set: { warn: [] } })

        await interaction.editReply({ embeds: [globalEmbed] })
    }
}  