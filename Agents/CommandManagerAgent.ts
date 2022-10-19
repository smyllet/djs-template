import * as fs from "fs";
import MainCommand from "../Models/MainCommand";
import * as winston from "winston";

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
}