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
import { ActivityBugData, ActivityFishData } from './components/resource';
import { Tile } from './components/tilemap';
import { nextDialog, selectDialogOption, startDialog } from './systems/dialog/dialog';

export type Event<K extends keyof Component = keyof Component> = {
    type: EventTypes,
    entityId: string,
    data?: EventData<K>,
};

export type EventData<K extends keyof Component = keyof Component> = Component[K] | Tile | ActivityBugData | ActivityFishData;

export enum EventInputKeys {
    UP = 'z',
    LEFT = 'q',
    DOWN = 's',
    RIGHT = 'd',
    ACT = 'e',
    INVENTORY = 'i',
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
    /* Dialog */
    DIALOG_START = 'DIALOG_START',
    DIALOG_UPDATE = 'DIALOG_UPDATE',
    DIALOG_END = 'DIALOG_END',
}

export const onInputKeyDown = (inputKey: EventInputKeys) => {
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

        if (getState('isActivityRunning')) {
            if (getState('isActivityBugRunning')) {
                onActivityBugInput({ inputKey });
                return;
            }
            else if (getState('isActivityFishRunning')) {
                onActivityFishInput({ inputKey });
                return;
            }
            else return;
        }
        else if (getState('isPlayerDialogOpen')) {
            const dialogEntityId = getStore('dialogId')
                ?? error({ message: 'Store dialogId is undefined', where: onInputKeyDown.name });

            if (inputKey === EventInputKeys.UP) {
                selectDialogOption({ entityId: dialogEntityId, offset: -1 });
                return;
            }
            else if (inputKey === EventInputKeys.DOWN) {
                selectDialogOption({ entityId: dialogEntityId, offset: 1 });
                return;
            }
            else if (inputKey === EventInputKeys.ACT) {
                nextDialog({ entityId: dialogEntityId });
                return;
            }
            else return;
        }
        else {
            if (inputKey === EventInputKeys.INVENTORY) {
                setState('isPlayerInventoryOpen', !(getState('isPlayerInventoryOpen')));

                event({
                    type: EventTypes.INVENTORY_DISPLAY,
                    entityId: playerEntityId,
                });

                return;
            }
            else if (inputKey === EventInputKeys.UP) {
                if (getState('isPlayerInventoryOpen')) return; // temp

                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x,
                    targetY: playerPosition._y - 1,
                });

                return;
            }
            else if (inputKey === EventInputKeys.LEFT) {
                if (getState('isPlayerInventoryOpen')) return; // temp

                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x - 1,
                    targetY: playerPosition._y,
                });

                return;
            }
            else if (inputKey === EventInputKeys.DOWN) {
                if (getState('isPlayerInventoryOpen')) return; // temp

                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x,
                    targetY: playerPosition._y + 1,
                });

                return;
            }
            else if (inputKey === EventInputKeys.RIGHT) {
                if (getState('isPlayerInventoryOpen')) return; // temp

                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x + 1,
                    targetY: playerPosition._y,
                });

                return;
            }
            else if (inputKey === EventInputKeys.ACT) {
                if (getState('isPlayerInventoryOpen')) return; // temp

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

const onActivityBugInput = ({ inputKey }: { inputKey: EventInputKeys }) => {
    const activityBugEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityBugInput.name });

    playActivityBug({ activityId: activityBugEntityId, symbol: inputKey });
};

const onActivityFishInput = ({ inputKey }: { inputKey: EventInputKeys }) => {
    const activityFishEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityFishInput.name });

    playActivityFish({ activityId: activityFishEntityId, symbol: inputKey });
};
