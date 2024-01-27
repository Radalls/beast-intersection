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

export const onInputKeyDown = (inputKey: string) => {
    if (inputKey === InputKeys.UP) {
        const playerEntity = getGameEntity('Player');
        const playerPosition = getComponent({ entityId: playerEntity, componentId: 'Position' });

        updatePosition({
            entityId: playerEntity,
            x: playerPosition._x,
            y: playerPosition._y - 1,
        });

        emit(Events.ENTITY_POSITION_UPDATE, { entityName: 'Player', x: playerPosition._x, y: playerPosition._y });
    }
};

