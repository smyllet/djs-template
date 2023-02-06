import LocaleText from "./LocaleText";
import {AutocompleteInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder} from "discord.js";
import {APIApplicationCommandOptionChoice} from "discord-api-types/v10";
import ConfigAgent from "../Agents/ConfigAgent";
import * as winston from "winston";

export interface CommandOption {
    name: string | LocaleText[];
    description: string | LocaleText[];
    required: boolean;

    addSlashOptionToBuilder(builder: SlashCommandBuilder|SlashCommandSubcommandBuilder): void;
}

export class StringCommandOption implements CommandOption {
    name: string | LocaleText[];
    description: string | LocaleText[];
    required: boolean;
    minLength?: number;
    maxLength?: number;
    choices?: {name: string | LocaleText[], value: string}[];
    autocomplete?: (interaction: AutocompleteInteraction) => void;
    constructor(settings: {name: string | LocaleText[], description: string | LocaleText[], required: boolean, minLength?: number, maxLength?: number, choices?: {name: string | LocaleText[], value: string}[], autocomplete?: (interaction: AutocompleteInteraction) => void}) {
        this.name = settings.name;
        this.description = settings.description;
        this.required = settings.required;
        this.minLength = settings.minLength;
        this.maxLength = settings.maxLength;
        this.choices = settings.choices;
        this.autocomplete = settings.autocomplete;
    }

    addSlashOptionToBuilder(builder: SlashCommandBuilder|SlashCommandSubcommandBuilder): void {
        builder.addStringOption(option => {
            LocaleText.addNameToSlashBuilder(option, this.name);
            if(option.name === undefined) {
                winston.error(`Option ${this.name} of ${builder.name} has no name for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
                throw new Error(`No description found for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
            }
            LocaleText.addDescriptionToSlashBuilder(option, this.description);
            if(option.description === undefined) {
                winston.error(`Option ${this.name} of ${builder.name} has no description for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
                throw new Error(`No description found for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
            }

            option.setRequired(this.required);

            if(this.minLength) {
                option.setMinLength(this.minLength);
            }
            if(this.maxLength) {
                option.setMaxLength(this.maxLength);
            }

            let c = this.choices?.map(choice => {
                let choiceObject: APIApplicationCommandOptionChoice<string>;

                choiceObject = {
                    name: "",
                    value: choice.value
                }

                LocaleText.addNameToOptionChoice(choiceObject, choice.name);
                if(choiceObject.name === "") {
                    winston.error(`Choice ${choice.name} of option ${this.name} of ${builder.name} has no name for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
                    throw new Error(`No description found for locale ${ConfigAgent.getConfig().commands.defaultLocale}`);
                }

                return choiceObject;
            });
            if(c) option.setChoices(...c);

            if(this.autocomplete) option.setAutocomplete(true);

            return option;
        })
    }
}