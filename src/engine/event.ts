import { getComponent, checkEntityId, checkComponent } from "./entities/entity.manager";
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
    const tilemapEntityId = checkEntityId('TileMap');
    if (!(tilemapEntityId)) {
        throw new Error('TileMap does not exist');
    }

    const playerEntityId = checkEntityId('Player');
    if (!(playerEntityId)) {
        throw new Error('Player does not exist');
    }

    const playerPosition = getComponent({ entityId: playerEntityId, componentId: 'Position' });

    try {
        if (inputKey === EventInputKeys.UP) {
            updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: playerPosition._x,
                targetY: playerPosition._y - 1,
            })
        }
        else if (inputKey === EventInputKeys.LEFT) {
            updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: playerPosition._x - 1,
                targetY: playerPosition._y,
            })
        }
        else if (inputKey === EventInputKeys.DOWN) {
            updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: playerPosition._x,
                targetY: playerPosition._y + 1,
            })
        }
        else if (inputKey === EventInputKeys.RIGHT) {
            updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: playerPosition._x + 1,
                targetY: playerPosition._y,
            })
        }
        else if (inputKey === EventInputKeys.ACT) {
            const triggeredEntityId = checkTrigger({ tilemapEntityId, entityId: playerEntityId });
            if (triggeredEntityId) {
                onTrigger({ entityId: playerEntityId, triggeredEntityId });
            }
        }
        else if (inputKey === EventInputKeys.INVENTORY) { // temp
            const playerInventory = getComponent({ entityId: playerEntityId, componentId: 'Inventory' });
            console.log(playerInventory);
        }
    } catch (e) {
        console.error(e);
    }
};

export const onTrigger = ({ entityId, triggeredEntityId }: {
    entityId: string,
    triggeredEntityId: string,
}) => {
    const resource = checkComponent({ entityId: triggeredEntityId, componentId: 'Resource' });
    if (resource) {
        useResource({ entityId, triggeredEntityId });
    }
};
