import { createAudio } from './audio';
import { onInputKeyDown } from './events';
import { createLoadingMenu, createQuestsMenu, createSettingsMenu } from './templates';

//#region CONSTANTS
export const app = document.getElementById('app')!;
//#endregion

export const main = () => {
    initEvents();
    initMenus();
    initAudios();
};

const initEvents = () => {
    document.addEventListener('keydown', onInputKeyDown);
};

const initMenus = () => {
    createLoadingMenu();
    createSettingsMenu();
    createQuestsMenu();
};

const initAudios = () => {
    /* ACTIVITIES */
    createAudio({ audioName: 'activity_dialog' });
    createAudio({ audioName: 'activity_dialog_select' });
    createAudio({ audioName: 'activity_pickup' });
    createAudio({ audioName: 'activity_fail' });
    /* BUG */
    createAudio({ audioName: 'activity_bug_start' });
    createAudio({ audioName: 'activity_bug_win' });
    createAudio({ audioName: 'activity_bug_symbol_found' });
    createAudio({ audioName: 'activity_bug_symbol_error' });
    /* FISH */
    createAudio({ audioName: 'activity_fish_start' });
    createAudio({ audioName: 'activity_fish_win' });
    createAudio({ audioName: 'activity_fish_play1' });
    createAudio({ audioName: 'activity_fish_play2' });
    createAudio({ audioName: 'activity_fish_frenzy' });
    /* CRAFT */
    createAudio({ audioName: 'activity_craft_start' });
    createAudio({ audioName: 'activity_craft_end' });
    createAudio({ audioName: 'activity_craft_win' });
    createAudio({ audioName: 'activity_craft_recipe_select' });
    createAudio({ audioName: 'activity_craft_recipe_confirm' });
    createAudio({ audioName: 'activity_craft_recipe_fail' });
    createAudio({ audioName: 'activity_craft_play1' });
    createAudio({ audioName: 'activity_craft_play2' });
    createAudio({ audioName: 'activity_craft_play3' });
    createAudio({ audioName: 'activity_craft_play4' });
    createAudio({ audioName: 'activity_craft_play5' });
    createAudio({ audioName: 'activity_craft_play6' });
    /* BGM */
    createAudio({ audioName: 'bgm_map1' });
    /* INVENTORY */
    createAudio({ audioName: 'inventory_open' });
    createAudio({ audioName: 'inventory_close' });
    createAudio({ audioName: 'inventory_tool_active' });
    createAudio({ audioName: 'inventory_tool_empty' });
    /* MENUS */
    createAudio({ audioName: 'menu_settings_open' });
    createAudio({ audioName: 'menu_settings_close' });
    createAudio({ audioName: 'menu_settings_step' });
    createAudio({ audioName: 'menu_settings_confirm' });
    /* STEPS */
    createAudio({ audioName: 'step_grass1' });
    createAudio({ audioName: 'step_grass2' });
    createAudio({ audioName: 'step_grass3' });
    createAudio({ audioName: 'step_grass4' });
    createAudio({ audioName: 'step_sand1' });
    createAudio({ audioName: 'step_sand2' });
    createAudio({ audioName: 'step_sand3' });
    createAudio({ audioName: 'step_sand4' });
};
