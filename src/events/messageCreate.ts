import {ChannelType, Message} from "discord.js";
import {BotEvent} from "../types";
import ChatMessageModel from "../schemas/ChatMessage";

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        if (message.author.bot) return;

        if (message.reference) {

            const messageIdInitial = message.reference.messageId;
            console.log(messageIdInitial)
            await ChatMessageModel.findOneAndUpdate(
                {messageId: messageIdInitial},
                {
                    correctAnswer: message.content,
                },
                {new: true}
            );
        }

    }
}

export default event
