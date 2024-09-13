import { createSave, loadSave } from './manager.data';
import {
    displaySecretPath,
    isSecretPathUnlocked,
    isSecretSaveUnlocked,
    isSecretUnlocked,
    launchQuitSecret,
    launchStartSecret,
    lockSettingsSecret,
    runSecretSave,
} from './manager.secret';
import { LAUNCH_OPTIONS, SETTINGS, editSettingAudio, editSettingKey, getProjectVersion } from './manager.utils';

import { destroyAllEntities, getComponent } from '@/engine/entities';
import { launch, run } from '@/engine/main';
import { stopCycle } from '@/engine/services/cycle';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getState, setState } from '@/engine/services/state';
import { getStore, resetStore } from '@/engine/services/store';
import { event } from '@/render/events';

//#region SYSTEMS
//#region LAUNCH
export const selectLaunchOption = ({ managerEntityId, offset }: {
    managerEntityId?: string | null,
    offset: 1 | -1,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: selectLaunchOption.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (offset === -1) {
        manager._selectedLaunchOption = Math.max(0, manager._selectedLaunchOption - 1);
    }
    else if (offset === 1) {
        manager._selectedLaunchOption = Math.min(
            LAUNCH_OPTIONS.length - 1,
            manager._selectedLaunchOption + 1,
        );
    }

    event({ type: EventTypes.MENU_LAUNCH_UPDATE });
    event({ data: { audioName: 'main_select' }, type: EventTypes.AUDIO_PLAY });
};

export const confirmLaunchOption = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmLaunchOption.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (LAUNCH_OPTIONS[manager._selectedLaunchOption] === LAUNCH_OPTIONS[0]) {
        if (isSecretUnlocked()) {
            launchStartSecret();
            return;
        }
        if (isSecretPathUnlocked()) {
            displaySecretPath();
        }

        setState('isGameLaunching', false);

        event({ type: EventTypes.MAIN_RUN });

        run({});

        event({ type: EventTypes.QUEST_DISPLAY });
        event({ data: { audioName: 'menu_launch_start' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { audioName: 'bgm_map1', loop: true }, type: EventTypes.AUDIO_PLAY });
        event({ data: { audioName: 'bgm_menu' }, type: EventTypes.AUDIO_STOP });

        return;
    }
    else if (LAUNCH_OPTIONS[manager._selectedLaunchOption] === LAUNCH_OPTIONS[1]) {
        loadSave().then((saveData) => {
            if (saveData.version !== getProjectVersion()) {
                event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
                event({
                    data: { message: 'Invalid save, project version does not match' },
                    type: EventTypes.MAIN_ERROR,
                });

                throw error({
                    message: 'Invalid save, project version does not match',
                    where: confirmLaunchOption.name,
                });
            }

            setState('isGameLaunching', false);
            if (isSecretSaveUnlocked()) {
                runSecretSave({ entityId: managerEntityId, saveData });
                return;
            }

            event({ type: EventTypes.MAIN_RUN });

            run({ saveData });

            event({ type: EventTypes.MENU_LAUNCH_DISPLAY });
            event({ type: EventTypes.QUEST_DISPLAY });
            event({ data: { audioName: 'menu_launch_start' }, type: EventTypes.AUDIO_PLAY });
            event({ data: { audioName: 'bgm_map1', loop: true }, type: EventTypes.AUDIO_PLAY });
            event({ data: { audioName: 'bgm_menu' }, type: EventTypes.AUDIO_STOP });

            return;
        });

        return;
    }
    else if (LAUNCH_OPTIONS[manager._selectedLaunchOption] === LAUNCH_OPTIONS[2]) {
        openSettings({});
    }
};

export const quitToLaunch = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: openSettings.name });

    setState('isGameLaunching', true);
    setState('isInputCooldown', false);

    closeSettings();

    destroyAllEntities({ force: true });
    stopCycle();
    resetStore();

    launch();

    if (isSecretUnlocked()) {
        launchQuitSecret();
        return;
    }

    event({ data: { audioName: 'bgm_map1' }, type: EventTypes.AUDIO_STOP });
    event({ data: { audioName: 'bgm_menu', loop: true }, type: EventTypes.AUDIO_PLAY });
};

export const onLaunchInput = ({ inputKey }: { inputKey: string }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: onSettingsInput.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (inputKey === manager.settings.keys.move._up) {
        selectLaunchOption({ managerEntityId, offset: -1 });
        return;
    }
    else if (inputKey === manager.settings.keys.move._down) {
        selectLaunchOption({ managerEntityId, offset: 1 });
        return;
    }
    else if (inputKey === manager.settings.keys.action._act) {
        confirmLaunchOption({ managerEntityId });
        return;
    }
};
//#endregion

