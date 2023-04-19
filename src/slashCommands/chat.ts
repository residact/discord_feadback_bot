import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, SlashCommandBuilder} from "discord.js"
import {SlashCommand} from "../types";
import {getCompletions, isApiUp} from "../api/apiUtils";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("chat with the bot")
        .addStringOption(option => {
            return option
                .setName("message")
                .setDescription("Message send to bot")
                .setRequired(true);
        })
        .addBooleanOption(option => {
            return option
                .setName('system_bool')
                .setDescription("Condition the use of a system message")
                .setRequired(false);
        })
        .addBooleanOption(option => {
            return option
                .setName('print_info')
                .setDescription("Condition print info")
                .setRequired(false);
        })
        .addStringOption(option => {
            return option
                .setName("system")
                .setDescription("Message system to send to bot")
                .setRequired(false);
        })
    ,
    execute: async interaction => {
        await interaction.deferReply();
        if (await isApiUp()) {
            const options: { [key: string]: string | number | boolean } = {};
            if (!interaction.options) return interaction.editReply({content: "Something went wrong..."});
            for (let i = 0; i < interaction.options.data.length; i++) {
                const element = interaction.options.data[i];
                if (element.name && element.value) options[element.name] = element.value;
            }
            try {
                const messages = [];

                if (options.system_bool && options.system) {
                    messages.push({
                        "role": "system",
                        "content": options.system.toString()
                    });
                } else if (options.system_bool) {
                    messages.push({
                        "role": "system",
                        "content": "You are a helpful assistant."
                    });
                }

                messages.push({
                    "role": "user",
                    "content": options.message.toString()
                });

                const data = {
                    "messages": messages
                };

                const response = await getCompletions(data);

                if (response.status === 200) {
                    const message = response.data.choices[0].message.content;
                    const model = response.data.model;

                    const id = response.data.id;
                    const object = response.data.object;
                    const prompt_tokens = response.data.usage.prompt_tokens;
                    const completion_tokens = response.data.usage.completion_tokens;
                    const total_tokens = response.data.usage.total_tokens;
                    const finish_reason = response.data.choices[0].finish_reason;


                    const fields = [];

                    fields.push(
                        {
                            name: "question",
                            value: options.message.toString(),
                            inline: false
                        }
                    )

                    if (options.system_bool && options.system) {
                        fields.push({
                            name: "system",
                            value: options.system.toString(),
                            inline: false
                        });
                    } else if (options.system_bool) {
                        fields.push({
                            name: "system",
                            value: "You are a helpful assistant.",
                            inline: false
                        });
                    }

                    fields.push(
                        {
                            name: "answer",
                            value: message,
                            inline: false
                        },
                        {
                            name: "model",
                            value: model,
                            inline: false
                        },
                        // {
                        //     name:"msg_id",
                        //     inline: false
                        // },
                    )

                    const embeds = [];

                    embeds.push(
                        new EmbedBuilder()
                            .setTitle("CHAT")
                            .setAuthor({name: interaction.user?.username || "error"})
                            .setColor("Blue")
                            .setFields(fields)
                    )

                    if (options.print_info) {
                        embeds.push(
                            new EmbedBuilder()
                                .setTitle("INFO")
                                .setColor("Yellow")
                                .setFields([
                                    {
                                        name: "id",
                                        value: id.toString(),
                                        inline: false
                                    },
                                    {
                                        name: "object",
                                        value: object.toString(),
                                        inline: false
                                    },
                                    {
                                        name: "prompt_tokens",
                                        value: prompt_tokens.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "completion_tokens",
                                        value: completion_tokens.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "total_tokens",
                                        value: total_tokens.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "finish_reason",
                                        value: finish_reason.toString(),
                                        inline: true
                                    }
                                ])
                        )
                    }

                    const thumbsUpButton = new ButtonBuilder()
                        .setCustomId("thumbsUpButton")
                        .setEmoji("👍")
                        .setStyle(ButtonStyle.Success)

                    const thumbsDownButton = new ButtonBuilder()
                        .setCustomId("thumbsDownButton")
                        .setEmoji("👎")
                        .setStyle(ButtonStyle.Danger)

                    const actionRow = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(thumbsUpButton, thumbsDownButton);


                    await interaction.editReply({
                        embeds: embeds,
                        components: [actionRow]
                    });

                } else {
                    await interaction.editReply({
                        content: 'Une erreur s\'est produite lors de la requête.'
                    });
                }
            } catch (error) {
                console.log(error)
                await interaction.editReply({
                    content: 'Une erreur s\'est produite lors de la requête.'
                });
            }
        } else {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("API LLama is down")
                        .setColor("Red")
                ],
            });
        }


    },
    cooldown: 10
}

export default command
