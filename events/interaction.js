import { Events } from 'discord.js';
import { Collection } from 'discord.js';
import { handleError } from '../handlers/errorHandler.js';

export default {

	name: Events.InteractionCreate,

	async execute(interaction) {

		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);
			const { cooldowns } = interaction.client;

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			
			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const defaultCooldownDuration = 3;
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1_000);
					return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				await command.execute(interaction);
			} catch (error) {
				handleError(interaction, error);
			}
		}	

		else if (interaction.isButton() || interaction.isStringSelectMenu()) {

			const command = interaction.client.commands.find(cmd => cmd.customIds && cmd.customIds.includes(interaction.customId));

			if (command && command.handleInteraction) {
				try {
					await command.handleInteraction(interaction);
				} catch (error) {
					console.error(error);
					await interaction.reply({ content: 'There was an error while handling this interaction!', ephemeral: true });
				}
			}
		}
	},
};