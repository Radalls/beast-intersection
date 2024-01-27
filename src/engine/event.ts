import { getComponent } from "./entities/entity.manager";
import { getGameEntityByName } from "./entity";
import { updatePosition } from "./systems/position/position";

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
}

export type Event = {
    type: EventTypes,
    entityName: string,
    data?: Object,
};

export const onInputKeyDown = (inputKey: EventInputKeys) => {
    const playerEntity = getGameEntityByName('Player');
    const playerPosition = getComponent({ entityId: playerEntity, componentId: 'Position' });

    try {
        if (inputKey === EventInputKeys.UP) {
            updatePosition({
                entityId: playerEntity,
                x: playerPosition._x,
                y: playerPosition._y - 1,
            });
        }
        if (inputKey === EventInputKeys.LEFT) {
            updatePosition({
                entityId: playerEntity,
                x: playerPosition._x - 1,
                y: playerPosition._y,
            });
        }
        if (inputKey === EventInputKeys.DOWN) {
            updatePosition({
                entityId: playerEntity,
                x: playerPosition._x,
                y: playerPosition._y + 1,
            });
        }
        if (inputKey === EventInputKeys.RIGHT) {
            updatePosition({
                entityId: playerEntity,
                x: playerPosition._x + 1,
                y: playerPosition._y,
            });
        }
    } catch (e) {
        console.error(e);
    }
};
