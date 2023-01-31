import * as fs from "fs";
import * as winston from "winston";
import * as yaml from "yaml";
import * as dotenv from "dotenv";

export default class ConfigAgent {
    private static config: {
        discord: {
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
        winston.info("Loading configuration...");

        /* Checking environment variables */
        let envValid = true;

        dotenv.config();
        if (!process.env.DISCORD_TOKEN) {
            winston.error("Missing DISCORD_TOKEN environment variable");
            envValid = false;
        }

        if(!envValid) {
            winston.error('Missing environment variables, please add on execution or in a .env file');
            process.exit(1);
        }

        winston.debug("Environment variables checked");

        /* creating config.yml if it doesn't exist */
        if(!fs.existsSync('./config.yml')) {
            winston.info("Creating config.yml...");
            fs.writeFileSync('./config.yml', yaml.stringify({
                discord: {
                    activity: {
                        name: "with your feelings",
                        type: 0
                    }
                },
                commands: {
                    defaultLocale: "en-GB"
                }
            }));
            winston.warn("config.yml created, please fill it with your own values and restart the bot");
            process.exit(1);
        }

        /* Loading configuration file */
        let confValid = true;

        let yamlConf = yaml.parse(fs.readFileSync('config.yml', 'utf8'))
        if(!yamlConf) {
            winston.error('Error while parsing config.yml');
            confValid = false;
        } else {
            if(!yamlConf.discord?.activity?.name) {
                winston.error('No activity name found in config.yml (discord.activity.name)');
                confValid = false;
            }
            if(yamlConf.discord?.activity?.type === null || yamlConf.discord?.activity?.type === undefined) {
                winston.error('No activity type found in config.yml (discord.activity.type)');
                confValid = false;
            }
            if(!yamlConf.commands?.defaultLocale) {
                winston.error('No default locale found in config.yml (commands.defaultLocale)');
                confValid = false;
            }
        }

        if(!confValid) {
            winston.error('Please fix the errors in config.yml and restart the application.');
            process.exit(1);
        }

        winston.debug("Configuration file checked");

        // set config
        this.config = {
            discord: {
                activity: {
                    name: yamlConf.discord.activity.name,
                    type: yamlConf.discord.activity.type
                }
            },
            commands: {
                defaultLocale: yamlConf.commands.defaultLocale,
            }
        };

        winston.info('Config loaded');
    }

    static getConfig() {
        return this.config;
    }

    private static editConfig(fn: (config: any) => any) {
        let yamlConf = yaml.parse(fs.readFileSync('config.yml', 'utf8'))
        if(!yamlConf) {
            winston.error('Error while parsing config.yml');
        } else {
            let newConfig = fn(yamlConf);
            fs.writeFileSync('./config.yml', yaml.stringify(newConfig));
            this.loadConfig();
        }
    }

    static setActivity(name: string, type: number) {
        this.editConfig((config) => {
            config.discord.activity.name = name;
            config.discord.activity.type = type;
            return config;
        });
    }
}