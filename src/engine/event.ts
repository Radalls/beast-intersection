import { Component } from './components/@component';
import { event } from "../render/events/event";
import { getComponent, checkComponent } from "./entities/entity.manager";
import { getState, setState } from "./state";
import { getStore } from "./store";
import { playActivityBug } from "./services/activity/activity.bug";
import { useResource } from "./systems/resource/resource";
import { updateTile } from "./systems/tilemap/tilemap";
import { checkTrigger } from "./systems/trigger/trigger";
import { playActivityFish } from "./services/activity/activity.fish";
import { error } from "./services/error";
import { ActivityData } from './components/resource';
import { Tile } from './components/tilemap';
import { nextDialog, selectDialogOption, startDialog } from './systems/dialog/dialog';
import { confirmActivityCraftRecipe, endActivityCraft, playActivityCraft, selectActivityCraftRecipe } from './services/activity/activity.craft';

export type Event<K extends keyof Component = keyof Component> = {
    type: EventTypes,
    entityId: string,
    data?: EventData<K>,
};

export type EventData<K extends keyof Component = keyof Component> = Component[K] | Tile | ActivityData;

export enum EventInputActionKeys {
    ACT = 'e',
    INVENTORY = 'i',
    BACK = 'Escape',
}

export enum EventInputMoveKeys {
    UP = 'z',
    LEFT = 'q',
    DOWN = 's',
    RIGHT = 'd',
}

export enum EventTypes {
    /* Entity */
    ENTITY_CREATE = 'ENTITY_CREATE',
    ENTITY_DESTROY = 'ENTITY_DESTROY',
    ENTITY_POSITION_UPDATE = 'ENTITY_POSITION_UPDATE',
    ENTITY_SPRITE_CREATE = 'ENTITY_SPRITE_CREATE',
    /* Inventory */
    INVENTORY_CREATE = 'INVENTORY_CREATE',
    INVENTORY_DISPLAY = 'INVENTORY_DISPLAY',
    INVENTORY_UPDATE = 'INVENTORY_UPDATE',
    /* Tilemap */
    TILEMAP_CREATE = 'TILEMAP_CREATE',
    TILEMAP_TILE_CREATE = 'TILEMAP_TILE_CREATE',
    /* Activity */
    ACTIVITY_START = 'ACTIVITY_START',
    ACTIVITY_WIN = 'ACTIVITY_WIN',
    ACTIVITY_END = 'ACTIVITY_END',
    ACTIVITY_BUG_START = 'ACTIVITY_BUG_START',
    ACTIVITY_BUG_UPDATE = 'ACTIVITY_BUG_UPDATE',
    ACTIVITY_BUG_END = 'ACTIVITY_BUG_END',
    ACTIVITY_FISH_START = 'ACTIVITY_FISH_START',
    ACTIVITY_FISH_UPDATE = 'ACTIVITY_FISH_UPDATE',
    ACTIVITY_FISH_END = 'ACTIVITY_FISH_END',
    ACTIVITY_CRAFT_START = 'ACTIVITY_CRAFT_START',
    ACTIVITY_CRAFT_SELECT_START = 'ACTIVITY_CRAFT_SELECT_START',
    ACTIVITY_CRAFT_SELECT_UPDATE = 'ACTIVITY_CRAFT_SELECT_UPDATE',
    ACTIVITY_CRAFT_SELECT_END = 'ACTIVITY_CRAFT_SELECT_END',
    ACTIVITY_CRAFT_PLAY_START = 'ACTIVITY_CRAFT_PLAY_START',
    ACTIVITY_CRAFT_PLAY_UPDATE = 'ACTIVITY_CRAFT_PLAY_UPDATE',
    ACTIVITY_CRAFT_PLAY_END = 'ACTIVITY_CRAFT_PLAY_END',
    ACTIVITY_CRAFT_END = 'ACTIVITY_CRAFT_END',
    /* Dialog */
    DIALOG_START = 'DIALOG_START',
    DIALOG_UPDATE = 'DIALOG_UPDATE',
    DIALOG_END = 'DIALOG_END',
}

