import { getComponent, checkEntityId } from "./entities/entity.manager";
import { updateTile } from "./systems/tilemap/tilemap";

export enum EventInputKeys {
    UP = 'z',
    LEFT = 'q',
    DOWN = 's',
    RIGHT = 'd',
}

export enum EventTypes {
    ENTITY_CREATE = 'ENTITY_CREATE',
    ENTITY_INVENTORY_CREATE = 'ENTITY_INVENTORY_CREATE',
    ENTITY_POSITION_CREATE = 'ENTITY_POSITION_CREATE',
    ENTITY_POSITION_UPDATE = 'ENTITY_POSITION_UPDATE',
    ENTITY_SPRITE_CREATE = 'ENTITY_SPRITE_CREATE',
    TILEMAP_CREATE = 'TILEMAP_CREATE',
    TILEMAP_TILE_CREATE = 'TILEMAP_TILE_CREATE',
}

export type Event = {
    type: EventTypes,
    entityName: string,
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
        if (inputKey === EventInputKeys.LEFT) {
            updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: playerPosition._x - 1,
                targetY: playerPosition._y,
            })
        }
        if (inputKey === EventInputKeys.DOWN) {
            updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: playerPosition._x,
                targetY: playerPosition._y + 1,
            })
        }
        if (inputKey === EventInputKeys.RIGHT) {
            updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: playerPosition._x + 1,
                targetY: playerPosition._y,
            })
        }
    } catch (e) {
        console.error(e);
    }
};
