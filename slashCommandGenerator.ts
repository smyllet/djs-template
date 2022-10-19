// Chargement des modules
import {SlashCommandBuilder, REST, Routes} from "discord.js";
import CommandManagerAgent from "./Agents/CommandManagerAgent";
import * as winston from "winston";

// Chargement des Agents
import ConfigAgent from "./Agents/ConfigAgent";

// Chargement et configuration du logger
winston.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => `\x1b[37m[${new Date(info.timestamp).toLocaleString('fr-FR')}]\x1b[0m [${info.level}] : ${info.message}`)
    )
}));

winston.info('Starting génération of slash commands ...');

// Chargement de la configuration
ConfigAgent.loadConfig();
let config = ConfigAgent.getConfig();

// Login to Discord
const discordRest = new REST({version: '10'}).setToken(config.discord.token);

let slashCommandsData: SlashCommandBuilder[] = [];
CommandManagerAgent.importCommands();
CommandManagerAgent.commands.forEach(command => {
    const data = new SlashCommandBuilder()
        .setName(command.name);

    command.description.forEach(description => {
        if(description.locale instanceof Array) {
            description.locale.forEach(locale => {
                data.setDescriptionLocalization(locale, description.description);
                if(locale === config.commands.defaultLocale) {
                    data.setDescription(description.description);
                }
            });
        } else {
            data.setDescriptionLocalization(description.locale, description.description);
            if(description.locale === config.commands.defaultLocale) {
                data.setDescription(description.description);
            }
        }
    });

    if(data.description == undefined) winston.error('Command ' + command.name + ' : description pour la langue par défaut (' + config.commands.defaultLocale + ') non trouvée');
    else {
        slashCommandsData.push(data);
        winston.debug(`Command ${command.name} ajoutée`);
    }
})

discordRest.get(Routes.user()).then((user: any) => {
    discordRest.put(Routes.applicationCommands(user.id), {body: slashCommandsData.map(c => c.toJSON())}).then(() => {
        winston.info('Slash commands generated');
    }).catch((error) => {
        winston.error(error);
    })
})

