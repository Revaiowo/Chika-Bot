import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Economy } from '../../models/economy.js';

export default {

    data: new SlashCommandBuilder()

        .setName('give')
        .setDescription('Give some money to a user')

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

        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.cache.get(user?.id);

        const amount = interaction.options.getInteger('amount');
        
        const User = await Economy.findOne({ userId: interaction.user.id });
        const Member = await Economy.findOne({ userId: member.user.id });
        
        if (!User) 
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`You are not registered.`)]
            });
        
        if (!Member) 
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`${member.user.username} is not registered.`)]
            });

        if (interaction.user.id === member.user.id)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription("You can't send yourself the money.")]
            });

        if (User.wallet < amount)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription("You don't have enough money in your wallet to send.")]
            });

        await Economy.updateOne({ userId: interaction.user.id }, { $set: { wallet: User.wallet - amount }});
        await Economy.updateOne({ userId: member.user.id }, { $set: { wallet: Member.wallet + amount }});
        
        const emoji = '<a:Gem:1274344036102307974>'; 
        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        
        const globalEmbed = new EmbedBuilder()
            .setTitle('Transaction Successfull!')
            .addFields(
                { name: 'Sent By:', value: interaction.user.username },
                { name: 'Sent To:', value: member.user.username },
                { name: 'Amount:', value: `${amount} ${emoji}` }
            )
            .setColor('Green')
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
        
        try {
            await member.send({ embeds: [globalEmbed] });
        } catch (error) {
            console.log(`Can't dm ${member.user.username}`);
        }
            
        await interaction.editReply({ embeds: [globalEmbed] });
    }
}  