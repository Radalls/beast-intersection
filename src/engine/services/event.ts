import { getState, setState } from './state';
import { getStore } from './store';

import { Component } from '@/engine/components/@component';
import { ActivityData } from '@/engine/components/resource';
import { Tile } from '@/engine/components/tilemap';
import { getComponent } from '@/engine/entities';
import { error, ErrorData } from '@/engine/services/error';
import { nextDialog, selectDialogOption } from '@/engine/systems/dialog';
import {
    activateInventoryTool,
    onInventoryInput,
    openPlayerInventory,
} from '@/engine/systems/inventory';
import {
    getKeyMoveDirection,
    getKeyMoveOffset,
    onLaunchInput,
    onSettingsInput,
    openSettings,
} from '@/engine/systems/manager';
import { onActivityBugInput, onActivityFishInput, onActivityCraftInput } from '@/engine/systems/resource';
import { updateTile } from '@/engine/systems/tilemap';
import { checkTrigger } from '@/engine/systems/trigger';
import { AudioData } from '@/render/audio';

//#region TYPES
export type Event<K extends keyof Component = keyof Component> = {
    data?: EventData<K>,
    entityId?: string,
    type: EventTypes
};

export type EventData<K extends keyof Component = keyof Component>
    = Component[K] | Tile | ActivityData | AudioData | ErrorData;

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
    ACTIVITY_LOSE = 'ACTIVITY_LOSE',
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
    ENTITY_SPRITE_UPDATE = 'ENTITY_SPRITE_UPDATE',
    /* Inventory */
    INVENTORY_CREATE = 'INVENTORY_CREATE',
    INVENTORY_DISPLAY = 'INVENTORY_DISPLAY',
    INVENTORY_OPTION_DISPLAY = 'INVENTORY_OPTION_DISPLAY',
    INVENTORY_OPTION_UPDATE = 'INVENTORY_OPTION_UPDATE',
    INVENTORY_SELECT_SLOT = 'INVENTORY_SELECT',
    INVENTORY_TOOL_ACTIVATE = 'INVENTORY_TOOL_ACTIVATE',
    INVENTORY_TOOL_ACTIVE_DISPLAY = 'INVENTORY_TOOL_ACTIVE_DISPLAY',
    INVENTORY_TOOL_UPDATE = 'INVENTORY_TOOL_UPDATE',
    INVENTORY_UPDATE = 'INVENTORY_UPDATE',
    /* Main */
    MAIN_CAMERA_UPDATE = 'MAIN_CAMERA_UPDATE',
    MAIN_ERROR = 'MAIN_ERROR',
    MAIN_LOADING_ERROR = 'MAIN_LOADING_ERROR',
    MAIN_LOADING_OFF = 'MAIN_LOADING_OFF',
    MAIN_LOADING_ON = 'MAIN_LOADING_ON',
    MAIN_RUN = 'MAIN_RUN',
    /* Menu */
    MENU_LAUNCH_DISPLAY = 'MENU_LAUNCH_DISPLAY',
    MENU_LAUNCH_UPDATE = 'MENU_LAUNCH_UPDATE',
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
            onSettingsInput({ inputKey });
            return;
        }
        else if (getState('isGameLaunching')) {
            if (inputKey === manager.settings.keys.action._back) {
                openSettings({});
                return;
            }
            else {
                onLaunchInput({ inputKey });
                return;
            }
        }
    }
    else {
        if (getState('isPlayerInventoryOpen')) {
            onInventoryInput({ inputKey });
            return;
        }
        else if (getState('isActivityRunning')) {
            if (getState('isActivityBugRunning')) {
                if (getState('isActivityBugInputCooldown')) return;

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

            if (inputKey === manager.settings.keys.action._act) {
                nextDialog({ entityId: dialogEntityId });
                return;
            }
            else {
                const inputOffset = getKeyMoveOffset({ inputKey, managerEntityId });
                if (!(inputOffset)) return;

                selectDialogOption({ entityId: dialogEntityId, offset: inputOffset });
            }
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
            else if (inputKey === manager.settings.keys.action._act) {
                checkTrigger({});
                return;
            }
            else {
                const targetDirection = getKeyMoveDirection({ inputKey, managerEntityId });
                if (!(targetDirection)) return;

                updateTile({
                    entityId: playerEntityId,
                    target: targetDirection,
                });

                return;
            }
        }
    }
};
//#endregion
