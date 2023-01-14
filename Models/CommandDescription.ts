import {LocaleString} from 'discord-api-types/v10';
import {SlashCommandBuilder} from "discord.js";

export default class CommandDescription {
    readonly locale: LocaleString | LocaleString[];
    readonly description: string;

    constructor(settings: {locale: LocaleString | LocaleString[], description: string}) {
        this.locale = settings.locale;
        this.description = settings.description;
    }

    isLocale(locale: LocaleString): boolean {
        if (Array.isArray(this.locale)) {
            return this.locale.includes(locale)
        } else {
            return this.locale === locale
        }
    }
}