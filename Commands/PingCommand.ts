import {CommandInteraction} from "discord.js";
import MainCommand from "../Models/MainCommand";
import LocaleText from "../Models/LocaleText";

export default new MainCommand({
    name: "ping",
    description: [
        new LocaleText({
            locale: "fr",
            text: "Afficher la latence du Bot et de l'API Discord"
        }),
        new LocaleText({
            locale: ["en-GB", "en-US"],
            text: "Display the Bot and Discord API latency"
        })
    ],
    enabled: true,
    execute: async (interaction: CommandInteraction): Promise<void> => {
        await interaction.reply({content: 'Pong !'});

        let msg = await interaction.fetchReply();
        await interaction.editReply(`Pong! 🏓\nLatence : ${Math.floor(msg.createdAt.getTime() - interaction.createdAt.getTime())}ms\nLatence API : ${Math.round(interaction.client.ws.ping)}ms`)
    }
})