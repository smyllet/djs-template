import {CommandInteraction} from "discord.js";
import MainCommand from "../Models/MainCommand";
import CommandDescription from "../Models/CommandDescription";

export default new MainCommand({
    name: "ping",
    description: [
        new CommandDescription({
            locale: "fr",
            description: "Afficher la latence du Bot et de l'API Discord"
        }),
        new CommandDescription({
            locale: ["en-GB", "en-US"],
            description: "Display the Bot and Discord API latency"
        })
    ],
    enabled: true,
    execute: async (interaction: CommandInteraction): Promise<void> => {
        await interaction.reply({content: 'Pong !'});

        let msg = await interaction.fetchReply();
        await interaction.editReply(`Pong! 🏓\nLatence : ${Math.floor(msg.createdAt.getTime() - interaction.createdAt.getTime())}ms\nLatence API : ${Math.round(interaction.client.ws.ping)}ms`)
    }
})