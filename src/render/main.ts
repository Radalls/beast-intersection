import { initAudios } from './audio';
import { onInputKeyDown } from './events';
import {
    createError,
    createFrame,
    createLaunchMenu,
    createLoading,
    createQuestMenu,
    createSettingsMenu,
} from './templates';

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
    createFrame();
    createLoading();
    createError();

    initEvents();
    initMenus();
    initAudios();
};

const initEvents = () => {
    document.addEventListener('keydown', onInputKeyDown);
};

const initMenus = () => {
    createLaunchMenu();
    createSettingsMenu();
};

const initGameMenus = () => {
    createQuestMenu();
};

