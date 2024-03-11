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

export type Event<K extends keyof Component = keyof Component> = {
    type: EventTypes,
    entityId: string,
    data?: EventData<K>,
};

export type EventData<K extends keyof Component = keyof Component> = Component[K] | Tile | ActivityBugData | ActivityFishData

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
}

export const onInputKeyDown = (inputKey: EventInputKeys) => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: onInputKeyDown.name });

    const playerPosition = getComponent({ entityId: playerEntityId, componentId: 'Position' });

    try {
        if (!(getState('isGameRunning'))) return;
        if (getState('isInputCooldown')) return;
        if (getState('isActivityBugCooldown')) return;

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

            return;
        }
        else {
            if (inputKey === EventInputKeys.INVENTORY) {
                setState('isInventoryOpen', !(getState('isInventoryOpen')));

                event({
                    type: EventTypes.INVENTORY_DISPLAY,
                    entityId: playerEntityId,
                });

                return;
            }
            else if (!(getState('isInventoryOpen'))) {
                if (inputKey === EventInputKeys.UP) {
                    updateTile({
                        entityId: playerEntityId,
                        targetX: playerPosition._x,
                        targetY: playerPosition._y - 1,
                    });

                    return;
                }
                else if (inputKey === EventInputKeys.LEFT) {
                    updateTile({
                        entityId: playerEntityId,
                        targetX: playerPosition._x - 1,
                        targetY: playerPosition._y,
                    });

                    return;
                }
                else if (inputKey === EventInputKeys.DOWN) {
                    updateTile({
                        entityId: playerEntityId,
                        targetX: playerPosition._x,
                        targetY: playerPosition._y + 1,
                    });

                    return;
                }
                else if (inputKey === EventInputKeys.RIGHT) {
                    updateTile({
                        entityId: playerEntityId,
                        targetX: playerPosition._x + 1,
                        targetY: playerPosition._y,
                    });

                    return;
                }
                else if (inputKey === EventInputKeys.ACT) {
                    const triggeredEntityId = checkTrigger({});
                    if (triggeredEntityId) {
                        onTrigger({ triggeredEntityId });
                        return;
                    }

                    return;
                }
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
