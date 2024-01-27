import { emit } from "../render/main";
import { getComponent } from "./entities/entity.manager";
import { getGameEntity } from "./entity";
import { updatePosition } from "./systems/position/position";

export enum InputKeys {
    UP = 'z',
    DOWN = 'd',
    LEFT = 'q',
    RIGHT = 's',
}

export enum Events {
    ENTITY_POSITION_UPDATE = 'ENTITY_POSITION_UPDATE',
}

export const onInputKeyDown = (inputKey: InputKeys) => {
    const playerEntity = getGameEntity('Player');
    const playerPosition = getComponent({ entityId: playerEntity, componentId: 'Position' });

    try {
        if (inputKey === InputKeys.UP) {
            updatePosition({
                entityId: playerEntity,
                x: playerPosition._x,
                y: playerPosition._y - 1,
            });
        }
        if (inputKey === InputKeys.DOWN) {
            updatePosition({
                entityId: playerEntity,
                x: playerPosition._x,
                y: playerPosition._y + 1,
            });
        }
        if (inputKey === InputKeys.LEFT) {
            updatePosition({
                entityId: playerEntity,
                x: playerPosition._x - 1,
                y: playerPosition._y,
            });
        }
        if (inputKey === InputKeys.RIGHT) {
            updatePosition({
                entityId: playerEntity,
                x: playerPosition._x + 1,
                y: playerPosition._y,
            });
        }

        emit(Events.ENTITY_POSITION_UPDATE, { entityName: 'Player', x: playerPosition._x, y: playerPosition._y });
    } catch (e) {
        console.error(e);
    }
};
