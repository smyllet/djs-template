import LanguageFR from "./LanguageFR";
import LanguageEN from "./LanguageEN";
import ConfigAgent from "../Agents/ConfigAgent";

export default abstract class Language {
    static language(langCode: string) : Language {
        langCode = langCode.toUpperCase();
        if(!["FR", "EN-GB", "EN-US"].includes(langCode)) langCode = ConfigAgent.getConfig().commands.defaultLocale.toUpperCase();

        switch(langCode) {
            case "FR":
                return new LanguageFR();
            case "EN-GB":
                return new LanguageEN();
            case "EN-US":
                return new LanguageEN();
            default:
                return new LanguageEN();
        }
    }

    // command errors
    abstract readonly commandNotFound: string;
    abstract readonly commandNotEnabled: string;
    abstract readonly commandNotImplemented: string;
}