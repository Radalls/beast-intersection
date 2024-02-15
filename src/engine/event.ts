import { event } from "../render/event";
import { getComponent, checkComponent } from "./entities/entity.manager";
import { state } from "./state";
import { getPlayer } from "./store";
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
}

export type Event = {
    type: EventTypes,
    entityId: string,
    data?: Object,
};

export const onInputKeyDown = (inputKey: EventInputKeys) => {
    const playerEntityId = getPlayer();
    if (!(playerEntityId)) {
        throw {
            message: `Player does not exist`,
            where: onInputKeyDown.name,
        }
    }

    const playerPosition = getComponent({ entityId: playerEntityId, componentId: 'Position' });

    try {
        if (inputKey === EventInputKeys.INVENTORY) {
            state.isInventoryOpen = !(state.isInventoryOpen);

            event({
                type: EventTypes.ENTITY_INVENTORY_DISPLAY,
                entityId: playerEntityId,
            });
        }
        if (!(state.isInventoryOpen)) {
            if (inputKey === EventInputKeys.UP) {
                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x,
                    targetY: playerPosition._y - 1,
                })
            }
            else if (inputKey === EventInputKeys.LEFT) {
                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x - 1,
                    targetY: playerPosition._y,
                })
            }
            else if (inputKey === EventInputKeys.DOWN) {
                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x,
                    targetY: playerPosition._y + 1,
                })
            }
            else if (inputKey === EventInputKeys.RIGHT) {
                updateTile({
                    entityId: playerEntityId,
                    targetX: playerPosition._x + 1,
                    targetY: playerPosition._y,
                })
            }
            else if (inputKey === EventInputKeys.ACT) {
                const triggeredEntityId = checkTrigger({});
                if (triggeredEntityId) {
                    onTrigger({ triggeredEntityId });
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
};

export const onTrigger = ({ entityId, triggeredEntityId }: {
    entityId?: string | null,
    triggeredEntityId: string,
}) => {
    if (!(entityId)) entityId = getPlayer();
    if (!(entityId)) {
        throw {
            message: `Entity does not exist`,
            where: onTrigger.name,
        }
    }

    const resource = checkComponent({ entityId: triggeredEntityId, componentId: 'Resource' });
    if (resource) {
        useResource({ triggeredEntityId });
    }
};
