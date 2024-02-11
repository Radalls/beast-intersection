import { event } from "../../../render/event";
import { Tile } from "../../components/tilemap";
import { checkComponent, getComponent } from "../../entities/entity.manager"
import { EventTypes } from "../../event";
import { updatePosition } from "../position/position";
import { setTrigger } from "../trigger/trigger";

//#region HELPERS
const findTileByEntityId = ({ tiles, entityId }: {
    tiles: Tile[],
    entityId: string,
}) => tiles.find(tile => tile._entityIds.includes(entityId));

export const findTileByPosition = ({ tiles, x, y }: {
    tiles: Tile[],
    x: number,
    y: number,
}) => tiles.find(tile => tile.position._x === x && tile.position._y === y);
//#endregion

//#region ACTIONS
export const generateTiles = (tilemapEntityId: string) => {
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
    tilemapEntityId: string,
    entityId: string,
}) => {
    const tilemap = getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' });
    const entityPosition = getComponent({ entityId, componentId: 'Position' });

    const targetTile = findTileByPosition({
        tiles: tilemap.tiles,
        x: entityPosition._x,
        y: entityPosition._y,
    });
    if (!(targetTile)) {
        throw new Error(`Tile ${entityPosition._x}-${entityPosition._y} not found`);
    }

    targetTile._entityIds.push(entityId);

    const entityTrigger = checkComponent({ entityId, componentId: 'Trigger' });
    if (entityTrigger) {
        setTrigger({ tilemapEntityId, entityId });
    }
}

export const updateTile = ({ tilemapEntityId, entityId, targetX, targetY }: {
    tilemapEntityId: string,
    entityId: string,
    targetX: number,
    targetY: number,
}) => {
    const tilemap = getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' });
    const entityTile = findTileByEntityId({ tiles: tilemap.tiles, entityId });
    if (!(entityTile)) {
        throw {
            message: `Tile ${entityId} not found`,
            where: updateTile.name,
        }
    }

    const targetTile = findTileByPosition({
        tiles: tilemap.tiles,
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
