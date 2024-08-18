import { event } from "../../../render/events/event";
import { Tile, TileMap } from "../../components/tilemap";
import { checkComponent, getComponent } from "../../entities/entity.manager"
import { EventTypes } from "../../event";
import { getStore } from "../../store";
import { updatePosition } from "../position/position";
import { setTrigger } from "../trigger/trigger";
import { checkCollider, setCollider } from "../collider/collider";
import { error } from "../../services/error";
import { EntityDataTypes, loadTileMapData, loadTileMapEntityData, TileMapData } from "./tilemap.data";
import { createEntityNpc, createEntityPlayer, createEntityResourceBug, createEntityResourceCraft, createEntityResourceFish, createEntityResourceItem } from "../../services/entity";

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

//#region SYSTEMS
export const generateTileMap = async ({ tilemapEntityId, tileMapPath }: {
    tilemapEntityId?: string | null,
    tileMapPath: string,
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: `Store tilemapId is undefined`, where: generateTileMap.name });

    const tileMap = getComponent({ entityId: tilemapEntityId, componentId: 'TileMap' });

    const tileMapData = await loadTileMapData({ tileMapPath })
        ?? error({ message: `TileMapData for ${tileMapPath} not found`, where: generateTileMap.name });

    tileMap._height = tileMapData.height;
    tileMap._width = tileMapData.width;

    event({
        type: EventTypes.TILEMAP_CREATE,
        entityId: tilemapEntityId,
        data: tileMap,
    });

    generateTileMapTiles({ tilemapEntityId, tileMap, tileMapData });
    generateTileMapEntities({ tileMapData });
}

export const generateTileMapTiles = async ({ tilemapEntityId, tileMap, tileMapData }: {
    tilemapEntityId?: string | null,
    tileMap: TileMap,
    tileMapData: TileMapData,
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: `Store tilemapId is undefined`, where: generateTileMap.name });

    for (const tile of tileMapData.tiles) {
        const newTile: Tile = {
            _entityIds: [],
            _entityColliderIds: [],
            _entityTriggerIds: [],
            _solid: tile.solid,
            position: {
                _x: tile.x,
                _y: tile.y,
            },
            sprite: {
                _image: `tile_${tile.sprite}`,
            },
        }

        tileMap.tiles.push(newTile);

        event({
            type: EventTypes.TILEMAP_TILE_CREATE,
            entityId: tilemapEntityId,
            data: newTile,
        });
    }
}

export const generateTileMapEntities = async ({ tileMapData }: { tileMapData: TileMapData }) => {
    for (const entity of tileMapData.entities) {
        const entityData = await loadTileMapEntityData({ entityType: entity.type, entityName: entity.name })
            ?? error({ message: `EntityData for ${entity.type} ${entity.name} not found`, where: generateTileMapEntities.name });

        if (entity.type === EntityDataTypes.PLAYER) {
            createEntityPlayer({
                spritePath: entity.name.toLowerCase(),
                positionX: entity.x,
                positionY: entity.y,
            });
        }
        else if (entity.type === EntityDataTypes.NPC) {
            createEntityNpc({
                entityName: entity.name,
                spritePath: `npc_${entity.name.toLowerCase()}`,
                positionX: entity.x,
                positionY: entity.y,
            });
        }
        else if (entity.type === EntityDataTypes.RESOURCE_ITEM) {
            createEntityResourceItem({
                entityName: entity.name,
                spritePath: `resource_${entity.name.toLowerCase()}`,
                positionX: entity.x,
                positionY: entity.y,
                resourceIsTemporary: entityData.data.isTemporary,
                resoureceItemName: entityData.name,
            });
        }
        else if (entity.type === EntityDataTypes.RESOURCE_BUG) {
            createEntityResourceBug({
                entityName: entity.name,
                spritePath: `resource_${entity.name.toLowerCase()}`,
                positionX: entity.x,
                positionY: entity.y,
                resourceIsTemporary: entityData.data.isTemporary,
                resourceActivityBugMaxHp: entityData.data.maxHp,
                resourceActivityBugMaxNbErrors: entityData.data.maxNbErrors,
                resourceActivityBugSymbolInterval: entityData.data.symbolInterval,
                resoureceItemName: entityData.name,
            });
        }
        else if (entity.type === EntityDataTypes.RESOURCE_FISH) {
            createEntityResourceFish({
                entityName: entity.name,
                spritePath: `resource_${entity.name.toLowerCase()}`,
                positionX: entity.x,
                positionY: entity.y,
                resourceIsTemporary: entityData.data.isTemporary,
                resourceActivityFishDamage: entityData.data.damage,
                resourceActivityFishMaxHp: entityData.data.maxHp,
                resourceActivityFishFrenzyDuration: entityData.data.frenzyDuration,
                resourceActivityFishFrenzyInterval: entityData.data.frenzyInterval,
                resourceActivityFishRodDamage: 2, // temp
                resourceActivityFishRodMaxTension: 100, // temp
                resoureceItemName: entityData.name,
            });
        }
        else if (entity.type === EntityDataTypes.RESOURCE_CRAFT) {
            createEntityResourceCraft({
                entityName: entity.name,
                spritePath: `resource_${entity.name.toLowerCase()}`,
                positionX: entity.x,
                positionY: entity.y,
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

    if (targetTile._solid) error({ message: `Tile (${targetX}-${targetY}) is not accessible`, where: updateTile.name });

    const isTargetCollider = checkCollider({ x: targetX, y: targetY });
    if (isTargetCollider) error({ message: `Tile (${targetX}-${targetY}) is not accessible`, where: updateTile.name });

    targetTile._entityIds.push(entityId);
    entityTile._entityIds = entityTile._entityIds.filter(id => id !== entityId);

    updatePosition({ entityId, x: targetTile.position._x, y: targetTile.position._y });
};
//#endregion
