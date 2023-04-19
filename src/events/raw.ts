import {Events} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.Raw,
    execute: async (interaction: Events) => {
    }
}

export default event;
