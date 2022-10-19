import {LocaleString} from 'discord-api-types/v10';

export default class CommandDescription {
    readonly locale: LocaleString | LocaleString[];
    readonly description: string;

    constructor(settings: {locale: LocaleString | LocaleString[], description: string}) {
        this.locale = settings.locale;
        this.description = settings.description;
    }
}