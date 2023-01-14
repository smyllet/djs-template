import Language from "./Language";

export default class LanguageFR implements Language {
    // command errors
    commandNotFound = "Commande introuvable";
    commandNotEnabled = "La commande est désactivée";
    commandNotImplemented = "La commande n'est pas implémentée";
}