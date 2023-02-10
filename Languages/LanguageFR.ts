import Language from "./Language";

export default class LanguageFR implements Language {
    // command errors
    commandNotFound = "Commande introuvable";
    commandNotEnabled = "La commande est désactivée";
    commandNotImplemented = "La commande n'est pas implémentée";

    // System command
    reloadingConfigurations = "Rechargement de la configuration";
    configurationReloaded = "Configuration rechargée";
    settingActivity = "Changement de l'activité . . .";
    activitySet = "Activité changée";
}