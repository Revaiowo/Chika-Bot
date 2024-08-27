import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import ms from 'ms';

export default {

    data: new SlashCommandBuilder()
        
        .setName('timeout')
        .setDescription('Timeout a user for specific duration')

        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('A user to mute')
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName('duration')
                .setDescription('[1d, 1 day, 4 hr, 5 year] or type "remove" to remove timeout')
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for timeout')
        )

        // .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        
        const reason = interaction.options.getString('reason') || 'No reason provide.';
        let durationString = interaction.options.getString('duration');

        const user = interaction.options.getUser('user'); 
        const member = await interaction.guild.members.fetch(user.id);

       if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers))
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

        if (durationString === 'remove') {

            await member.timeout(null);
            return await interaction.editReply({ 
                embeds: [ new EmbedBuilder().setDescription(`Timeout Removed From ${member.user.username}`).setColor('Blue') ]
            });
        };

        const duration = ms(durationString);
        
        if (!duration) 
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder('Enter correct duration foramt [1h/1 hour/1 d/1day]').setDescription()]
                });

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });

        const globalEmbed = new EmbedBuilder()
            .setTitle('Timeout Successfull!')
            .setColor('Blue')
            .addFields(
                { name: 'Member Name:', value: member.user.username },
                { name: 'Duration:', value: durationString },
                { name: 'Reason', value: reason }
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        await member.timeout(duration, reason);

        await interaction.editReply( {embeds: [globalEmbed]} );
    }
};