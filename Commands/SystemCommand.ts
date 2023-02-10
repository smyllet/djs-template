import {ActivityType, CommandInteraction} from "discord.js";
import MainCommand from "../Models/MainCommand";
import LocaleText from "../Models/LocaleText";
import SubCommandGroup from "../Models/SubCommandGroup";
import SubCommand from "../Models/SubCommand";
import ConfigAgent from "../Agents/ConfigAgent";
import {StringCommandOption} from "../Models/CommandOption";
import Language from "../Languages/Language";

export default new MainCommand({
    name: "system",
    description: [
        new LocaleText({
            locale: "fr",
            text: "Gérer les fonctionnalités du bot"
        }),
        new LocaleText({
            locale: ["en-GB", "en-US"],
            text: "Manage the bot's features"
        })
    ],
    enabled: true,
    adminOnly: true,
    subCommandGroups: [
        new SubCommandGroup({
            name: "config",
            description: [
                new LocaleText({
                    locale: "fr",
                    text: "Gérer la configuration du bot"
                }),
                new LocaleText({
                    locale: ["en-GB", "en-US"],
                    text: "Manage the bot's configuration"
                })
            ],
            enabled: true,
            subCommands: [
                new SubCommand({
                    name: "reload",
                    description: [
                        new LocaleText({
                            locale: "fr",
                            text: "Recharger la configuration du bot"
                        }),
                        new LocaleText({
                            locale: ["en-GB", "en-US"],
                            text: "Reload the bot's configuration"
                        })
                    ],
                    enabled: true,
                    execute: async (interaction: CommandInteraction) => {
                        let language = Language.language(interaction.locale.toString());
                        await interaction.reply({content: language.reloadingConfigurations, ephemeral: true});

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

                        await interaction.editReply({content: language.configurationReloaded});
                    }
                })
            ]
        }),
        new SubCommandGroup({
            name: "activity",
            description: [
                new LocaleText({
                    locale: "fr",
                    text: "Gérer l'activité du bot"
                }),
                new LocaleText({
                    locale: ["en-GB", "en-US"],
                    text: "Manage the bot's activity"
                })
            ],
            enabled: true,
            subCommands: [
                new SubCommand({
                    name: "set",
                    description: [
                        new LocaleText({
                            locale: "fr",
                            text: "Définir l'activité du bot"
                        }),
                        new LocaleText({
                            locale: ["en-GB", "en-US"],
                            text: "Set the bot's activity"
                        })
                    ],
                    enabled: true,
                    options: [
                        new StringCommandOption({
                            name: "type",
                            description: [
                                new LocaleText({
                                    locale: "fr",
                                    text: "Le type de l'activité"
                                }),
                                new LocaleText({
                                    locale: ["en-GB", "en-US"],
                                    text: "The activity's type"
                                })
                            ],
                            required: true,
                            choices: [
                                {
                                    name: "Playing",
                                    localName: [
                                        new LocaleText({
                                            locale: "fr",
                                            text: "Joue"
                                        }),
                                        new LocaleText({
                                            locale: ["en-GB", "en-US"],
                                            text: "Playing"
                                        })
                                    ],
                                    value: "PLAYING"
                                },
                                {
                                    name: "Watching",
                                    localName: [
                                        new LocaleText({
                                            locale: "fr",
                                            text: "Regarde"
                                        }),
                                        new LocaleText({
                                            locale: ["en-GB", "en-US"],
                                            text: "Watching"
                                        })
                                    ],
                                    value: "WATCHING"
                                },
                                {
                                    name: "Listening",
                                    localName: [
                                        new LocaleText({
                                            locale: "fr",
                                            text: "Écoute"
                                        }),
                                        new LocaleText({
                                            locale: ["en-GB", "en-US"],
                                            text: "Listening"
                                        })
                                    ],
                                    value: "LISTENING"
                                },
                                {
                                    name: "Competing",
                                    localName: [
                                        new LocaleText({
                                            locale: "fr",
                                            text: "Participe"
                                        }),
                                        new LocaleText({
                                            locale: ["en-GB", "en-US"],
                                            text: "Competing"
                                        })
                                    ],
                                    value: "COMPETING"
                                }
                            ]
                        }),
                        new StringCommandOption({
                            name: "name",
                            description: [
                                new LocaleText({
                                    locale: "fr",
                                    text: "Le nom de l'activité"
                                }),
                                new LocaleText({
                                    locale: ["en-GB", "en-US"],
                                    text: "The activity's name"
                                })
                            ],
                            required: true,
                        })
                    ],
                    execute: async (interaction: CommandInteraction) => {
                        let language = Language.language(interaction.locale.toString());
                        await interaction.reply({content: language.settingActivity, ephemeral: true});

                        let activityName = interaction.options.get("name")!.value as string;
                        let activityType = interaction.options.get("type")!.value as string;
                        let activityTypeNumber = 0;

                        switch (activityType) {
                            case "PLAYING":
                                activityTypeNumber = ActivityType.Playing;
                                break;
                            case "WATCHING":
                                activityTypeNumber = ActivityType.Watching;
                                break;
                            case "LISTENING":
                                activityTypeNumber = ActivityType.Listening;
                                break;
                            case "COMPETING":
                                activityTypeNumber = ActivityType.Competing;
                                break;
                        }

                        ConfigAgent.setActivity(activityName, activityTypeNumber);

                        // change client status
                        interaction.client.user.setPresence({
                            activities: [
                                {
                                    name: ConfigAgent.getConfig().discord.activity.name,
                                    type: ConfigAgent.getConfig().discord.activity.type
                                }
                            ],
                        });

                        await interaction.editReply({content: language.activitySet});
                    }
                })
            ]
        })
    ]
})