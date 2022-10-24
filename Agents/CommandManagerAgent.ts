import * as fs from "fs";
import MainCommand from "../Models/MainCommand";
import * as winston from "winston";
import {CommandInteraction} from "discord.js";

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

    static runCommand(commandInteraction: CommandInteraction): void {
        winston.debug(`Command ${commandInteraction.commandName} received`);
        let command = this.commands.find(c => c.name === commandInteraction.commandName);

        if(command != undefined) {
            if(command.execute) {
                command.execute(commandInteraction).then(r => {
                    winston.debug(`Command ${commandInteraction.commandName} executed`);
                }).catch(e => {
                    winston.error(e);
                });
            }
        }
    }
}