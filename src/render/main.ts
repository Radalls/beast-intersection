import { initAudios } from './audio';
import { onInputKeyDown } from './events';
import { createLaunchMenu, createLoadingMenu, createQuestsMenu, createSettingsMenu } from './templates';

//#region CONSTANTS
export const app = document.getElementById('app')!;
//#endregion

export const main = () => {
    launch();
};

export const run = () => {
    initGameMenus();
};

const launch = () => {
    initEvents();
    initLaunchMenus();
    initAudios();
};

const initEvents = () => {
    document.addEventListener('keydown', onInputKeyDown);
};

const initLaunchMenus = () => {
    createLoadingMenu();
    createLaunchMenu();
    createSettingsMenu();
};

const initGameMenus = () => {
    createQuestsMenu();
};

