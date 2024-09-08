import { Component } from './components/@component';
import { ActivityData } from './components/resource';
import { Tile } from './components/tilemap';
import { checkComponent, getComponent } from './entities';
import {
    confirmActivityCraftRecipe,
    endActivityCraft,
    playActivityBug,
    playActivityCraft,
    playActivityFish,
    selectActivityCraftRecipe,
} from './services/activity';
import { error } from './services/error';
import { getState, setState } from './state';
import { getStore } from './store';
import { nextDialog, selectDialogOption, startDialog } from './systems/dialog';
import { activateInventoryTool, closePlayerInventory, openPlayerInventory } from './systems/inventory';
import {
    closeSettings,
    confirmLaunchOption,
    confirmSetting,
    openSettings,
    quitToLaunch,
    selectLaunchOption,
    selectSetting,
} from './systems/manager';
import { createSave } from './systems/manager/manager.data';
import { useResource } from './systems/resource';
import { updateTile } from './systems/tilemap';
import { checkTrigger } from './systems/trigger';

import { AudioData } from '@/render/audio';

//#region TYPES
export type Event<K extends keyof Component = keyof Component> = {
    data?: EventData<K>,
    entityId: string,
    type: EventTypes
};

export type EventData<K extends keyof Component = keyof Component> = Component[K] | Tile | ActivityData | AudioData;

export enum EventTypes {
    /* Activity */
    ACTIVITY_BUG_END = 'ACTIVITY_BUG_END',
    ACTIVITY_BUG_START = 'ACTIVITY_BUG_START',
    ACTIVITY_BUG_UPDATE = 'ACTIVITY_BUG_UPDATE',
    ACTIVITY_CRAFT_END = 'ACTIVITY_CRAFT_END',
    ACTIVITY_CRAFT_PLAY_END = 'ACTIVITY_CRAFT_PLAY_END',
    ACTIVITY_CRAFT_PLAY_START = 'ACTIVITY_CRAFT_PLAY_START',
    ACTIVITY_CRAFT_PLAY_UPDATE = 'ACTIVITY_CRAFT_PLAY_UPDATE',
    ACTIVITY_CRAFT_SELECT_END = 'ACTIVITY_CRAFT_SELECT_END',
    ACTIVITY_CRAFT_SELECT_START = 'ACTIVITY_CRAFT_SELECT_START',
    ACTIVITY_CRAFT_SELECT_UPDATE = 'ACTIVITY_CRAFT_SELECT_UPDATE',
    ACTIVITY_CRAFT_START = 'ACTIVITY_CRAFT_START',
    ACTIVITY_END = 'ACTIVITY_END',
    ACTIVITY_FISH_END = 'ACTIVITY_FISH_END',
    ACTIVITY_FISH_START = 'ACTIVITY_FISH_START',
    ACTIVITY_FISH_UPDATE = 'ACTIVITY_FISH_UPDATE',
    ACTIVITY_START = 'ACTIVITY_START',
    ACTIVITY_WIN = 'ACTIVITY_WIN',
    /* Audio */
    AUDIO_PAUSE = 'AUDIO_PAUSE',
    AUDIO_PLAY = 'AUDIO_PLAY',
    AUDIO_STOP = 'AUDIO_STOP',
    /* Dialog */
    DIALOG_END = 'DIALOG_END',
    DIALOG_START = 'DIALOG_START',
    DIALOG_UPDATE = 'DIALOG_UPDATE',
    /* Energy */
    ENERGY_CREATE = 'ENERGY_CREATE',
    ENERGY_DISPLAY = 'ENERGY_DISPLAY',
    ENERGY_UPDATE = 'ENERGY_UPDATE',
    /* Entity */
    ENTITY_CREATE = 'ENTITY_CREATE',
    ENTITY_DESTROY = 'ENTITY_DESTROY',
    ENTITY_DISPLAY = 'ENTITY_DISPLAY',
    ENTITY_POSITION_UPDATE = 'ENTITY_POSITION_UPDATE',
    ENTITY_SPRITE_CREATE = 'ENTITY_SPRITE_CREATE',
    /* Inventory */
    INVENTORY_CREATE = 'INVENTORY_CREATE',
    INVENTORY_DISPLAY = 'INVENTORY_DISPLAY',
    INVENTORY_TOOL_ACTIVATE = 'INVENTORY_TOOL_ACTIVATE',
    INVENTORY_TOOL_ACTIVE_DISPLAY = 'INVENTORY_TOOL_ACTIVE_DISPLAY',
    INVENTORY_TOOL_UPDATE = 'INVENTORY_TOOL_UPDATE',
    INVENTORY_UPDATE = 'INVENTORY_UPDATE',
    /* Main */
    MAIN_RUN = 'MAIN_RUN',
    /* Menu */
    MENU_LAUNCH_DISPLAY = 'MENU_LAUNCH_DISPLAY',
    MENU_LAUNCH_UPDATE = 'MENU_LAUNCH_UPDATE',
    MENU_LOADING_OFF = 'MENU_LOADING_OFF',
    MENU_LOADING_ON = 'MENU_LOADING_ON',
    MENU_SETTINGS_DISPLAY = 'MENU_SETTINGS_DISPLAY',
    MENU_SETTINGS_DISPLAY_EDIT = 'MENU_SETTINGS_DISPLAY_EDIT',
    MENU_SETTINGS_UPDATE = 'MENU_SETTINGS_UPDATE',
    /* Quest */
    QUEST_COMPLETE = 'QUEST_COMPLETE',
    QUEST_DISPLAY = 'QUEST_DISPLAY',
    QUEST_END = 'QUEST_END',
    QUEST_START = 'QUEST_START',
    /* Tilemap */
    TILEMAP_CREATE = 'TILEMAP_CREATE',
    TILEMAP_TILE_CREATE = 'TILEMAP_TILE_CREATE',
    TILEMAP_TILE_DESTROY = 'TILEMAP_TILE_DESTROY',
}
//#endregion

