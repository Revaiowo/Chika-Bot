import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";
import axios from 'axios';

export default {

    data: new SlashCommandBuilder()
        
        .setName('manga')
        .setDescription('Get info about any mangaa')

        .addStringOption(option =>
            option
                .setName('manga')
                .setDescription('Name of the manga')
                .setRequired(true)
        )
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        
        const mangaName = interaction.options.getString('manga');
        let manga;

        try {
            const res = await axios.get(`https://api.jikan.moe/v4/manga?q=${mangaName}&limit=1`);
            manga = res.data.data[0];
        } catch (error) {
            await interaction.editReply(`$API Error: ${error.message}`)
            return console.log(error)
        }

        if (!manga)
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription("Couldn't find that manga.")]
            });

        const genres = [];

        manga.genres.forEach(genre => genres.push(genre.name));
        manga.themes.forEach(theme => genres.push(theme.name));
        manga.demographics.forEach(demo => genres.push(demo.name));
        manga.explicit_genres.forEach(explict => genres.push(explict.name));

        const senderAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
    
        const embed = new EmbedBuilder()
            .setTitle(manga?.title || 'None')
            .setURL(manga.url)
            .setThumbnail(manga.images.jpg.image_url)
            .setDescription(manga?.synopsis || 'None')
            .addFields(
                { name: 'Score:', value: manga.score?.toString() || '?' },
                { name: 'Chapters:', value: manga.chapters?.toString() || '?' },
                { name: 'Volumes:', value: manga.volumes?.toString() || '?' },
                { name: 'Status:', value: manga.status || '?' },
                { name: 'Author:', value: manga.authors[0]?.name || '?' },
                { name: 'Published:', value: manga.published.string || '?' },
                { name: 'Genres:', value: genres.join(', ') || '?' }
            )
            .setTimestamp()
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: senderAvatar });

        await interaction.editReply({ embeds: [embed]});
    }
}