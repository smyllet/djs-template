// Chargement des modules
import {SlashCommandBuilder, REST, Routes, RouteLike} from "discord.js";
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

winston.info('Starting removing of slash commands ...');

// Chargement de la configuration
ConfigAgent.loadConfig();
let config = ConfigAgent.getConfig();

// Login to Discord
const discordRest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN!);

discordRest.get(Routes.user()).then((user: any) => {
    discordRest.get(Routes.applicationCommands(user.id))
        .then((data: any) => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationCommands(user.id)}/${command.id}`;
                promises.push(discordRest.delete(<RouteLike>deleteUrl));
            }
            return Promise.all(promises);
        });
})

