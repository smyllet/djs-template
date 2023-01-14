import {CommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import CommandDescription from "./CommandDescription";
import ConfigAgent from "../Agents/ConfigAgent";
import {LocaleString} from 'discord-api-types/v10';
import * as winston from "winston";

export default class SubCommand {
    readonly name: string;
    readonly description: CommandDescription[];
    readonly enabled: boolean;
    readonly execute?: (interaction: CommandInteraction) => Promise<void>;

    constructor(settings: {name: string, description: CommandDescription[], enabled: boolean, execute?: (interaction: CommandInteraction) => Promise<void>}) {
        this.name = settings.name;
        this.description = settings.description;
        this.enabled = settings.enabled;
        this.execute = settings.execute;
    }

    get slashSubCommandData(): SlashCommandSubcommandBuilder {
        let data = new SlashCommandSubcommandBuilder();

        data.setName(this.name);

        this.description.forEach(d => {
            if(d.isLocale(ConfigAgent.getConfig().commands.defaultLocale as LocaleString)) {
                data.setDescription(d.description);
            }
            if(d.locale instanceof Array) {
                d.locale.forEach(l => {
                    data.setDescriptionLocalization(l, d.description);
                });
            } else {
                data.setDescriptionLocalization(d.locale, d.description);
            }
        })

        if(data.description === undefined) {
            winston.error(`Command ${this.name} has no description for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
            throw new Error(`No description found for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
        }

        return data
    }
}
