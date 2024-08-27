import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } from "discord.js";

export default {

    data: new SlashCommandBuilder()
        
        .setName('clear')
        .setDescription('Purges a number of messages')

        .addIntegerOption(option => 
            option
                .setName('amount')
                .setDescription('Amount you want to purge')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )

        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('A memeber whose messaages you want to purge')
        )
        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        const amount = interaction.options.getInteger('amount');
        const member = interaction.options.getUser('member') ?? undefined;

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages))
            return await interaction.editReply({ 
                embeds: [new EmbedBuilder().setDescription('Bitch you dont have enough permissions.')]
            });

        if (member) {

            const fetchedMessages = await interaction.channel.messages.fetch({ limit: amount + 1 });

            const userMessages = fetchedMessages.filter(msg => msg.author.id === member.id);

            return await interaction.channel.bulkDelete(userMessages, true)
                .catch (error => {
                    console.log(error);
                    interaction.editReply({ 
                        embeds: [new EmbedBuilder().setDescription('Something went wrong.')]
                    });
                });
        }

        await interaction.channel.bulkDelete(amount + 1, true)
            .catch (error =>{
                console.log(error.message);
                interaction.editReply({ 
                    embeds: [new EmbedBuilder().setDescription('Something went wrong')]
                });
            });
    }

}