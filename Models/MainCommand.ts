import SubCommand from "./SubCommand";
import SubCommandGroup from "./SubCommandGroup";
import {CommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import LocaleText from "./LocaleText";
import ConfigAgent from "../Agents/ConfigAgent";
import * as winston from "winston";
import {CommandOption} from "./CommandOption";

export default class MainCommand extends SubCommand {
    readonly adminOnly: boolean;
    readonly subCommandGroups?: SubCommandGroup[];
    readonly subCommands?: SubCommand[];

    constructor(settings: {name: string, localeName?: LocaleText[], description: string | LocaleText[], enabled: boolean, options?: CommandOption[], execute?: (interaction: CommandInteraction) => Promise<void>, adminOnly?: boolean, subCommandGroups?: SubCommandGroup[], subCommands?: SubCommand[]}) {
        super({
            name: settings.name,
            localeName: settings.localeName ?? [],
            description: settings.description,
            enabled: settings.enabled,
            options: settings.options,
            execute: settings.execute
        });
        this.adminOnly = settings.adminOnly ?? false;
        this.subCommandGroups = settings.subCommandGroups;
        this.subCommands = settings.subCommands;
    }

    get slashCommandData(): SlashCommandBuilder {
        let data = new SlashCommandBuilder();

        data.setName(this.name);
        LocaleText.addLocaleNameToSlashBuilder(data, this.localeName);

        LocaleText.addDescriptionToSlashBuilder(data, this.description);
        if(this.adminOnly) {
            data.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);
        }

        data.setDMPermission(false);

        if(data.description === undefined) {
            winston.error(`Command ${this.name} has no description for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
            throw new Error(`No description found for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
        }

        this.options.forEach(option => {
            option.addSlashOptionToBuilder(data);
        });

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