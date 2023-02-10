import {APIApplicationCommandOptionChoice, LocaleString} from 'discord-api-types/v10';
import {SharedNameAndDescription} from "discord.js";
import ConfigAgent from "../Agents/ConfigAgent";

export default class LocaleText {
    readonly locale: LocaleString | LocaleString[];
    readonly text: string;

    constructor(settings: {locale: LocaleString | LocaleString[], text: string}) {
        this.locale = settings.locale;
        this.text = settings.text;
    }

    isLocale(locale: LocaleString): boolean {
        if (Array.isArray(this.locale)) {
            return this.locale.includes(locale)
        } else {
            return this.locale === locale
        }
    }

    static addLocaleNameToSlashBuilder(builder: SharedNameAndDescription, name: LocaleText[]) {
        name.forEach(n => {
            if(n.locale instanceof Array) {
                n.locale.forEach(l => {
                    builder.setNameLocalization(l, n.text);
                });
            } else {
                builder.setNameLocalization(n.locale, n.text);
            }
        });
    }

    static addDescriptionToSlashBuilder(builder: SharedNameAndDescription, description: LocaleText[] | string) {
        if(description instanceof Array) {
            description.forEach(d => {
                if(d.isLocale(ConfigAgent.getConfig().commands.defaultLocale as LocaleString)) {
                    builder.setDescription(d.text);
                }
                if(d.locale instanceof Array) {
                    d.locale.forEach(l => {
                        builder.setDescriptionLocalization(l, d.text);
                    });
                } else {
                    builder.setDescriptionLocalization(d.locale, d.text);
                }
            });
        } else {
            builder.setDescription(description);
        }
    }

    static addLocaleNameToOptionChoice(choice: APIApplicationCommandOptionChoice, name: LocaleText[]) {
        choice.name_localizations = {};
        name.forEach(n => {
            if(n.locale instanceof Array) {
                n.locale.forEach(l => {
                    choice.name_localizations![l] = n.text;
                });
            } else {
                choice.name_localizations![n.locale] = n.text
            }
        });
    }
}