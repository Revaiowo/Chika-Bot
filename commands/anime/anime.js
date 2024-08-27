import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";
import axios from 'axios';

export default {

    data: new SlashCommandBuilder()
        
        .setName('anime')
        .setDescription('Get info about any anime')

        .addStringOption(option =>
            option
                .setName('anime')
                .setDescription('Name of the anime')
                .setRequired(true)
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        
        const animeName = interaction.options.getString('anime');
        let anime;

        try {
            const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${animeName}&limit=1`);
            anime = res.data.data[0];
        } catch (error) {
            await interaction.editReply({ 
                embeds: [new EmbedBuilder.setDescription(`${error.type}: ${error.message}`)]
            })
            return console.log(error)
        }

        if (!anime)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription("Couldn't find that anime.")]
            });

        const genres = [];

        anime.genres.forEach(genre => genres.push(genre.name));
        anime.themes.forEach(theme => genres.push(theme.name));
        anime.demographics.forEach(demo => genres.push(demo.name));
        anime.explicit_genres.forEach(explict => genres.push(explict.name));

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
    
        const embed = new EmbedBuilder()
            .setTitle(anime?.title || 'None')
            .setURL(anime.url)
            .setThumbnail(anime.images.jpg.image_url)
            .setDescription(anime?.synopsis || 'None')
            .addFields(
                { name: 'Studio:', value: anime.studios[0]?.name || '?' },
                { name: 'Score:', value: anime.score?.toString() || '?' },
                { name: 'Episodes:', value: anime.episodes?.toString() || '?' },
                { name: 'Rating:', value: anime.rating || '?' },
                { name: 'Status:', value: anime.status || '?' },
                { name: 'Source:', value: anime.source || '?'},
                { name: 'Aired:', value: anime.aired.string || '?' },
                { name: 'Genres:', value: genres.join(', ') || '?' }
            )
            .setTimestamp()
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        await interaction.editReply({ embeds: [embed]});
    }
}