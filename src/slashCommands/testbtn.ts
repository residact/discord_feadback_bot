import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType, SlashCommandBuilder} from "discord.js"
import {SlashCommand} from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("testbtn")
        .setDescription("testbtn"),
    execute: async interaction => {
        const thumbsUpButton = new ButtonBuilder()
            .setCustomId("thumbsUpButton")
            .setEmoji("👍")
            .setStyle(ButtonStyle.Success)

        const thumbsDownButton = new ButtonBuilder()
            .setCustomId("thumbsDownButton")
            .setEmoji("👎")
            .setStyle(ButtonStyle.Danger)

        const correctAnswerButton = new ButtonBuilder()
            .setCustomId("correctAnswerButton")
            .setLabel("Correct answer")
            .setStyle(ButtonStyle.Secondary)

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(thumbsUpButton, thumbsDownButton, correctAnswerButton);


        const sentMessage = await interaction.reply({
            components: [actionRow],
        });
        const collector = sentMessage.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 3_600_000
        });

        collector.on('collect', async i => {
            const selection = i.values[0];
            await i.reply(`${i.user} has selected ${selection}!`);
        });
    },
}

export default command
