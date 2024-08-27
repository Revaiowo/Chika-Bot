import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('serverinfo')
        .setDescription('Get information about the server')

        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        const serverOwner = await interaction.guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setTitle('Server Information')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setColor('Green')
            .addFields(
                { name: 'Server Name:', value: interaction.guild.name },
                { name: 'Server ID:', value: interaction.guild.id },
                { name: 'Server Owner:', value: serverOwner.user.username },
                { name: 'Members:', value: interaction.guild.memberCount.toString(), inline: true},
                { name: 'Bots:', value: interaction.guild.members.cache.filter(member => member.user.bot).size.toString(), inline: true},
                { name: 'Channel:', value: interaction.guild.channels.cache.size.toString(), inline: true },
                { name: 'Roles:', value: interaction.guild.roles.cache.size.toString(), inline: true},
                { name: 'Created:', value: interaction.guild.createdAt.toLocaleString()}
            )
        
        await interaction.editReply({ embeds: [embed]});
    }
}