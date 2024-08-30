import { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, BurstHandlerMajorIdKey  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('help')
        .setDescription('All registered slash commands')
    
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        const help = new StringSelectMenuBuilder()
            .setCustomId('help')
            .setPlaceholder('Help Portal!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Anime')
                    .setDescription('Commands related to anime')
                    .setValue('anime'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Economy')
                    .setDescription('Commands related to economy')
                    .setValue('economy'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Moderation')
                    .setDescription('Commands related to moderation')
                    .setValue('moderation'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Utility')
                    .setDescription('Commands related to utility')
                    .setValue('utility'),
            )
            
        const helpRow = new ActionRowBuilder()
            .addComponents(help)
        
        const button =  new ButtonBuilder()
            .setLabel('Menu')
            .setCustomId('menu')
            .setDisabled(true)
            .setStyle(ButtonStyle.Success)

        const buttonRow = new ActionRowBuilder()
            .addComponents(button);
        
        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        const emoji = '<a:Gem:1274344036102307974>'; 
        
        const globalEmbed = new EmbedBuilder()
            .setTitle('Help Portal!')
            .setDescription('**Unfortunately, we have switched to slash commands. So, normal prefix commands will not work.**')
            .setColor('Yellow')
            .addFields(
                { name: 'Anime', value: `Commands related to anime.`},
                { name: 'Economy', value: `Commands related to economy.`},
                { name: 'Moderation', value: `Commands related to moderation.`},
                { name: 'Utility', value: `Commands related to utility.`},
            )
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        const menuResponse = await interaction.editReply({ embeds: [globalEmbed], components: [helpRow, buttonRow] });
        
        const collector = await menuResponse.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 1000 * 60 * 15
        });

        collector.on('collect', async i => {
            
            await i.deferUpdate();

            if (i.customId === 'menu') {
                
                button.setDisabled(true);

                await i.editReply({ embeds: [globalEmbed], components: [helpRow, buttonRow] });
            }

            else if (i.values[0] === 'anime') {

                const embed = new EmbedBuilder()
                    .setTitle('Anime Commands')
                    .setColor('Yellow')
                    .addFields(
                        { name: 'anime', value: 'Get information about an anime.'},
                        { name: 'manga', value: 'Get information about a manga.'},
                        { name: 'waifu', value: 'Get random image of a waifu.'},
                        { name: 'hentai', value: 'Get random image of a waifu [NSFW].'}
                    )
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

                button.setDisabled(false);
                
                await i.editReply({ embeds: [embed], components: [helpRow, buttonRow] });
            }

            else if (i.values[0] === 'economy') {
                const embed = new EmbedBuilder()
                    .setTitle('Economy Commands')
                    .setColor('Yellow')
                    .addFields(
                        { name: 'balance', value: 'Get wallet amount of a member.'},
                        { name: 'bank', value: 'Get bank amount of a member.'},
                        { name: 'daily', value: `Get 200${emoji} daily.`},
                        { name: 'deposit', value: 'Deposit money into your bank.'},
                        { name: 'withdraw', value: 'Withdraw money from your bank'},
                        { name: 'give', value: 'Give money to a member.'},
                        { name: 'shop', value: 'Buy a role of your choice.'},
                        { name: 'register', value: 'Register into the AUI Economy System.'},
                        { name: 'award', value: 'Award money to a member [Owner Only]'},
                        { name: 'take', value: 'Take money from a member [Onwer Only]'},
                    )
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

                button.setDisabled(false);
                
                await i.editReply({ embeds: [embed], components: [helpRow, buttonRow] });
            }

            else if (i.values[0] === 'moderation') {
                const embed = new EmbedBuilder()
                    .setTitle('Moderation Commands')
                    .setColor('Yellow')
                    .addFields(
                        { name: 'clear', value: 'Purge a certain amount of messages.'},
                        { name: 'kick', value: 'Kick a member.'},
                        { name: 'ban', value: 'Ban a member.'},
                        { name: 'unban', value: 'Unban a member.'},
                        { name: 'mute', value: 'Mute a member.'},
                        { name: 'unmute', value: 'Unmute a member.'},
                        { name: 'timeout', value: 'Mute a member for a certain amount of time.'},
                        { name: 'role', value: 'Give/take role from a member.'},
                        { name: 'rolecolor', value: 'Change color of a role.'},
                        { name: 'warn', value: 'This includes warn, clearwarn, delwarn, warnlog.'},
                      
                    )
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

                button.setDisabled(false);
                
                await i.editReply({ embeds: [embed], components: [helpRow, buttonRow] });
            }

            else if (i.values[0] === 'utility') {
                const embed = new EmbedBuilder()
                    .setTitle('Anime Commands')
                    .setColor('Yellow')
                    .addFields(
                        { name: 'avatar', value: 'View a member avatar.'},
                        { name: 'calculate', value: 'Calculate mathematical expressions.'},
                        { name: 'ping', value: 'Get bot latency.'},
                        { name: 'serverinfo', value: 'Get information related to the server.'},
                        { name: 'userinfo', value: 'Get information related to a member.'},
                    )
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

                button.setDisabled(false);
                
                await i.editReply({ embeds: [embed], components: [helpRow, buttonRow] });
            }

            
        });

        collector.on('end', async i => {

            helpRow.components.forEach(component => component.setDisabled(true));
            button.setDisabled(true);

            await interaction.editReply({ components: [helpRow, buttonRow]});
        });
        
    }

}