//#region EVENTS
export const onInputKeyDown = (inputKey: string) => {
    if (
        !(getState('isGameLaunching')) && !(getState('isGameRunning')) && !(getState('isGamePaused')) ||
        getState('isGameLoading') ||
        getState('isInputCooldown')
    ) return;

    if (getState('isGameRunning')) {
        setState('isInputCooldown', true);
    }

    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: onInputKeyDown.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const playerEntityId = (getState('isGameRunning'))
        ? getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: onInputKeyDown.name })
        : null;

    if (!(getState('isGameRunning'))) {
        if (getState('isGamePaused')) {
            if (inputKey === manager.settings.keys.action._back) {
                if (getState('isSettingEditOpen')) {
                    confirmSetting({ editKey: inputKey });
                    return;
                }

                closeSettings({});
                return;
            }
            else {
                onSettingsInput({ inputKey });
                return;
            }
        }
        else if (getState('isGameLaunching')) {
            if (inputKey === manager.settings.keys.action._back) {
                openSettings({});
                return;
            }
            else if (inputKey === manager.settings.keys.move._up) {
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
        }
    }
    else {
        if (getState('isPlayerInventoryOpen')) {
            if (
                inputKey === manager.settings.keys.action._inventory
                || inputKey === manager.settings.keys.action._back
            ) {
                closePlayerInventory({ playerEntityId });
                return;
            }
            else if (inputKey === manager.settings.keys.action._tool) {
                activateInventoryTool({ entityId: playerEntityId });
                return;
            }
            else return;
        }
        else if (getState('isActivityRunning')) {
            if (getState('isActivityBugRunning')) {
                if (getState('isActivityBugCooldown')) return;

                onActivityBugInput({ inputKey });
                return;
            }
            else if (getState('isActivityFishRunning')) {
                onActivityFishInput({ inputKey });
                return;
            }
            else if (getState('isActivityCraftRunning')) {
                onActivityCraftInput({ inputKey });
                return;
            }
            else return;
        }
        else if (getState('isPlayerDialogOpen')) {
            const dialogEntityId = getStore('dialogId')
                ?? error({ message: 'Store dialogId is undefined', where: onInputKeyDown.name });

            if (inputKey === manager.settings.keys.move._up) {
                selectDialogOption({ entityId: dialogEntityId, offset: -1 });
                return;
            }
            else if (inputKey === manager.settings.keys.move._down) {
                selectDialogOption({ entityId: dialogEntityId, offset: 1 });
                return;
            }
            else if (inputKey === manager.settings.keys.action._act) {
                nextDialog({ entityId: dialogEntityId });
                return;
            }
            else return;
        }
        else {
            if (inputKey === manager.settings.keys.action._back) {
                openSettings({});
                return;
            }
            else if (inputKey === manager.settings.keys.action._inventory) {
                openPlayerInventory({ playerEntityId });
                return;
            }
            else if (inputKey === manager.settings.keys.action._tool) {
                activateInventoryTool({ entityId: playerEntityId });
                return;
            }
            else if (inputKey === manager.settings.keys.move._up) {
                updateTile({
                    entityId: playerEntityId,
                    target: 'up',
                });

                return;
            }
            else if (inputKey === manager.settings.keys.move._left) {
                updateTile({
                    entityId: playerEntityId,
                    target: 'left',
                });

                return;
            }
            else if (inputKey === manager.settings.keys.move._down) {
                updateTile({
                    entityId: playerEntityId,
                    target: 'down',
                });

                return;
            }
            else if (inputKey === manager.settings.keys.move._right) {
                updateTile({
                    entityId: playerEntityId,
                    target: 'right',
                });

                return;
            }
            else if (inputKey === manager.settings.keys.action._act) {
                const triggeredEntityId = checkTrigger({});
                if (triggeredEntityId) {
                    onTrigger({ triggeredEntityId });
                }

                return;
            }
        }
    }
};

