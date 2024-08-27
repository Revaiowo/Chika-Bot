import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { Economy } from '../../models/economy.js';

export default {

    data: new SlashCommandBuilder()

        .setName('bank')
        .setDescription('Check your bank balance')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription("Check user's bank balance")
        )
        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.cache.get(user?.id);
        
        let User = await Economy.findOne({ userId: interaction.user.id });
        
        if (member)
            User = await Economy.findOne({ userId: member.user.id });
        
        if (!User) 
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`${member ?`${member.user.username} is`: 'You are'} not registered.`)]
            });
        
        const emoji = '<a:Gem:1274344036102307974>'; 
        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        
        const globalEmbed = new EmbedBuilder()
        .setTitle(member ? member.user.username : interaction.user.username)
            .setDescription(`**Bank: ${User.bank}** ${emoji}`)
            // .setThumbnail(senderAvatar)
            .setColor('Green')
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
            
        await interaction.editReply({ embeds: [globalEmbed] })
    }
}  