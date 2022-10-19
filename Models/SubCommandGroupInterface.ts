import Command from "./Command";
import CommandDescription from "./CommandDescription";

export default class SubCommandGroupInterface {
    readonly name: string;
    readonly description: CommandDescription[];
    readonly enabled: boolean;
    readonly subCommands: Command[];

    constructor(settings: { name: string, description: CommandDescription[], enabled: boolean, subCommands: Command[] }) {
        this.name = settings.name;
        this.description = settings.description;
        this.enabled = settings.enabled;
        this.subCommands = settings.subCommands;
    }
}