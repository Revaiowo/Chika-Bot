import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Warn } from '../../models/warn.js'

export default {

    data: new SlashCommandBuilder()

        .setName('warn')
        .setDescription('Warn a user')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('User name or id')
                .setRequired(true)
        )

        .addStringOption(option => 
            option
                .setName('warning')
                .setDescription('Warning for the user')
                .setRequired(true)
        )

        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const warning = interaction.options.getString('warning');
        
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

        const globalEmbed = new EmbedBuilder()
            .setTitle('Warn Successfull!')
            .setColor('Blue')
            .addFields(
                { name: 'Member Name:', value: member.user.username },
                { name: 'Warning:', value: warning }
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
        
        const privateEmbed = new EmbedBuilder()
            .setTitle(`You have been warned in ${interaction.guild.name}.`)
            .setColor('Blue')
            .addFields({ name: 'Warning:', value: warning });
        
        let User = await Warn.findOne({ userId: member.user.id });

        if (!User) {
            User = await Warn.create({
                userId: member.user.id,
                userName: member.user.username,
                warn: [],
            });
        };

        await Warn.updateOne(
            { userId: member.user.id }, 
            { $push: { 
                warn: {
                    reason: warning,
                    modName: interaction.user.username
                }
            }});

        try {
            await member.send({ embeds: [privateEmbed] })
        } catch (error) {

            if (error.code === 50007) // api error code when can't send message to dms
                console.log(`Could not send a dm to ${member.username}.`);
        }
        await interaction.editReply({ embeds: [globalEmbed] })
    }
}  