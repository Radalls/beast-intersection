import { getComponent } from "../../services/entity";
import { error } from "../../services/error";
import { findTileByPosition } from "../tilemap/tilemap";

//#region ACTIONS
export const setCollider = ({ entityId }: { entityId: string }) => {
    const entityPosition = getComponent({ entityId, componentId: 'Position' });
    const entityCollider = getComponent({ entityId, componentId: 'Collider' });

    for (const point of entityCollider.points) {
        const pointTile = findTileByPosition({
            x: entityPosition._x + point._offsetX,
            y: entityPosition._y + point._offsetY,
        });

        if (pointTile) {
            pointTile._entityColliderIds.push(entityId);
        }
    }
}

export const checkCollider = ({ x, y }: {
    x: number,
    y: number,
}) => {
    const targetTile = findTileByPosition({ x, y })
        ?? error({ message: `Tile (${x}, ${y}) does not exist`, where: checkCollider.name });

    if (targetTile._entityColliderIds.length > 0) {
        return true;
    }

    return false;
}

export const destroyCollider = ({ entityId }: { entityId: string }) => {
    const entityPosition = getComponent({ entityId, componentId: 'Position' });
    const entityCollider = getComponent({ entityId, componentId: 'Collider' });

    for (const point of entityCollider.points) {
        const pointTile = findTileByPosition({
            x: entityPosition._x + point._offsetX,
            y: entityPosition._y + point._offsetY,
        });

        if (pointTile) {
            pointTile._entityColliderIds = pointTile._entityColliderIds.filter((id) => id !== entityId);
        }
    }
};
//#endregion ACTIONS
