import { getComponent } from '@/engine/entities/entity.manager';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { event } from '@/render/events';

//#region CHECKS
const invalidPosition = ({ x, y }: {
    x: number,
    y: number,
}) => x < 0 || y < 0;

const samePosition = ({ entityPosition, inputPosition }: {
    entityPosition: { x: number, y: number },
    inputPosition: { x: number, y: number },
}) => entityPosition.x === inputPosition.x && entityPosition.y === inputPosition.y;
//#endregion

//#region SYSTEMS
export const updatePosition = ({ entityId, x, y }: {
    entityId: string,
    x: number,
    y: number,
}) => {
    if (invalidPosition({ x, y })) error({ message: `Position (${x}-${y}) is invalid`, where: updatePosition.name });

    const position = getComponent({ componentId: 'Position', entityId });
    if (samePosition({
        entityPosition: { x: position._x, y: position._y },
        inputPosition: { x, y },
    })) error({ message: `Position (${x}-${y}) is invalid`, where: updatePosition.name });

    position._x = x;
    position._y = y;

    event({
        data: position,
        entityId,
        type: EventTypes.ENTITY_POSITION_UPDATE,
    });
};
//#endregion
