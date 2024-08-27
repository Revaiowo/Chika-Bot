import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";
import axios from 'axios';

export default {

    data: new SlashCommandBuilder()
        
        .setName('hentai')
        .setDescription('Get a cute waifu pic but nude')

        .addStringOption(option =>
            option
                .setName('tag')
                .setDescription('Choose one of the tags')
                .addChoices(
                    { name: 'Ero', value: 'ero' },
                    { name: 'Ass', value: 'ass' },
                    { name: 'Milf', value: 'milf' },
                    { name: 'Oral', value: 'oral' },
                    { name: 'Paizuri', value: 'paizuri' },
                    { name: 'Ecchi', value: 'ecchi' },
                )
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        const tag = interaction.options.getString('tag') || 'hentai';
        
        let waifu;

        try {
            const res = await axios.get(`https://api.waifu.im/search?included_tags=${tag}`);
            waifu = res.data;
        } catch (error) {
            console.log(error)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`API Error: Something went wrong.`)]
            });
        }

        const embed = new EmbedBuilder()
            .setImage(waifu.images[0].url)
          
        await interaction.editReply({ embeds: [embed]});
    }
}