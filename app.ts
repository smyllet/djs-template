// Chargement des modules
import * as Discord from 'discord.js';
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

// Chargement de la configuration
ConfigAgent.loadConfig();

// Création du client Discord
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildVoiceStates
    ],
});

// Lorsque le client est prêt
client.on('ready', () => {
    winston.info(`Logged in as ${client.user!.tag} on ${client.guilds.cache.size} servers : ${client.guilds.cache.map(g => g.name).join(', ')}`);
});

// Connexion au client Discord
client.login(ConfigAgent.getConfig().discord.token).then(() => {winston.info('Logged in on Discord')});