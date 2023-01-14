import * as fs from "fs";
import MainCommand from "../Models/MainCommand";
import * as winston from "winston";
import {ChatInputCommandInteraction, CommandInteraction} from "discord.js";
import SubCommand from "../Models/SubCommand";
import Language from "../Languages/Language";

export default class CommandManagerAgent {
    private static _commands: MainCommand[] = [];

    static importCommands(): void {
        // Import all commands
        const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const command = require(`../Commands/${file}`).default;

            if(command instanceof MainCommand) {
                winston.debug(`Command ${command.name} imported`);
                this._commands.push(command);
            } else {
                winston.error(`Command ${command.name} not imported`);
            }
        }
    }

    static get commands(): MainCommand[] {
        return this._commands;
    }

    static async runCommand(commandInteraction: ChatInputCommandInteraction) {
        let language = Language.language(commandInteraction.locale.toString());

        let command = this.commands.find(c => c.name === commandInteraction.commandName);
        if(command) {
            if(command.enabled) {
                let subCommandName = commandInteraction.options.getSubcommand(false);

                if(subCommandName) {
                    let subCommandGroupName = commandInteraction.options.getSubcommandGroup(false);
                    let subCommand: SubCommand | undefined;

                    if(subCommandGroupName) {
                        let subCommandGroup = command.subCommandGroups?.find(c => c.name === subCommandGroupName);

                        if(subCommandGroup) {
                            if(subCommandGroup.enabled) {
                                subCommand = subCommandGroup.subCommands.find(c => c.name === subCommandName);
                            } else await commandInteraction.reply({content: language.commandNotEnabled, ephemeral: true});
                        } else await commandInteraction.reply({content: language.commandNotFound, ephemeral: true});
                    } else {
                        subCommand = command.subCommands?.find(c => c.name === subCommandName);
                    }

                    if(subCommand) {
                        if(subCommand.enabled) {
                            if(subCommand.execute) {
                                winston.debug(`Executing command ${command.name}${(subCommandGroupName) ? ' ' + subCommandGroupName : ''} ${subCommandName} by ${commandInteraction.user.tag}`);
                                await subCommand.execute(commandInteraction);
                            } else await commandInteraction.reply({content: language.commandNotImplemented, ephemeral: true});
                        } else await commandInteraction.reply({content: language.commandNotEnabled, ephemeral: true});
                    } else await commandInteraction.reply({content: language.commandNotFound, ephemeral: true});
                } else {
                    if(command.execute) {
                        winston.debug(`Executing command ${command.name} by ${commandInteraction.user.tag}`);
                        await command.execute(commandInteraction);
                    } else await commandInteraction.reply({content: language.commandNotImplemented, ephemeral: true});
                }
            } else await commandInteraction.reply({content: language.commandNotEnabled, ephemeral: true});
        } else await commandInteraction.reply({content: language.commandNotFound, ephemeral: true});
    }
}