//#region SETTINGS
export const openSettings = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: openSettings.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    manager._selectedSetting = 0;

    if (isSecretUnlocked()) {
        lockSettingsSecret();
        return;
    }
    if (isSecretPathUnlocked()) {
        displaySecretPath();
    }

    setState('isGamePaused', true);
    if (getState('isGameRunning')) {
        setState('isGameRunning', false);

        const playerEntityId = getStore('playerId')
            ?? error({ message: 'Store playerId is undefined', where: openSettings.name });

        event({ entityId: playerEntityId, type: EventTypes.ENERGY_DISPLAY });
        event({ entityId: playerEntityId, type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY });
        event({ type: EventTypes.QUEST_DISPLAY });
    }

    event({ type: EventTypes.MENU_SETTINGS_DISPLAY });
    event({ type: EventTypes.MENU_SETTINGS_UPDATE });
    event({ data: { audioName: 'menu_settings_open' }, type: EventTypes.AUDIO_PLAY });
};

export const closeSettings = () => {
    if (isSecretUnlocked()) {
        if (getState('isGameRunning')) {
            setState('isGameRunning', false);
            return;
        }
    }
    if (isSecretPathUnlocked()) {
        displaySecretPath();
    }

    setState('isGamePaused', false);
    if (!(getState('isGameRunning')) && !(getState('isGameLaunching'))) {
        setState('isGameRunning', true);

        const playerEntityId = getStore('playerId')
            ?? error({ message: 'Store playerId is undefined', where: closeSettings.name });
        event({ entityId: playerEntityId, type: EventTypes.ENERGY_DISPLAY });
        event({ entityId: playerEntityId, type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY });
        event({ type: EventTypes.QUEST_DISPLAY });
    }

    event({ type: EventTypes.MENU_SETTINGS_DISPLAY });
    event({ data: { audioName: 'menu_settings_close' }, type: EventTypes.AUDIO_PLAY });
};

export const confirmSetting = ({ managerEntityId, editKey }: {
    editKey?: string
    managerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmSetting.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (SETTINGS[manager._selectedSetting] === SETTINGS[0]) {
        editSettingAudio({ managerEntityId });
    }
    else if (SETTINGS[manager._selectedSetting]) {
        editSettingKey({ editKey, managerEntityId });
    }
    else {
        throw error({ message: 'Setting not yet implemented', where: confirmSetting.name });
    }

    event({ type: EventTypes.MENU_SETTINGS_UPDATE });
    event({ data: { audioName: 'main_confirm' }, type: EventTypes.AUDIO_PLAY });
};

export const selectSetting = ({ managerEntityId, offset }: {
    managerEntityId?: string | null,
    offset: 1 | -1,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: selectSetting.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (offset === -1) {
        manager._selectedSetting = Math.max(0, manager._selectedSetting - 1);
    }
    else if (offset === 1) {
        manager._selectedSetting = Math.min(
            SETTINGS.length - 1,
            manager._selectedSetting + 1,
        );
    }

    event({ type: EventTypes.MENU_SETTINGS_UPDATE });
    event({ data: { audioName: 'main_select' }, type: EventTypes.AUDIO_PLAY });
};

export const onSettingsInput = ({ inputKey }: { inputKey: string }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: onSettingsInput.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (inputKey === manager.settings.keys.action._back) {
        if (getState('isSettingEditOpen')) {
            confirmSetting({ editKey: inputKey });
            return;
        }

        closeSettings();
        return;
    }
    if (getState('isSettingEditOpen')) {
        if (inputKey === manager.settings.keys.action._save) return;
        if (inputKey === manager.settings.keys.action._quit) return;

        confirmSetting({ editKey: inputKey });
        return;
    }
    else if (inputKey === manager.settings.keys.action._act) {
        confirmSetting({});
        return;
    }
    else if (inputKey === manager.settings.keys.move._up) {
        selectSetting({ offset: -1 });
        return;
    }
    else if (inputKey === manager.settings.keys.move._down) {
        selectSetting({ offset: 1 });
        return;
    }
    else if (inputKey === manager.settings.keys.action._save) {
        if (getState('isGameLaunching')) return;

        createSave();
        return;
    }
    else if (inputKey === manager.settings.keys.action._quit) {
        if (getState('isGameLaunching')) return;

        quitToLaunch({});
        return;
    }
};
//#endregion
//#endregion
