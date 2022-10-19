import CommandInterface from "./Command";
import SubCommandGroupInterface from "./SubCommandGroupInterface";
import {CommandInteraction} from "discord.js";
import CommandDescription from "./CommandDescription";

export default class MainCommand extends CommandInterface {
    readonly subCommandGroups?: SubCommandGroupInterface[];
    readonly subCommands?: CommandInterface[];

    constructor(settings: {name: string, description: CommandDescription[], enabled: boolean, execute: (interaction: CommandInteraction) => Promise<void>, subCommandGroups?: SubCommandGroupInterface[], subCommands?: CommandInterface[]}) {
        super({
            name: settings.name,
            description: settings.description,
            enabled: settings.enabled,
            execute: settings.execute
        });
        this.subCommandGroups = settings.subCommandGroups;
        this.subCommands = settings.subCommands;
    }
}