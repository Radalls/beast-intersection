import { event } from "../render/event";
import { getComponent, checkComponent } from "./services/entity";
import { getState, setState } from "./state";
import { getStore } from "./store";
import { playActivityBug } from "./services/activity/activity.bug";
import { useResource } from "./systems/resource/resource";
import { updateTile } from "./systems/tilemap/tilemap";
import { checkTrigger } from "./systems/trigger/trigger";

export enum EventInputKeys {
    UP = 'z',
    LEFT = 'q',
    DOWN = 's',
    RIGHT = 'd',
    ACT = 'e',
    INVENTORY = 'i',
}

export enum EventTypes {
    ENTITY_CREATE = 'ENTITY_CREATE',
    ENTITY_DESTROY = 'ENTITY_DESTROY',
    ENTITY_INVENTORY_CREATE = 'ENTITY_INVENTORY_CREATE',
    ENTITY_INVENTORY_DISPLAY = 'ENTITY_INVENTORY_DISPLAY',
    ENTITY_INVENTORY_UPDATE = 'ENTITY_INVENTORY_UPDATE',
    ENTITY_POSITION_UPDATE = 'ENTITY_POSITION_UPDATE',
    ENTITY_SPRITE_CREATE = 'ENTITY_SPRITE_CREATE',
    TILEMAP_CREATE = 'TILEMAP_CREATE',
    TILEMAP_TILE_CREATE = 'TILEMAP_TILE_CREATE',
    ACTIVITY_BUG_START = 'ACTIVITY_BUG_START',
    ACTIVITY_BUG_UPDATE = 'ACTIVITY_BUG_UPDATE',
    ACTIVITY_BUG_END = 'ACTIVITY_BUG_END',
}

export type Event = {
    type: EventTypes,
    entityId: string,
    data?: Object,
};

export const onInputKeyDown = (inputKey: EventInputKeys) => {
    const playerEntityId = getStore('playerId');
    if (!(playerEntityId)) {
        throw {
            message: `Player does not exist`,
            where: onInputKeyDown.name,
        }
    }

    const playerPosition = getComponent({ entityId: playerEntityId, componentId: 'Position' });

    try {
        if (!(getState('isGameRunning')) || getState('isActivityBugCooldown')) return;

        if (getState('isActivityRunning') && getState('isActivityBugRunning')) {
            onActivityBugInput({ inputKey });
            return;
        }

        if (inputKey === EventInputKeys.INVENTORY) {
            if (getState('isActivityRunning')) return;

            setState('isInventoryOpen', !(getState('isInventoryOpen')));

            event({
                type: EventTypes.ENTITY_INVENTORY_DISPLAY,
                entityId: playerEntityId,
            });
        }
        else if (inputKey === EventInputKeys.UP) {
            if (getState('isInventoryOpen') || getState('isActivityRunning')) return;

            updateTile({
                entityId: playerEntityId,
                targetX: playerPosition._x,
                targetY: playerPosition._y - 1,
            })
        }
        else if (inputKey === EventInputKeys.LEFT) {
            if (getState('isInventoryOpen') || getState('isActivityRunning')) return;

            updateTile({
                entityId: playerEntityId,
                targetX: playerPosition._x - 1,
                targetY: playerPosition._y,
            })
        }
        else if (inputKey === EventInputKeys.DOWN) {
            if (getState('isInventoryOpen') || getState('isActivityRunning')) return;

            updateTile({
                entityId: playerEntityId,
                targetX: playerPosition._x,
                targetY: playerPosition._y + 1,
            })
        }
        else if (inputKey === EventInputKeys.RIGHT) {
            if (getState('isInventoryOpen') || getState('isActivityRunning')) return;

            updateTile({
                entityId: playerEntityId,
                targetX: playerPosition._x + 1,
                targetY: playerPosition._y,
            })
        }
        else if (inputKey === EventInputKeys.ACT) {
            if (getState('isInventoryOpen') || getState('isActivityRunning')) return;

            const triggeredEntityId = checkTrigger({});
            if (triggeredEntityId) {
                onTrigger({ triggeredEntityId });
            }
        }
    } catch (e) {
        console.error(e);
    }
};

const onTrigger = ({ entityId, triggeredEntityId }: {
    entityId?: string | null,
    triggeredEntityId: string,
}) => {
    if (!(entityId)) entityId = getStore('playerId');
    if (!(entityId)) {
        throw {
            message: `Entity does not exist`,
            where: onTrigger.name,
        }
    }

    const resource = checkComponent({ entityId: triggeredEntityId, componentId: 'Resource' });
    if (resource) {
        useResource({ resourceEntityId: triggeredEntityId });
    }
};

const onActivityBugInput = ({ inputKey }: { inputKey: EventInputKeys }) => {
    const activityBugEntityId = getStore('activityId');
    if (!(activityBugEntityId)) {
        throw {
            message: `Activity does not exist`,
            where: onActivityBugInput.name,
        }
    }

    playActivityBug({ activityId: activityBugEntityId, symbol: inputKey });
};
