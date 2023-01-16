import SubCommand from "./SubCommand";
import SubCommandGroup from "./SubCommandGroup";
import {CommandInteraction, SlashCommandBuilder, PermissionsBitField} from "discord.js";
import {LocaleString} from 'discord-api-types/v10';
import CommandDescription from "./CommandDescription";
import ConfigAgent from "../Agents/ConfigAgent";
import * as winston from "winston";

export default class MainCommand extends SubCommand {
    readonly adminOnly: boolean;
    readonly subCommandGroups?: SubCommandGroup[];
    readonly subCommands?: SubCommand[];

    constructor(settings: {name: string, description: CommandDescription[], enabled: boolean, execute?: (interaction: CommandInteraction) => Promise<void>, adminOnly?: boolean, subCommandGroups?: SubCommandGroup[], subCommands?: SubCommand[]}) {
        super({
            name: settings.name,
            description: settings.description,
            enabled: settings.enabled,
            execute: settings.execute
        });
        this.adminOnly = settings.adminOnly ?? false;
        this.subCommandGroups = settings.subCommandGroups;
        this.subCommands = settings.subCommands;
    }

    get slashCommandData(): SlashCommandBuilder {
        let data = new SlashCommandBuilder();

        data.setName(this.name);

        if(this.adminOnly) {
            data.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);
        }

        data.setDMPermission(false);

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

        if(this.subCommandGroups) {
            this.subCommandGroups.forEach(subCommandGroup => {
                data.addSubcommandGroup(subCommandGroup.subCommandGroupData);
            });
        }
        if(this.subCommands) {
            this.subCommands.forEach(subCommand => {
                data.addSubcommand(subCommand.slashSubCommandData);
            });
        }

        return data;
    }
}