import pkg from '../../../../package.json';

import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { setState, getState } from '@/engine/services/state';
import { getStore } from '@/engine/services/store';
import { setVolumeAudio as setAudioVolume } from '@/render/audio';
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
export const getKeyMoveDirection = ({ inputKey, managerEntityId }: {
    inputKey: string,
    managerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: getKeyMoveDirection.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (inputKey === manager.settings.keys.move._up) return 'up';
    else if (inputKey === manager.settings.keys.move._down) return 'down';
    else if (inputKey === manager.settings.keys.move._left) return 'left';
    else if (inputKey === manager.settings.keys.move._right) return 'right';

    return null;
};

export const getKeyMoveOffset = ({ inputKey, managerEntityId }: {
    inputKey: string,
    managerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: getKeyMoveOffset.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (inputKey === manager.settings.keys.move._up) return -1;
    else if (inputKey === manager.settings.keys.move._down) return 1;

    return null;
};

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

export const editSettingAudio = ({ editKey, managerEntityId }: {
    editKey?: string,
    managerEntityId?: string | null,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: editSettingAudio.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (!(editKey)) {
        manager.settings._audio = !(manager.settings._audio);
        setState('isSettingAudioAllowed', manager.settings._audio);

        //TODO: handle bgm data
        event({
            data: {
                audioName: (getState('isGameLaunching'))
                    ? 'bgm_menu2'
                    : 'bgm_map1',
                loop: (manager.settings._audio)
                    ? true
                    : undefined,
            },
            type: (manager.settings._audio)
                ? EventTypes.AUDIO_PLAY
                : EventTypes.AUDIO_STOP,
        });
    }
    else if (editKey === manager.settings.keys.move._left) {
        manager.settings._audioVolume = Math.max(0, manager.settings._audioVolume - 0.1);

        setState('isSettingAudioAllowed', manager.settings._audioVolume > 0);
        setAudioVolume({ volume: manager.settings._audioVolume });

        event({ data: { audioName: 'main_select' }, type: EventTypes.AUDIO_PLAY });
    }
    else if (editKey === manager.settings.keys.move._right) {
        manager.settings._audioVolume = Math.min(1, manager.settings._audioVolume + 0.1);

        setState('isSettingAudioAllowed', manager.settings._audioVolume < 1);
        setAudioVolume({ volume: manager.settings._audioVolume });

        event({ data: { audioName: 'main_select' }, type: EventTypes.AUDIO_PLAY });
    }
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

            event({ type: EventTypes.MENU_SETTINGS_DISPLAY_EDIT });

            return;
        }
        if (settingKeyAlreadyInUse({ key: editKey })) {
            event({
                data: { message: `La touche ${editKey.toUpperCase()} est déjà utilisée ailleurs` },
                type: EventTypes.MAIN_ERROR,
            });
            event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });

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

    event({ type: EventTypes.MENU_SETTINGS_DISPLAY_EDIT });
};

export const getProjectVersion = () => pkg.version;
//#endregion
//#endregion
