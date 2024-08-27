import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";
import axios from 'axios';

export default {

    data: new SlashCommandBuilder()
        
        .setName('waifu')
        .setDescription('Get a cute waifu pic')

        .addStringOption(option =>
            option
                .setName('tag')
                .setDescription('Choose one of the tags')
                .addChoices(
                    { name: 'Maid', value: 'maid' },
                    { name: 'Oppai', value: 'oppai' },
                    { name: 'Selfie', value: 'selfies' },
                    { name: 'Uniform', value: 'uniform' },
                )
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        const tag = interaction.options.getString('tag') || 'waifu';
        
        let waifu;

        try {
            const res = await axios.get(`https://api.waifu.im/search?included_tags=${tag}`);
            waifu = res.data;
        } catch (error) {
            console.log(error)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription(`${error.type}: ${error.message}`)]
            });
        }

        const embed = new EmbedBuilder()
            .setImage(waifu.images[0].url)
          
        await interaction.editReply({ embeds: [embed]});
    }
}