import {CommandInteraction} from "discord.js";
import CommandDescription from "./CommandDescription";

export default class Command {
    readonly name: string;
    readonly description: CommandDescription[];
    readonly enabled: boolean;
    readonly execute: (interaction: CommandInteraction) => Promise<void>;

    constructor(settings: {name: string, description: CommandDescription[], enabled: boolean, execute: (interaction: CommandInteraction) => Promise<void>}) {
        this.name = settings.name;
        this.description = settings.description;
        this.enabled = settings.enabled;
        this.execute = settings.execute;
    }
}
