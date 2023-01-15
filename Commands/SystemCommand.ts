import {CommandInteraction} from "discord.js";
import MainCommand from "../Models/MainCommand";
import CommandDescription from "../Models/CommandDescription";
import SubCommandGroup from "../Models/SubCommandGroup";
import SubCommand from "../Models/SubCommand";
import ConfigAgent from "../Agents/ConfigAgent";

export default new MainCommand({
    name: "system",
    description: [
        new CommandDescription({
            locale: "fr",
            description: "Gérer les fonctionnalités du bot"
        }),
        new CommandDescription({
            locale: ["en-GB", "en-US"],
            description: "Manage the bot's features"
        })
    ],
    enabled: true,
    adminOnly: true,
    subCommandGroups: [
        new SubCommandGroup({
            name: "config",
            description: [
                new CommandDescription({
                    locale: "fr",
                    description: "Gérer la configuration du bot"
                }),
                new CommandDescription({
                    locale: ["en-GB", "en-US"],
                    description: "Manage the bot's configuration"
                })
            ],
            enabled: true,
            subCommands: [
                new SubCommand({
                    name: "reload",
                    description: [
                        new CommandDescription({
                            locale: "fr",
                            description: "Recharger la configuration du bot"
                        }),
                        new CommandDescription({
                            locale: ["en-GB", "en-US"],
                            description: "Reload the bot's configuration"
                        })
                    ],
                    enabled: true,
                    execute: async (interaction: CommandInteraction) => {
                        await interaction.reply({content: "Reloading configuration...", ephemeral: true});

                        ConfigAgent.loadConfig();

                        // change client status
                        interaction.client.user.setPresence({
                            activities: [
                                {
                                    name: ConfigAgent.getConfig().discord.activity.name,
                                    type: ConfigAgent.getConfig().discord.activity.type
                                }
                            ],
                        });

                        await interaction.editReply({content: "Configuration reloaded"});
                    }
                })
            ]
        })
    ]
})