const onTrigger = ({ entityId, triggeredEntityId }: {
    entityId?: string | null,
    triggeredEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined ', where: onTrigger.name });

    const resource = checkComponent({ componentId: 'Resource', entityId: triggeredEntityId });
    if (resource) {
        useResource({ resourceEntityId: triggeredEntityId });
        return;
    }

    const dialog = checkComponent({ componentId: 'Dialog', entityId: triggeredEntityId });
    if (dialog) {
        startDialog({ entityId: triggeredEntityId });
        return;
    }
};

const onActivityBugInput = ({ inputKey }: { inputKey: string }) => {
    const activityBugEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityBugInput.name });

    playActivityBug({ activityId: activityBugEntityId, symbol: inputKey });
};

const onActivityFishInput = ({ inputKey }: { inputKey: string }) => {
    const activityFishEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityFishInput.name });

    playActivityFish({ activityId: activityFishEntityId, symbol: inputKey });
};

const onActivityCraftInput = ({ inputKey }: { inputKey: string }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: onInputKeyDown.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const activityCraftEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityCraftInput.name });

    if (getState('isActivityCraftSelecting')) {
        if (inputKey === manager.settings.keys.action._act) {
            confirmActivityCraftRecipe({ activityId: activityCraftEntityId });
        }
        else if (inputKey === manager.settings.keys.move._up) {
            selectActivityCraftRecipe({ activityId: activityCraftEntityId, offset: -1 });
        }
        else if (inputKey === manager.settings.keys.move._down) {
            selectActivityCraftRecipe({ activityId: activityCraftEntityId, offset: 1 });
        }
        else if (inputKey === manager.settings.keys.action._back) {
            endActivityCraft({ activityId: activityCraftEntityId });
        }
    }
    else if (getState('isActivityCraftPlaying')) {
        playActivityCraft({ activityId: activityCraftEntityId, symbol: inputKey });
    }
};

const onSettingsInput = ({ inputKey }: { inputKey: string }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: onInputKeyDown.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (getState('isSettingEditOpen')) {
        if (inputKey === manager.settings.keys.action._save) return;
        if (inputKey === manager.settings.keys.action._quit) return;

        confirmSetting({ editKey: inputKey });
    }
    else if (inputKey === manager.settings.keys.action._act) {
        confirmSetting({});
    }
    else if (inputKey === manager.settings.keys.move._up) {
        selectSetting({ offset: -1 });
    }
    else if (inputKey === manager.settings.keys.move._down) {
        selectSetting({ offset: 1 });
    }
    else if (inputKey === manager.settings.keys.action._save) {
        if (getState('isGameLaunching')) return;

        createSave();
    }
    else if (inputKey === manager.settings.keys.action._quit) {
        if (getState('isGameLaunching')) return;

        quitToLaunch({});
    }
};
//#endregion
