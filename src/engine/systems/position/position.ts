import { event } from "../../../render/event";
import { getComponent } from "../../entities/entity.manager";
import { EventTypes } from "../../event";

const invalidPosition = (x: number, y: number) => x < 0 || y < 0;
const samePosition = ({ entityPosition, inputPosition }: {
    entityPosition: { x: number, y: number },
    inputPosition: { x: number, y: number },
}) => entityPosition.x === inputPosition.x && entityPosition.y === inputPosition.y

export const updatePosition = ({ entityId, x, y }: {
    entityId: string,
    x: number,
    y: number,
}) => {
    if (invalidPosition(x, y)) {
        throw new Error(`Position (${x}-${y}) is invalid`);
    }

    const position = getComponent({ entityId, componentId: 'Position' });
    if (samePosition({
        entityPosition: { x: position._x, y: position._y },
        inputPosition: { x, y },
    })) {
        throw new Error(`Position (${x}-${y}) is invalid`);
    }

    position._x = x;
    position._y = y;

    event({
        type: EventTypes.ENTITY_POSITION_UPDATE,
        entityId,
        data: (({ _, ...positionData }) => positionData)(position),
    });
}
