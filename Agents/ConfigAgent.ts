import * as dotenv from 'dotenv';
import * as fs from "fs";
import * as winston from "winston";

export default class ConfigAgent {
    private static config: {
        discord: {
            token: string;
        },
        commands: {
            defaultLocale: string;
        }
    };

    static loadConfig() {
        // Create .env file if not exists
        if(!fs.existsSync('.env')) {
            fs.writeFileSync('.env',
                '# Configuration de l\'application'
                + '\nDISCORD_TOKEN=YOUR_TOKEN_HERE'
                + '\nCOMMAND_DEFAULT_LOCALE=en-US'
            );
            console.log('Please fill the .env file and restart the application.');
            process.exit(0);
        }

        dotenv.config();

        // check if all required env variables are set
        if (!process.env.DISCORD_TOKEN) {
            throw new Error('DISCORD_TOKEN not set');
        } else if (!process.env.COMMAND_DEFAULT_LOCALE) {
            throw new Error('COMMAND_DEFAULT_LOCALE not set');
        }


        // set config
        this.config = {
            discord: {
                token: process.env.DISCORD_TOKEN,
            },
            commands: {
                defaultLocale: process.env.COMMAND_DEFAULT_LOCALE,
            }
        };

        winston.info('Config loaded');
    }

    static getConfig() {
        return this.config;
    }
}