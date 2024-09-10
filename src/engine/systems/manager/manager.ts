import { loadSave } from './manager.data';
import { LAUNCH_OPTIONS, SETTINGS, editSettingAudio, editSettingKey, getProjectVersion } from './manager.utils';

import { stopCycle } from '@/engine/cycle';
import { destroyAllEntities, getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { launch, run } from '@/engine/main';
import { error } from '@/engine/services/error';
import { getState, setState } from '@/engine/state';
import { getStore, resetStore } from '@/engine/store';
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

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.MENU_LAUNCH_UPDATE,
    });
    event({
        data: { audioName: 'main_select' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const confirmLaunchOption = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: confirmLaunchOption.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (LAUNCH_OPTIONS[manager._selectedLaunchOption] === LAUNCH_OPTIONS[0]) {
        setState('isGameLaunching', false);

        event({
            entityId: managerEntityId,
            type: EventTypes.MAIN_RUN,
        });

        run({});

        // event({
        //     entityId: managerEntityId,
        //     type: EventTypes.MENU_LAUNCH_DISPLAY,
        // });
        event({
            entityId: managerEntityId,
            type: EventTypes.QUEST_DISPLAY,
        });

        event({
            data: { audioName: 'menu_launch_start' },
            entityId: managerEntityId,
            type: EventTypes.AUDIO_PLAY,
        });
        event({
            data: { audioName: 'bgm_map1', loop: true },
            entityId: managerEntityId,
            type: EventTypes.AUDIO_PLAY,
        });
        event({
            data: { audioName: 'bgm_menu' },
            entityId: managerEntityId,
            type: EventTypes.AUDIO_STOP,
        });

        return;
    }
    else if (LAUNCH_OPTIONS[manager._selectedLaunchOption] === LAUNCH_OPTIONS[1]) {
        loadSave().then((saveData) => {
            if (saveData.version !== getProjectVersion()) {
                event({
                    data: { audioName: 'main_fail' },
                    entityId: managerEntityId,
                    type: EventTypes.AUDIO_PLAY,
                });

                throw error({
                    message: 'Invalid save, project version does not match',
                    where: confirmLaunchOption.name,
                });
            }

            setState('isGameLaunching', false);

            event({
                entityId: managerEntityId,
                type: EventTypes.MAIN_RUN,
            });

            run({ saveData });

            event({
                entityId: managerEntityId,
                type: EventTypes.MENU_LAUNCH_DISPLAY,
            });
            event({
                entityId: managerEntityId,
                type: EventTypes.QUEST_DISPLAY,
            });

            event({
                data: { audioName: 'menu_launch_start' },
                entityId: managerEntityId,
                type: EventTypes.AUDIO_PLAY,
            });
            event({
                data: { audioName: 'bgm_map1', loop: true },
                entityId: managerEntityId,
                type: EventTypes.AUDIO_PLAY,
            });
            event({
                data: { audioName: 'bgm_menu' },
                entityId: managerEntityId,
                type: EventTypes.AUDIO_STOP,
            });

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

    closeSettings({});

    destroyAllEntities({ force: true });
    stopCycle();
    resetStore();

    launch();

    event({
        data: { audioName: 'bgm_map1' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_STOP,
    });
    event({
        data: { audioName: 'bgm_menu', loop: true },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};
//#endregion

//#region SETTINGS
export const openSettings = ({ managerEntityId }: { managerEntityId?: string | null }) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: openSettings.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    manager._selectedSetting = 0;

    setState('isGamePaused', true);
    if (getState('isGameRunning')) {
        setState('isGameRunning', false);

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
    }

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
    if (!(getState('isGameRunning')) && !(getState('isGameLaunching'))) {
        setState('isGameRunning', true);

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
    }

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
        data: { audioName: 'main_confirm' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
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

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.MENU_SETTINGS_UPDATE,
    });
    event({
        data: { audioName: 'main_select' },
        entityId: managerEntityId,
        type: EventTypes.AUDIO_PLAY,
    });
};
//#endregion
//#endregion
