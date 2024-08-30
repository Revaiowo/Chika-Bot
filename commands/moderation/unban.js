import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";


export default {

    data: new SlashCommandBuilder()

        .setName('unban')
        .setDescription('Unban a user')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('User discord id')
                .setRequired(true)
        )

        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('Reason for unbanning the user')
        )

        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const member = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'No reason provide.';

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers))
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Bitch you dont have enough permissions.')]
                });

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });

        const globalEmbed = new EmbedBuilder()
            .setTitle('Unban Successfull!')
            .setColor('Blue')
            .addFields(
                { name: 'Member Name:', value: member.username },
                { name: 'Reason', value: reason }
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
        
        const privateEmbed = new EmbedBuilder()
            .setTitle(`You have been unbanned from ${interaction.guild.name}.`)
            .setColor('Blue')
            .addFields({ name: 'Reason:', value: reason });

            await interaction.guild.members.unban(member, { reason });
                            
            try {
                await member.send({ embeds: [privateEmbed] })
            } catch (error) {
                
                if (error.code === 50007) // api error code when can't send message to dms
                console.log(`Could not send a dm to ${member.username}.`);
            }
            
            await interaction.editReply({ embeds: [globalEmbed] })
        }
}  