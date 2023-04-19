import {ChannelType, Embed, Message} from "discord.js";
import {BotEvent} from "../types";
import ChatMessageModel from "../schemas/ChatMessage";

const event: BotEvent = {
    name: "messageUpdate",
    execute: async (oldMessage: Message, newMessage: Message) => {
        if (newMessage.author.bot && newMessage.embeds.length > 0) {

            const embed: Embed | undefined = newMessage.embeds[0];

            if (embed) {

                if (embed.title === "CHAT") {
                    const embedObject = {
                        title: embed.title ?? null,
                        description: embed.description ?? null,
                        url: embed.url ?? null,
                        color: embed.color ?? null,
                        timestamp: embed.timestamp ?? null,
                        fields: embed.fields.map(field => ({
                            name: field.name,
                            value: field.value,
                            inline: field.inline
                        })),
                        author: embed.author ? {
                            name: embed.author.name ?? null,
                            iconURL: embed.author.iconURL ?? null,
                            url: embed.author.url ?? null
                        } : null,
                        image: embed.image ? {
                            url: embed.image.url ?? null,
                            proxyURL: embed.image.proxyURL ?? null,
                            height: embed.image.height ?? null,
                            width: embed.image.width ?? null
                        } : null,
                        thumbnail: embed.thumbnail ? {
                            url: embed.thumbnail.url ?? null,
                            proxyURL: embed.thumbnail.proxyURL ?? null,
                            height: embed.thumbnail.height ?? null,
                            width: embed.thumbnail.width ?? null
                        } : null,
                        footer: embed.footer ? {
                            text: embed.footer.text ?? null,
                            iconURL: embed.footer.iconURL ?? null
                        } : null
                    };

                    let newChatMessage = new ChatMessageModel({
                        messageId: newMessage.id.toString(),
                        user: newMessage.embeds[0].author?.name,
                        chanelId: newMessage.channelId.toString(),
                        model: embedObject.fields.find(field => field.name === "model")?.value ?? "",
                        messageUser: embedObject.fields.find(field => field.name === "question")?.value ?? "",
                        answer: embedObject.fields.find(field => field.name === "answer")?.value ?? "",
                        like: false,
                        dislike: false,
                    })

                    if (embedObject.fields.find(field => field.name === "system")?.value) {
                        newChatMessage.messageSystem = embedObject.fields.find(field => field.name === "system")?.value
                    }

                    await newChatMessage.save()
                }
            }
        }
    }
}

export default event
