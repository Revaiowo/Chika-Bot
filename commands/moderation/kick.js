import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";


export default {

    data: new SlashCommandBuilder()

        .setName('kick')
        .setDescription('Kick a user')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('User name or id')
                .setRequired(true)
        )

        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('Reason for kicking the user')
        )

        // .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const reason = interaction.options.getString('reason') || 'No reason provide.';
        
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.cache.get(user.id);
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers))
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
            .setTitle('Kick Successfull!')
            .setColor('Blue')
            .addFields(
                { name: 'Member Name:', value: member.user.username },
                { name: 'Reason', value: reason }
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
        
        const privateEmbed = new EmbedBuilder()
            .setTitle(`You have been kicked from ${interaction.guild.name}.`)
            .setColor('Blue')
            .addFields({ name: 'Reason:', value: reason });

        try {
            await interaction.guild.members.kick(member, { reason });
        } catch (error) {

            if (error.message === 'Missing Permissions' || error.code === 50013)
                return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription("I don't have enough permission do that.")]
                });
            else {
                console.log(error.message)
                return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Something went wrong.')]
                });
            }
        }

        try {
            await member.send({ embeds: [privateEmbed] })
        } catch (error) {

            if (error.code === 50007) // api error code when can't send message to dms
                console.log(`Could not send a dm to ${member.username}.`);
        }
        await interaction.editReply({ embeds: [globalEmbed] })
    }
}  