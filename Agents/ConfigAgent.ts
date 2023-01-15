import * as fs from "fs";
import * as winston from "winston";

export default class ConfigAgent {
    private static config: {
        discord: {
            token: string;
            activity: {
                name: string;
                type: number;
            };
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
                + '\nDISCORD_ACTIVITY=YOUR_ACTIVITY_HERE'
                + '\nDISCORD_ACTIVITY_TYPE=YOUR_ACTIVITY_TYPE_HERE'
                + '\nCOMMAND_DEFAULT_LOCALE=en-GB'
            );
            console.log('Please fill the .env file and restart the application.');
            process.exit(0);
        }

        fs.readFileSync('.env', 'utf8').split(/\r?\n/).forEach((line) => {
            if(line.startsWith('#') || line === '') return;
            let split = line.split('=');
            let key = split[0].trim();
            process.env[key] = split[1].split('#')[0].trim();
        });

        // check if all required env variables are set
        if (!process.env.DISCORD_TOKEN) {
            throw new Error('DISCORD_TOKEN not set');
        } else if (!process.env.DISCORD_ACTIVITY) {
            throw new Error('DISCORD_ACTIVITY not set');
        } else if (!process.env.DISCORD_ACTIVITY_TYPE) {
            throw new Error('DISCORD_ACTIVITY_TYPE not set');
        } else if (!process.env.COMMAND_DEFAULT_LOCALE) {
            throw new Error('COMMAND_DEFAULT_LOCALE not set');
        }


        // set config
        this.config = {
            discord: {
                token: process.env.DISCORD_TOKEN,
                activity: {
                    name: process.env.DISCORD_ACTIVITY,
                    type: parseInt(process.env.DISCORD_ACTIVITY_TYPE)
                }
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