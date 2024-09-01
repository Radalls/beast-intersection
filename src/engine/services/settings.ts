import { error } from './error';

import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { getState, setState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { event } from '@/render/events';

//#region CONSTANTS
export const SETTINGS = [
    'audio',
    'keyMoveUp',
    'keyMoveDown',
    'keyMoveLeft',
    'keyMoveRight',
    'keyActionAct',
    'keyActionInventory',
    'keyActionTool',
];

export const SETTINGS_KEYS_PATHS: { [key: string]: { path: string[] } } = {
    keyActionAct: { path: ['keys', 'action', '_act'] },
    keyActionInventory: { path: ['keys', 'action', '_inventory'] },
    keyActionTool: { path: ['keys', 'action', '_tool'] },
    keyMoveDown: { path: ['keys', 'move', '_down'] },
    keyMoveLeft: { path: ['keys', 'move', '_left'] },
    keyMoveRight: { path: ['keys', 'move', '_right'] },
    keyMoveUp: { path: ['keys', 'move', '_up'] },
};
//#endregion

//#region CHECKS
const keyAlreadyInUse = ({ key, managerEntityId }: {
    key: string,
    managerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: openSettings.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    return [
        ...Object.values(manager.settings.keys.action),
        ...Object.values(manager.settings.keys.move),
    ].includes(key);
};
//#endregion

//#region SERVICES
export const openSettings = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: openSettings.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    manager._selectedSetting = 0;

    setState('isGamePaused', true);

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: openSettings.name });
    event({
        entityId: playerEntityId,
        type: EventTypes.ENERGY_DISPLAY,
    });
    event({
        entityId: playerEntityId,
        type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY,
    });

    event({
        entityId: managerEntityId,
        type: EventTypes.QUEST_DISPLAY,
    });
    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.MENU_SETTINGS_DISPLAY,
    });
    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.MENU_SETTINGS_UPDATE,
    });

    event({
        data: { audioName: 'menu_settings_open' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const closeSettings = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: closeSettings.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    setState('isGamePaused', false);

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: closeSettings.name });
    event({
        entityId: playerEntityId,
        type: EventTypes.ENERGY_DISPLAY,
    });
    event({
        entityId: playerEntityId,
        type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY,
    });

    event({
        entityId: managerEntityId,
        type: EventTypes.QUEST_DISPLAY,
    });
    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.MENU_SETTINGS_DISPLAY,
    });
    event({
        data: { audioName: 'menu_settings_close' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
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

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.MENU_SETTINGS_UPDATE,
    });
    event({
        data: { audioName: 'menu_settings_confirm' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const selectSetting = ({ managerEntityId, offset }: {
    managerEntityId?: string | null,
    offset: 1 | -1,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmSetting.name });

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

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.MENU_SETTINGS_UPDATE,
    });
    event({
        data: { audioName: 'menu_settings_step' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

const editSettingAudio = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmSetting.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    manager.settings._audio = !(manager.settings._audio);

    setState('isSettingAudioAllowed', manager.settings._audio);

    event({
        data: { // temp
            audioName: 'bgm_map1',
            loop: manager.settings._audio ? true : undefined,
        },
        entityId: managerEntityId,
        type: manager.settings._audio ? EventTypes.AUDIO_PLAY : EventTypes.AUDIO_STOP,
    });
};

const editSettingKey = ({ editKey, managerEntityId }: {
    editKey?: string,
    managerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmSetting.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const settingKey = SETTINGS[manager._selectedSetting];
    const settingKeyPath = SETTINGS_KEYS_PATHS[settingKey];

    if (getState('isSettingEditOpen')) {
        if (!(editKey)) {
            throw error({ message: 'editKey is undefined', where: editSettingKey.name });
        }

        if (keyAlreadyInUse({ key: editKey })) {
            throw error({ message: `Key ${editKey} already in use`, where: editSettingKey.name });
        }

        let settings = manager.settings as any;
        for (let i = 0; i < settingKeyPath.path.length - 1; i++) {
            settings = settings[settingKeyPath.path[i]];
        }
        settings[settingKeyPath.path[settingKeyPath.path.length - 1]] = editKey;

        setState('isSettingEditOpen', false);
    }
    else {
        setState('isSettingEditOpen', true);
    }

    event({
        entityId: managerEntityId,
        type: EventTypes.MENU_SETTINGS_DISPLAY_EDIT,
    });
};
//#endregion
