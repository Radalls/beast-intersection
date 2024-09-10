import pkg from '../../../../package.json';

import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { setState, getState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { event } from '@/render/events';

//#region CONSTANTS
//#region LAUNCH
export const LAUNCH_OPTIONS = [
    'start',
    'load',
    'settings',
];
//#endregion

//#region SETTINGS
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
//#endregion

//#region UTILS
//#region SETTINGS
export const settingKeyAlreadyInUse = ({ key, managerEntityId }: {
    key: string,
    managerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: settingKeyAlreadyInUse.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    return [
        ...Object.values(manager.settings.keys.action),
        ...Object.values(manager.settings.keys.move),
    ].includes(key);
};

export const editSettingAudio = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: editSettingAudio.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    manager.settings._audio = !(manager.settings._audio);

    setState('isSettingAudioAllowed', manager.settings._audio);

    event({
        data: { // temp
            audioName: (getState('isGameLaunching'))
                ? 'bgm_menu'
                : 'bgm_map1',
            loop: (manager.settings._audio)
                ? true
                : undefined,
        },
        entityId: managerEntityId,
        type: (manager.settings._audio)
            ? EventTypes.AUDIO_PLAY
            : EventTypes.AUDIO_STOP,
    });
};

export const editSettingKey = ({ editKey, managerEntityId }: {
    editKey?: string,
    managerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: editSettingKey.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const settingKey = SETTINGS[manager._selectedSetting];
    const settingKeyPath = SETTINGS_KEYS_PATHS[settingKey];

    if (getState('isSettingEditOpen')) {
        if (!(editKey)) {
            throw error({ message: 'editKey is undefined', where: editSettingKey.name });
        }
        if (editKey === manager.settings.keys.action._back) {
            setState('isSettingEditOpen', false);

            event({
                entityId: managerEntityId,
                type: EventTypes.MENU_SETTINGS_DISPLAY_EDIT,
            });

            return;
        }
        if (settingKeyAlreadyInUse({ key: editKey })) {
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

export const getProjectVersion = () => pkg.version;
//#endregion
//#endregion
