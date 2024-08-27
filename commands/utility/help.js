import { SlashCommandBuilder, EmbedBuilder  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('help')
        .setDescription('All registered slash commands')
    
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();
        
        const commands = interaction.client.commands.map(cmd => cmd.data.name).join(', ');

        await interaction.editReply(commands);
    }

}