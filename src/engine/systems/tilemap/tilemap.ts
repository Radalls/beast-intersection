import { event } from "../../../render/event";
import { Tile } from "../../components/tilemap";
import { checkComponent, getComponent } from "../../entities/entity.manager"
import { EventTypes } from "../../event";
import { getTileMap } from "../../store";
import { updatePosition } from "../position/position";
import { setTrigger } from "../trigger/trigger";

//#region HELPERS
export const findTileByEntityId = ({ entityId }: { entityId: string }) => {
    const tilemapEntityId = getTileMap();
    if (!(tilemapEntityId)) {
        throw {
            message: `Tilemap does not exist`,
            where: findTileByEntityId.name,
        }
    }

    return getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' }).tiles
        .find(tile => tile._entityIds.includes(entityId));
}

export const findTileByPosition = ({ x, y }: {
    x: number,
    y: number,
}) => {
    const tilemapEntityId = getTileMap();
    if (!(tilemapEntityId)) {
        throw {
            message: `Tilemap does not exist`,
            where: findTileByPosition.name,
        }
    }

    return getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' }).tiles
        .find(tile => tile.position._x === x && tile.position._y === y);
}
//#endregion

//#region ACTIONS
export const generateTiles = ({ tilemapEntityId }: { tilemapEntityId?: string | null }) => {
    if (!(tilemapEntityId)) tilemapEntityId = getTileMap();
    if (!(tilemapEntityId)) {
        throw {
            message: `Tilemap does not exist`,
            where: generateTiles.name,
        }
    }

    const tilemap = getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' });

    for (let i = 0; i < tilemap._width; i++) {
        for (let j = 0; j < tilemap._height; j++) {
            const tile: Tile = {
                _entityIds: [],
                _triggerEntityIds: [],
                position: {
                    _x: j,
                    _y: i,
                },
                sprite: { // temp
                    _image: 'tile_grass.png',
                },
            }
            tilemap.tiles.push(tile);

            event({
                type: EventTypes.TILEMAP_TILE_CREATE,
                entityId: tilemapEntityId,
                data: (({ _entityIds, ...tileData }) => tileData)(tile),
            });
        }
    }
}

export const setTile = ({ tilemapEntityId, entityId }: {
    tilemapEntityId?: string | null,
    entityId: string,
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getTileMap();
    if (!(tilemapEntityId)) {
        throw {
            message: `Tilemap does not exist`,
            where: generateTiles.name,
        }
    }

    const entityPosition = getComponent({ entityId, componentId: 'Position' });

    const targetTile = findTileByPosition({
        x: entityPosition._x,
        y: entityPosition._y,
    });
    if (!(targetTile)) {
        throw new Error(`Tile ${entityPosition._x}-${entityPosition._y} not found`);
    }

    targetTile._entityIds.push(entityId);

    const entityTrigger = checkComponent({ entityId, componentId: 'Trigger' });
    if (entityTrigger) {
        setTrigger({ entityId });
    }
}

export const updateTile = ({ tilemapEntityId, entityId, targetX, targetY }: {
    tilemapEntityId?: string | null,
    entityId: string,
    targetX: number,
    targetY: number,
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getTileMap();
    if (!(tilemapEntityId)) {
        throw {
            message: `Tilemap does not exist`,
            where: generateTiles.name,
        }
    }

    const entityTile = findTileByEntityId({ entityId });
    if (!(entityTile)) {
        throw {
            message: `Tile ${entityId} not found`,
            where: updateTile.name,
        }
    }

    const targetTile = findTileByPosition({
        x: targetX,
        y: targetY,
    });
    if (!(targetTile)) {
        throw {
            message: `Tile [${targetX}:${targetY}] not found`,
            where: updateTile.name,
        }
    }

    targetTile._entityIds.push(entityId);
    entityTile._entityIds = entityTile._entityIds.filter(id => id !== entityId);

    updatePosition({ entityId, x: targetTile.position._x, y: targetTile.position._y });
};
//#endregion
