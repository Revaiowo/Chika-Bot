import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";
import { hasNumericValue } from "mathjs";

export default {

    data: new SlashCommandBuilder()
        
        .setName('rolecolor')
        .setDescription('Change color of a role')

        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Enter the role')
                .setRequired(true)
        )

        .addStringOption(option => 
            option
                .setName('hex')
                .setDescription('Hex code')
                .setRequired(true)
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        const r = interaction.options.getRole('role');
        const role = interaction.guild.roles.cache.get(r.id);

        const hex = interaction.options.getString('hex').toUpperCase();

        const assetCreaterRole = interaction.guild.roles.cache.get('1273976252906209321');

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        
        const globalEmbed = new EmbedBuilder()
        .setTitle('Role Color Changed!')
        .setDescription(`Changed \`${role.name}\` color to **${hex}**`)
        .setTimestamp()
        .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
        
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {

             try {
                await role.setColor(hex);
            } catch (error) {
                
                console.log(error)
                if (error.name === 'Missing Permissions' || error.code === 50013)
                    return await interaction.editReply({ 
                        embeds: [new EmbedBuilder().setDescription("I don't have enough permission to do that.")]
                    });

                return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Provide a valid hex code [#64f4ab/64f4ab].')]
                });
            }

            await interaction.editReply( {embeds: [globalEmbed.setColor(hex)]} ); 
        } 
        
        else {
            if (interaction.member.roles.cache.some(r => r.id !== assetCreaterRole.id) && role.id !== assetCreaterRole.id)
                return await interaction.editReply({ 
                        embeds: [new EmbedBuilder().setDescription("Bitch you don't have enough permissions.")]
                    });

            try {
                await role.setColor(hex);
            } catch (error) {
                
                console.log(error)
                if (error.name === 'Missing Permissions' || error.code === 50013)
                    return await interaction.editReply({ 
                        embeds: [new EmbedBuilder().setDescription("I don't have enough permission to do that.")]
                    });

                return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Provide a valid hex code [#64f4ab/64f4ab].')]
                });
            }

            await interaction.editReply( {embeds: [globalEmbed.setColor(hex)]} );
        }
    }
}