import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('role')
        .setDescription('Give or remove a role')

        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Enter a user')
                .setRequired(true)
        )

        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Enter the role')
                .setRequired(true)
        )

        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        const role = interaction.options.getRole('role');
        
        const user = interaction.options.getUser('user'); 
        const member = await interaction.guild.members.fetch(user.id);

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))
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

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });

        const globalEmbed = new EmbedBuilder()
            .setTitle('Role Added!')
            .setDescription(`Successfully added ${role} to **${member.user.username}**`)
            .setColor('Blue')
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        if (member.roles.cache.some(r => r.id === role.id)) {

            const globalEmbed = new EmbedBuilder()
                .setTitle('Role Removed!')
                .setDescription(`Successfully removed ${role} from **${member.user.username}**`)
                .setColor('Blue')
                .setTimestamp()
                .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

            await member.roles.remove(role);  

            return await interaction.editReply( {embeds: [globalEmbed]} );
        }

        await member.roles.add(role);  

        await interaction.editReply( {embeds: [globalEmbed]} );
    }
}