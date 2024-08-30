import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('mute')
        .setDescription('Mute a user')

        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('A user to mute')
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for mute')
        )

        // .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        
        const reason = interaction.options.getString('reason') || 'No reason provide.';

        const user = interaction.options.getUser('user'); 
        const member = await interaction.guild.members.fetch(user.id);

        if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers))
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('Bitch you dont have enough permissions.')]
            });

        if (!member) 
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('The user does not belong to this server.')]
            });

        if (interaction.member.roles.highest.position <= member.roles.highest.position)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('Your role is not high enough to do that.')]
            });

        if (member.roles.cache.some(role => role.name === 'Muted')) 
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('The user is already muted.')]
            });

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });

        const globalEmbed = new EmbedBuilder()
            .setTitle('Mute Successfull!')
            .setColor('Blue')
            .addFields(
                { name: 'Member Name:', value: member.user.username },
                { name: 'Reason', value: reason }
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        const role = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        await member.roles.add(role);

        await interaction.editReply( {embeds: [globalEmbed]} );
    }
}