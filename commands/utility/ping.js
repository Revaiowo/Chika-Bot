import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {

  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),

  async execute(interaction) {

        const sent = await interaction.reply({ content: 'Waiting for latency...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`${latency}ms:ping_pong:`);

    
  },
};