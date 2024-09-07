import { error } from '@/engine/services/error';

//#region CONSTANTS
export type AudioData = {
    audioName: string,
    loop?: boolean,
    volume?: number,
};

const audioFiles: Record<string, { default: string }>
    = import.meta.glob('../../src/assets/audio/**/*.mp3', { eager: true });

const audios: HTMLAudioElement[] = [];
//#endregion

//#region HELPERS
export const getAudioPath = ({ audioName }: { audioName: string }) => {
    const audioKey = audioName.replace(/^(.*?)(\/[^/]+)?(\.[^./]+)?$/, '$1').split('_')[0];
    const audioPath = `../assets/audio/${audioKey}/${audioName}.mp3`;

    return audioFiles[audioPath].default
        ?? error({ message: `Audio ${audioName} not found`, where: getAudioPath.name });
};

export const randAudio = ({ nb }: { nb: number }) => {
    return Math.floor(Math.random() * nb) + 1;
};
//#endregion

//#region SERVICES
export const initAudios = () => {
    /* ACTIVITIES */
    createAudio({ audioName: 'activity_dialog' });
    createAudio({ audioName: 'activity_dialog_select' });
    createAudio({ audioName: 'activity_fail' });
    createAudio({ audioName: 'activity_pickup' });
    /* BUG */
    createAudio({ audioName: 'activity_bug_start' });
    createAudio({ audioName: 'activity_bug_symbol_error' });
    createAudio({ audioName: 'activity_bug_symbol_found' });
    createAudio({ audioName: 'activity_bug_win' });
    /* FISH */
    createAudio({ audioName: 'activity_fish_frenzy' });
    createAudio({ audioName: 'activity_fish_play1' });
    createAudio({ audioName: 'activity_fish_play2' });
    createAudio({ audioName: 'activity_fish_start' });
    createAudio({ audioName: 'activity_fish_win' });
    /* CRAFT */
    createAudio({ audioName: 'activity_craft_end' });
    createAudio({ audioName: 'activity_craft_play1' });
    createAudio({ audioName: 'activity_craft_play2' });
    createAudio({ audioName: 'activity_craft_play3' });
    createAudio({ audioName: 'activity_craft_play4' });
    createAudio({ audioName: 'activity_craft_play5' });
    createAudio({ audioName: 'activity_craft_play6' });
    createAudio({ audioName: 'activity_craft_start' });
    createAudio({ audioName: 'activity_craft_recipe_confirm' });
    createAudio({ audioName: 'activity_craft_recipe_fail' });
    createAudio({ audioName: 'activity_craft_recipe_select' });
    createAudio({ audioName: 'activity_craft_win' });
    /* BGM */
    createAudio({ audioName: 'bgm_map1' });
    createAudio({ audioName: 'bgm_menu' });
    /* INVENTORY */
    createAudio({ audioName: 'inventory_close' });
    createAudio({ audioName: 'inventory_open' });
    createAudio({ audioName: 'inventory_tool_active' });
    createAudio({ audioName: 'inventory_tool_empty' });
    /* MENUS */
    createAudio({ audioName: 'menu_launch_select' });
    createAudio({ audioName: 'menu_launch_start' });
    createAudio({ audioName: 'menu_settings_close' });
    createAudio({ audioName: 'menu_settings_confirm' });
    createAudio({ audioName: 'menu_settings_open' });
    createAudio({ audioName: 'menu_settings_save' });
    createAudio({ audioName: 'menu_settings_select' });
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

export const createAudio = ({ audioName }: { audioName: string }) => {
    const audio = new Audio(getAudioPath({ audioName }));
    audios.push(audio);
};

export const destroyAudio = ({ audioName }: { audioName: string }) => {
    const audio = audios.find(audio => audio.src === audioName)
        ?? error({ message: `Audio ${audioName} not found`, where: destroyAudio.name });

    audio.pause();

    audios.splice(audios.indexOf(audio), 1);
};

export const playAudio = ({ audioName, loop = false, volume = 1 }: {
    audioName: string,
    loop?: boolean,
    volume?: number
}) => {
    const audio = audios.find(audio => audio.src.includes(audioName))
        ?? error({ message: `Audio ${audioName} not found`, where: playAudio.name });

    audio.currentTime = 0;
    audio.loop = loop;
    audio.volume = volume;

    audio.play();
};

export const pauseAudio = ({ audioName }: { audioName: string }) => {
    const audio = audios.find(audio => audio.src.includes(audioName))
        ?? error({ message: `Audio ${audioName} not found`, where: playAudio.name });

    audio.pause();
};

export const stopAudio = ({ audioName }: { audioName: string }) => {
    const audio = audios.find(audio => audio.src.includes(audioName))
        ?? error({ message: `Audio ${audioName} not found`, where: playAudio.name });

    audio.pause();
    audio.currentTime = 0;
};
//#endregion
