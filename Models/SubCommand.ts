import {CommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import LocaleText from "./LocaleText";
import ConfigAgent from "../Agents/ConfigAgent";
import * as winston from "winston";
import {CommandOption} from "./CommandOption";

export default class SubCommand {
    readonly name: string | LocaleText[];
    readonly description: string | LocaleText[];
    readonly enabled: boolean;
    readonly options: CommandOption[];
    readonly execute?: (interaction: CommandInteraction) => Promise<void>;

    constructor(settings: {name: string | LocaleText[], description: string | LocaleText[], enabled: boolean, options?: CommandOption[], execute?: (interaction: CommandInteraction) => Promise<void>}) {
        this.name = settings.name;
        this.description = settings.description;
        this.enabled = settings.enabled;
        this.options = settings.options ?? [];
        this.execute = settings.execute;
    }

    get slashSubCommandData(): SlashCommandSubcommandBuilder {
        let data = new SlashCommandSubcommandBuilder();

        LocaleText.addNameToSlashBuilder(data, this.name);
        if(data.name === undefined) {
            winston.error(`Command ${this.name} has no name for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
            throw new Error(`No description found for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
        }
        LocaleText.addDescriptionToSlashBuilder(data, this.description);
        if(data.description === undefined) {
            winston.error(`Command ${this.name} has no description for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
            throw new Error(`No description found for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
        }

        this.options.forEach(option => {
            option.addSlashOptionToBuilder(data);
        });

        return data
    }
}
