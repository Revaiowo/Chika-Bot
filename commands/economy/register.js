import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, OverwrittenMimeTypes  } from "discord.js";
import { Economy } from '../../models/economy.js';

export default {

    data: new SlashCommandBuilder()

        .setName('register')
        .setDescription('Register into the AUI Economy System')

        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('This is owner only command')
        )

        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.cache.get(user?.id);

        const ownerId = '468392588790071296';

        let User = await Economy.findOne({ userId: interaction.user.id });
        
        if (member && interaction.user.id === ownerId)
            User = await Economy.findOne({ userId: member.user.id });
        
        else if (member && interaction.user.id !== ownerId)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription("You can't register someone else, only the owner can.")]
            });
        
        if (User) {
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`${member ?`${member.user.username} is`: 'You are'} already registered.`)]
            });
        };
        
        User = await Economy.create({
            userId: member ? member.user.id : interaction.user.id,
            userName: member ? member.user.username : interaction.user.username,
            wallet: 100,
            bank: 0
        });
        
        const emoji = '<a:Gem:1274344036102307974>'; 
        const senderAvatar = (member ? member : interaction).user.displayAvatarURL({ format: 'png', dynamic: true });
        
        const globalEmbed = new EmbedBuilder()
            .setTitle('AUI Account Successfully Created!')
            .setThumbnail(senderAvatar)
            .setColor('Yellow')
            .addFields(
                { name: 'Username:', value: member ? member.user.username : interaction.user.username},
                { name: 'User ID:' , value: member ? member.user.id : interaction.user.id },
                { name: 'AUI Gems:', value: `${User.wallet} ${emoji}` }, 
                { name: 'Bank:', value: `${User.bank} ${emoji}`},
                { name: 'Account Created:', value: `${new Date().toLocaleString()}` }
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
            
        
        await interaction.editReply({ embeds: [globalEmbed] })
    }
}  