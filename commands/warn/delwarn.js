import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Warn } from '../../models/warn.js'

export default {

    data: new SlashCommandBuilder()

        .setName('delwarn')
        .setDescription('Delete a warn')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('User name or id')
                .setRequired(true)
        )

        .addIntegerOption(option => 
            option
                .setName('index')
                .setDescription('Exact number of warning to delete')
                .setRequired(true)
                .setMinValue(1)
        )

        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const index = interaction.options.getInteger('index');
        
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
        
        const warn = User.warn.splice(index-1, 1);
        await User.save();

        if (warn.length === 0)
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('No warn exist for the index you entered.')]
                });

        const globalEmbed = new EmbedBuilder()
            .setTitle(`Warn removed from ${member.user.username}`)
            .setColor('Blue')
            .addFields(
                { name: 'Warn:', value: warn[0].reason }
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
            
        
        await interaction.editReply({ embeds: [globalEmbed] })
    }
}  