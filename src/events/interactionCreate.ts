import {Interaction, TextInputStyle} from "discord.js";
import {BotEvent} from "../types";
import ChatMessageModel from "../schemas/ChatMessage";

const event: BotEvent = {
    name: "interactionCreate",
    execute: async (interaction: Interaction, client) => {

        if (interaction.isButton()) {

            console.log("btn trigering")
            const messageId = interaction.message.id;
            const customId = interaction.customId;

            if (customId === "thumbsUpButton") {
                await interaction.deferReply();
                await ChatMessageModel.findOneAndUpdate(
                    {messageId},
                    {like: true, dislike: true},
                    {new: true}
                );
                interaction.editReply({
                    content: "Like Considered"
                })
            } else if (customId === "thumbsDownButton") {
                await interaction.deferReply();
                await ChatMessageModel.findOneAndUpdate(
                    {messageId},
                    {dislike: true, like: false},
                    {new: true}
                );
                interaction.editReply({
                    content: "Dislike Considered"
                })
            }
        } else if (interaction.isChatInputCommand()) {
            let command = interaction.client.slashCommands.get(interaction.commandName)
            if (!command) return;
            command.execute(interaction)
        }


    }
}


export default event;
