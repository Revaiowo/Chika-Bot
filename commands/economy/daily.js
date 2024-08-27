import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Economy } from '../../models/economy.js';

export default {

    cooldown: 60 * 60 * 24,

    data: new SlashCommandBuilder()

        .setName('daily')
        .setDescription('Collect 200 Gems daily')

        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();
        
        const User = await Economy.findOne({ userId: interaction.user.id });
        
        if (!User) 
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`You are not registered.`)]
            });
        
        const emoji = '<a:Gem:1274344036102307974>'; 
        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        
        const globalEmbed = new EmbedBuilder()
            .setTitle(`You Have Collected 200${emoji}!`)
            .setDescription('You Can Collect It Again After 24 Hours.')
            // .setThumbnail(senderAvatar)
            .setColor('Green')
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        await Economy.updateOne({ userId: interaction.user.id }, { $set: { wallet: User.wallet + 200 } });
            
        await interaction.editReply({ embeds: [globalEmbed] })
    }
}  