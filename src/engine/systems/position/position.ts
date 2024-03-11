import { event } from "../../../render/events/event";
import { getComponent } from "../../entities/entity.manager";
import { EventTypes } from "../../event";
import { error } from "../../services/error";

//#region CHECKS
const invalidPosition = ({ x, y }: {
    x: number,
    y: number,
}) => x < 0 || y < 0;

const samePosition = ({ entityPosition, inputPosition }: {
    entityPosition: { x: number, y: number },
    inputPosition: { x: number, y: number },
}) => entityPosition.x === inputPosition.x && entityPosition.y === inputPosition.y
//#endregion

//#region ACTIONS
export const updatePosition = ({ entityId, x, y }: {
    entityId: string,
    x: number,
    y: number,
}) => {
    if (invalidPosition({ x, y })) error({ message: `Position (${x}-${y}) is invalid`, where: updatePosition.name });

    const position = getComponent({ entityId, componentId: 'Position' });
    if (samePosition({
        entityPosition: { x: position._x, y: position._y },
        inputPosition: { x, y },
    })) error({ message: `Position (${x}-${y}) is invalid`, where: updatePosition.name });

    position._x = x;
    position._y = y;

    event({
        type: EventTypes.ENTITY_POSITION_UPDATE,
        entityId,
        data: position,
    });
}
//#endregion
