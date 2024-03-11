import { event } from "../../../render/events/event";
import { Tile } from "../../components/tilemap";
import { checkComponent, getComponent } from "../../entities/entity.manager"
import { EventTypes } from "../../event";
import { getStore } from "../../store";
import { updatePosition } from "../position/position";
import { setTrigger } from "../trigger/trigger";
import { checkCollider, setCollider } from "../collider/collider";
import { error } from "../../services/error";

//#region HELPERS
export const findTileByEntityId = ({ entityId }: { entityId: string }) => {
    const tilemapEntityId = getStore('tilemapId')
        ?? error({ message: `Store tilemapId is undefined`, where: findTileByEntityId.name });

    return getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' }).tiles
        .find(tile => tile._entityIds.includes(entityId));
}

export const findTileByPosition = ({ x, y }: {
    x: number,
    y: number,
}) => {
    const tilemapEntityId = getStore('tilemapId')
        ?? error({ message: `Store tilemapId is undefined`, where: findTileByPosition.name });

    return getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' }).tiles
        .find(tile => tile.position._x === x && tile.position._y === y);
}
//#endregion

//#region ACTIONS
export const generateTiles = ({ tilemapEntityId }: { tilemapEntityId?: string | null }) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: `Store tilemapId is undefined`, where: generateTiles.name });

    const tilemap = getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' });

    for (let i = 0; i < tilemap._width; i++) {
        for (let j = 0; j < tilemap._height; j++) {
            const tile: Tile = {
                _entityIds: [],
                _entityColliderIds: [],
                _entityTriggerIds: [],
                position: {
                    _x: j,
                    _y: i,
                },
                sprite: {
                    _image: 'tile_grass.png', // temp
                },
            }
            tilemap.tiles.push(tile);

            event({
                type: EventTypes.TILEMAP_TILE_CREATE,
                entityId: tilemapEntityId,
                data: tile,
            });
        }
    }
}

export const setTile = ({ tilemapEntityId, entityId }: {
    tilemapEntityId?: string | null,
    entityId: string,
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: `Store tilemapId is undefined`, where: setTile.name });

    const entityPosition = getComponent({ entityId, componentId: 'Position' });

    const targetTile = findTileByPosition({
        x: entityPosition._x,
        y: entityPosition._y,
    }) ?? error({ message: `Tile (${entityPosition._x}-${entityPosition._y}) does not exist`, where: setTile.name });

    targetTile._entityIds.push(entityId);

    const entityTrigger = checkComponent({ entityId, componentId: 'Trigger' });
    if (entityTrigger) {
        setTrigger({ entityId });
    }

    const entityCollider = checkComponent({ entityId, componentId: 'Collider' });
    if (entityCollider) {
        setCollider({ entityId });
    }
}

export const updateTile = ({ tilemapEntityId, entityId, targetX, targetY }: {
    tilemapEntityId?: string | null,
    entityId: string,
    targetX: number,
    targetY: number,
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: `Store tilemapId is undefined`, where: updateTile.name });

    const entityTile = findTileByEntityId({ entityId })
        ?? error({ message: `Tile for entity ${entityId} not found`, where: updateTile.name });

    const targetTile = findTileByPosition({
        x: targetX,
        y: targetY,
    }) ?? error({ message: `Tile (${targetX}-${targetY}) does not exist`, where: updateTile.name });

    const isTargetCollider = checkCollider({ x: targetX, y: targetY });
    if (isTargetCollider) error({ message: `Tile (${targetX}-${targetY}) is not accessible`, where: updateTile.name });

    targetTile._entityIds.push(entityId);
    entityTile._entityIds = entityTile._entityIds.filter(id => id !== entityId);

    updatePosition({ entityId, x: targetTile.position._x, y: targetTile.position._y });
};
//#endregion
