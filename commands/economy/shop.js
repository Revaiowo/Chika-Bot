import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder, ComponentType, ButtonBuilder, ButtonStyle  } from "discord.js";
import { Economy } from '../../models/economy.js';



export default {

    data: new SlashCommandBuilder()

        .setName('shop')
        .setDescription('Buy roles from the shop')

        .setDMPermission(false),

    async execute(interaction){

        await interaction.deferReply();
        
        const shop = new StringSelectMenuBuilder()
            .setCustomId('shop')
            .setPlaceholder('Buy Role')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('DJ Role')
                    .setDescription('Buy DJ Role')
                    .setValue('dj'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Hydra Access Role')
                    .setDescription('Buy Hydra Access Role')
                    .setValue('hydra'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Torrent Role')
                    .setDescription('Buy Torrent Role')
                    .setValue('torrent'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Black Swordsman Role')
                    .setDescription('Buy Black Swordsman Role')
                    .setValue('black swordsman'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Shinomiya Role')
                    .setDescription('Buy Shinomiya Role')
                    .setValue('shinomiya'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Prismatic Role')
                    .setDescription('Buy Prismatic Role')
                    .setValue('prismatic'),
            )
            
        const menuRow = new ActionRowBuilder()
            .addComponents(shop)
        
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Buy')
                    .setCustomId('buy')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel('Deny')
                    .setCustomId('deny')
                    .setStyle(ButtonStyle.Danger)
            );
        
        const emoji = '<a:Gem:1274344036102307974>'; 
        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
        
        const globalEmbed = new EmbedBuilder()
            .setTitle('Role Shop')
            .setColor('Yellow')
            .addFields(
                { name: '#1 DJ Role', value: `Price: **2000**${emoji}`},
                { name: '#2 Hydra Access Role', value: `Price: **3000**${emoji}`},
                { name: '#3 Torrent Role', value: `Price: **5000**${emoji}`},
                { name: '#4 Black Swordsman Role', value: `Price: **20000**${emoji}`},
                { name: '#5 Shinomiya Role', value: `Price: **50000**${emoji}`},
                { name: '#6 Prismatic Role', value: `Price: **100000**${emoji}`}
            )
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/1035975185561551009/1044926689437827112/white-flower-emoji-by-twitter.png')
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        const menuResponse = await interaction.editReply({ embeds: [globalEmbed], components: [menuRow] });
        
        const menuConfirmation = await menuResponse.awaitMessageComponent({
            filter: i => i.user.id === interaction.user.id,
            time: 1000 * 60
        });

        await menuConfirmation.deferUpdate();

        let role = {
            name: '',
            id: '',
            price: 0
        };

        if (menuConfirmation.values[0] === 'dj') {
            role.name = 'DJ';
            role.id = '1274744575352897740';
            role.price = 2000;
        }
        else if (menuConfirmation.values[0] === 'hydra') {
            role.name = 'Hydra Access';
            role.id = '1274744636291813447';
            role.price = 3000;
        }
        else if (menuConfirmation.values[0] === 'torrent') {
            role.name = 'Torrent Access';
            role.id = '1274744687948726303';
            role.price = 5000;
        }
        else if (menuConfirmation.values[0] === 'black swordsman') {
            role.name = 'The Black Swordsman';
            role.id = '1274744763857244294';
            role.price = 20_000;
        }
        else if (menuConfirmation.values[0] === 'shinomiya') {
            role.name = 'Shinomiya';
            role.id = '1274744815870808226';
            role.price = 50_000;
        }
        else if (menuConfirmation.values[0] === 'prismatic') {
            role.name = 'Prismatic';
            role.id = '1274744864335986698';
            role.price = 100_000;
        }
        
        const chosenRole = interaction.guild.roles.cache.get(role.id);

        if (interaction.member.roles.cache.has(chosenRole.id))
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`You already have ${chosenRole.name} role.`)]
            });

        const User = await Economy.findOne({ userId: interaction.user.id });

        if (!User)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('You are not registered.')]
            });

        if (User.wallet < role.price)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription("You don't have enough money in your wallet to buy this role.")]
            });
            return await interaction.followUp();

        const embed = new EmbedBuilder()
            .setTitle('Confirm Transaction')
            .setDescription(`**Role:** ${role.name}\n\n**Price:** ${role.price}${emoji}`)
            .setColor('Orange')

        const buttonResponse = await interaction.followUp({ embeds: [embed], components: [buttonRow]});

        try {
            const buttonConfimation = await buttonResponse.awaitMessageComponent({
                filter: i => i.user.id === interaction.user.id,
                time: 1000 * 60
            });

            await buttonConfimation.deferUpdate();

             const embed = new EmbedBuilder()
                .setTitle('Role Purchased')
                .setDescription('Here Is Your Receipt!')
                .addFields(
                    { name: 'Role Name:', value: role.name},
                    { name: 'Price:', value: `${role.price}${emoji}`}
                )
                .setColor('Yellow')
                .setTimestamp()
                .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });
            
            menuRow.components.forEach(component => component.setDisabled(true));
            await buttonResponse.delete();
            await interaction.editReply({ components: [menuRow]});

            if (buttonConfimation.customId == 'buy') {

                const User = await Economy.findOne({ userId: interaction.user.id });

                await Economy.updateOne(
                    { userId: interaction.user.id }, 
                    { $set: { wallet: User.wallet - role.price }}
                );

                await interaction.member.roles.add(chosenRole);

                await interaction.followUp({ embeds: [embed], components: [] });
            }
            else 
                return await interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Transaction caceled.')]
                });
            
        } catch (error) {

            menuRow.components.forEach(component => component.setDisabled(true));
            await interaction.editReply({ components: [menuRow]});

            await interaction.followUp({ 
                embeds: [new EmbedBuilder().setDescription('You ran out of time')]
            });
            console.log(error)
        }
    },
}  