export const onInputKeyDown = (inputKey: EventInputActionKeys | EventInputMoveKeys) => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: onInputKeyDown.name });

    const playerPosition = getComponent({ entityId: playerEntityId, componentId: 'Position' });

    try {
        if (
            !(getState('isGameRunning')) ||
            getState('isInputCooldown') ||
            getState('isActivityBugCooldown')
        ) return;

        setState('isInputCooldown', true);

        if (getState('isPlayerInventoryOpen')) {
            if (inputKey === EventInputActionKeys.INVENTORY || inputKey === EventInputActionKeys.BACK) {
                setState('isPlayerInventoryOpen', false);

                event({
                    type: EventTypes.INVENTORY_DISPLAY,
                    entityId: playerEntityId,
                });

                return;
            }
            else return;
        }
        else if (getState('isActivityRunning')) {
            if (getState('isActivityBugRunning')) {
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

            if (inputKey === EventInputMoveKeys.UP) {
                selectDialogOption({ entityId: dialogEntityId, offset: -1 });
                return;
            }
            else if (inputKey === EventInputMoveKeys.DOWN) {
                selectDialogOption({ entityId: dialogEntityId, offset: 1 });
                return;
            }
            else if (inputKey === EventInputActionKeys.ACT) {
                nextDialog({ entityId: dialogEntityId });
                return;
            }
            else return;
        }
        else {
            if (inputKey === EventInputActionKeys.INVENTORY) {
                setState('isPlayerInventoryOpen', true);

                event({
                    type: EventTypes.INVENTORY_DISPLAY,
                    entityId: playerEntityId,
                });

                return;
            }
            else if (inputKey === EventInputMoveKeys.UP) {
                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x,
                    targetY: playerPosition._y - 1,
                });

                return;
            }
            else if (inputKey === EventInputMoveKeys.LEFT) {
                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x - 1,
                    targetY: playerPosition._y,
                });

                return;
            }
            else if (inputKey === EventInputMoveKeys.DOWN) {
                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x,
                    targetY: playerPosition._y + 1,
                });

                return;
            }
            else if (inputKey === EventInputMoveKeys.RIGHT) {
                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x + 1,
                    targetY: playerPosition._y,
                });

                return;
            }
            else if (inputKey === EventInputActionKeys.ACT) {
                const triggeredEntityId = checkTrigger({});
                if (triggeredEntityId) {
                    onTrigger({ triggeredEntityId });
                }

                return;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
};

const onTrigger = ({ entityId, triggeredEntityId }: {
    entityId?: string | null,
    triggeredEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined ', where: onTrigger.name });

    const resource = checkComponent({ entityId: triggeredEntityId, componentId: 'Resource' });
    if (resource) {
        useResource({ resourceEntityId: triggeredEntityId });
        return;
    }

    const dialog = checkComponent({ entityId: triggeredEntityId, componentId: 'Dialog' });
    if (dialog) {
        startDialog({ entityId: triggeredEntityId });
        return;
    }
};

const onActivityBugInput = ({ inputKey }: { inputKey: EventInputActionKeys | EventInputMoveKeys }) => {
    const activityBugEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityBugInput.name });

    playActivityBug({ activityId: activityBugEntityId, symbol: inputKey });
};

const onActivityFishInput = ({ inputKey }: { inputKey: EventInputActionKeys | EventInputMoveKeys }) => {
    const activityFishEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityFishInput.name });

    playActivityFish({ activityId: activityFishEntityId, symbol: inputKey });
};

const onActivityCraftInput = ({ inputKey }: { inputKey: EventInputActionKeys | EventInputMoveKeys }) => {
    const activityCraftEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityCraftInput.name });

    if (getState('isActivityCraftSelecting')) {
        if (inputKey === EventInputActionKeys.ACT) {
            confirmActivityCraftRecipe({ activityId: activityCraftEntityId });
        }
        else if (inputKey === EventInputMoveKeys.UP) {
            selectActivityCraftRecipe({ activityId: activityCraftEntityId, offset: -1 });
        }
        else if (inputKey === EventInputMoveKeys.DOWN) {
            selectActivityCraftRecipe({ activityId: activityCraftEntityId, offset: 1 });
        }
        else if (inputKey === EventInputActionKeys.BACK) {
            endActivityCraft({ activityId: activityCraftEntityId });
        }
    }
    else if (getState('isActivityCraftPlaying')) {
        playActivityCraft({ activityId: activityCraftEntityId, symbol: inputKey });
    }
};
