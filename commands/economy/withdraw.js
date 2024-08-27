import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Economy } from '../../models/economy.js';

export default {

    data: new SlashCommandBuilder()

        .setName('withdraw')
        .setDescription('Winthdraw money from your bank')

        .addStringOption(option => 
            option
                .setName('amount')
                .setDescription("An integer or 'all'")
                .setRequired(true)
        )
        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        let amount = interaction.options.getString('amount');
        
        let User = await Economy.findOne({ userId: interaction.user.id });
        
        if (!User) 
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`You are not registered.`)]
            });

        if (amount === 'all')
            amount = User.bank;

        else {
            amount = Number(amount);
            
            if (isNaN(amount))
                return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Amount should be an integer.')]
                });

            if (amount < 1)
                return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Amount should be greater than 0.')]
                });
        }

        if (User.bank < amount)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription("You don't have enough money to withdraw.")]
            });
    
        await Economy.findOneAndUpdate(
            { userId: interaction.user.id }, 
            { $set: 
                { bank: User.bank - amount, wallet: User.wallet + amount }
            }
        );

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        const emoji = '<a:Gem:1274344036102307974>'; 
        
        const globalEmbed = new EmbedBuilder()
            .setTitle(interaction.user.username)
            .setDescription(`You have withdrawn ${amount} ${emoji} from your Bank!`)
            // .setThumbnail(senderAvatar)
            .setColor('Green')
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
            
        await interaction.editReply({ embeds: [globalEmbed] })
    }
}  