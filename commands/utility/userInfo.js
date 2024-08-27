import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('userinfo')
        .setDescription('Get all information of a user')

        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('A user whose info you want to see')
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.cache.get(user?.id);

        const permissionPriority = [
            'Administrator',
            'ManageGuild',
            'ManageRoles',
            'ManageChannels',
            'KickMembers',
            'BanMembers',
            'ManageMessages',
            'MuteMembers',
            'MentionEveryone',
            'SendMessages',
            'AttachFiles',
            'ViewChannel'
        ];

        let userName, userId, registerDate, joinDate, isBot, highestPermission, highestRole, memberPermissions, avatar;

        if (!member && !user) {
            userName = interaction.user.username;
            userId = interaction.user.id;
            avatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
            registerDate = interaction.user.createdAt.toLocaleString();
            joinDate = interaction.member.joinedAt.toLocaleString();
            isBot = interaction.user.bot;
            highestRole = interaction.member.roles.highest.name;
            memberPermissions = interaction.member.permissions.toArray();
            highestPermission = permissionPriority.find(permission => memberPermissions.includes(permission));
        }

        else if (!member && user)
            return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('User does not belong to this server.')]
                });

        else {
            userName = member.user.username;
            userId = member.user.id;
            avatar = member.user.displayAvatarURL({ format: 'png', dynamic: true });
            registerDate = member.user.createdAt.toLocaleString();
            joinDate = member.joinedAt.toLocaleString();
            isBot = member.user.bot;
            highestRole = member.roles.highest.name;
            memberPermissions = member.permissions.toArray();
            highestPermission = permissionPriority.find(permission => memberPermissions.includes(permission));
        }

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
    
        const embed = new EmbedBuilder()
            .setTitle('User Info')
            .setThumbnail(avatar)
            .addFields(
                { name: 'Username:', value: userName },
                { name: 'UserID:', value: userId },
                { name: 'Registered:', value: registerDate, inline: true },
                { name: 'Joined:', value: joinDate, inline:true},
                { name: 'Bot:', value: isBot.toString() },
                { name: 'Highest Role:', value: highestRole || 'None', inline:true },
                { name: 'Highest Permission:', value: highestPermission || 'None', inline:true}
            )
            .setTimestamp()
            .setColor('Green')
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        await interaction.editReply({ embeds: [embed]});

        
        
    }

}