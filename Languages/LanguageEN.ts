import Language from "./Language";

export default class LanguageEN implements Language {
    // command errors
    commandNotFound = "Command not found";
    commandNotEnabled = "Command is disabled";
    commandNotImplemented = "Command is not implemented";

    // System command
    reloadingConfigurations = "Reloading configurations";
    configurationReloaded = "Configurations reloaded";
    settingActivity = "Setting activity . . .";
    activitySet = "Activity set";
}