import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Economy } from '../../models/economy.js';

export default {

    data: new SlashCommandBuilder()

        .setName('take')
        .setDescription('Owner only command')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription("Check user's bank balance")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount you want to transfer')
                .setRequired(true)
                .setMinValue(1)
        )

        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for taking money')
        )

        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.cache.get(user?.id);

        const amount = interaction.options.getInteger('amount');
        const reason = interaction.options.getString('reason') || 'No Reason Provided';
        
        const Member = await Economy.findOne({ userId: member.user.id });

        const ownerId = '468392588790071296';

        if (interaction.user.id !== ownerId)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('This is owner only command.')]
            });
        
        if (!Member) 
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`${member.user.username} is not registered.`)]
            });

        await Economy.updateOne({ userId: member.user.id }, { $set: { bank: Member.bank - amount }});
        
        const emoji = '<a:Gem:1274344036102307974>'; 
        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        
        const globalEmbed = new EmbedBuilder()
            .setTitle('Transaction Successfull!')
            .addFields(
                { name: 'Taken By:', value: interaction.user.username },
                { name: 'Taken From:', value: member.user.username },
                { name: 'Amount:', value: `${amount} ${emoji}` },
                { name: 'Reason:', value: reason }
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
        
        await interaction.editReply({ embeds: [globalEmbed] });

        try {
            await member.send({ embeds: [ globalEmbed.setFooter(null).setTimestamp(null) ] });
        } catch (error) {
            console.log(`Can't dm ${member.user.username}`);
        }
            
    }
}  