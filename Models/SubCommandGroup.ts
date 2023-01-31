import SubCommand from "./SubCommand";
import {LocaleString} from 'discord-api-types/v10';
import LocaleText from "./LocaleText";
import {SlashCommandSubcommandGroupBuilder} from "discord.js";
import ConfigAgent from "../Agents/ConfigAgent";
import * as winston from "winston";

export default class SubCommandGroup {
    readonly name: string;
    readonly description: LocaleText[];
    readonly enabled: boolean;
    readonly subCommands: SubCommand[];

    constructor(settings: { name: string, description: LocaleText[], enabled: boolean, subCommands: SubCommand[] }) {
        this.name = settings.name;
        this.description = settings.description;
        this.enabled = settings.enabled;
        this.subCommands = settings.subCommands;
    }

    get subCommandGroupData(): SlashCommandSubcommandGroupBuilder {
        let data = new SlashCommandSubcommandGroupBuilder();

        data.setName(this.name);
        this.description.forEach(d => {
            if(d.isLocale(ConfigAgent.getConfig().commands.defaultLocale as LocaleString)) {
                data.setDescription(d.text);
            }
            if(d.locale instanceof Array) {
                d.locale.forEach(l => {
                    data.setDescriptionLocalization(l, d.text);
                });
            } else {
                data.setDescriptionLocalization(d.locale, d.text);
            }
        })
        this.subCommands.forEach(subCommand => {
            data.addSubcommand(subCommand.slashSubCommandData);
        });

        if(data.description === undefined) {
            winston.error(`Command ${this.name} has no description for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
            throw new Error(`No description found for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
        }

        return data;
    }
}