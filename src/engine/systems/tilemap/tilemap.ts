import { event } from '../../../render/events/event';
import { Tile, TileMap } from '../../components/tilemap';
import { checkComponent, getComponent } from '../../entities/entity.manager';
import { EventTypes } from '../../event';
import {
    createEntityNpc,
    createEntityPlayer,
    createEntityResourceBug,
    createEntityResourceCraft,
    createEntityResourceFish,
    createEntityResourceItem,
} from '../../services/entity';
import { error } from '../../services/error';
import { getStore } from '../../store';
import { checkCollider, setCollider } from '../collider/collider';
import { updatePosition } from '../position/position';
import { setTrigger } from '../trigger/trigger';

import { EntityDataTypes, loadTileMapData, loadTileMapEntityData, TileMapData } from './tilemap.data';

//#region HELPERS
export const findTileByEntityId = ({ entityId }: { entityId: string }) => {
    const tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: findTileByEntityId.name });

    return getComponent({ componentId: 'TileMap', entityId: tilemapEntityId })
        .tiles.find(tile => tile._entityIds.includes(entityId));
};

export const findTileByPosition = ({ x, y }: {
    x: number,
    y: number,
}) => {
    const tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: findTileByPosition.name });

    return getComponent({ componentId: 'TileMap', entityId: tilemapEntityId })
        .tiles.find(tile => tile.position._x === x && tile.position._y === y);
};
//#endregion

//#region SYSTEMS
export const generateTileMap = async ({ tilemapEntityId, tileMapPath }: {
    tileMapPath: string,
    tilemapEntityId?: string | null
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: generateTileMap.name });

    const tileMap = getComponent({ componentId: 'TileMap', entityId: tilemapEntityId });

    const tileMapData = await loadTileMapData({ tileMapPath })
        ?? error({ message: `TileMapData for ${tileMapPath} not found`, where: generateTileMap.name });

    tileMap._height = tileMapData.height;
    tileMap._width = tileMapData.width;

    event({
        data: tileMap,
        entityId: tilemapEntityId,
        type: EventTypes.TILEMAP_CREATE,
    });

    generateTileMapTiles({ tileMap, tileMapData, tilemapEntityId });
    generateTileMapEntities({ tileMapData });
};

export const generateTileMapTiles = async ({ tilemapEntityId, tileMap, tileMapData }: {
    tileMap: TileMap,
    tileMapData: TileMapData,
    tilemapEntityId?: string | null
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: generateTileMap.name });

    for (const tile of tileMapData.tiles) {
        const newTile: Tile = {
            _entityColliderIds: [],
            _entityIds: [],
            _entityTriggerIds: [],
            _solid: tile.solid,
            position: {
                _x: tile.x,
                _y: tile.y,
            },
            sprite: {
                _image: `tile_${tile.sprite}`,
            },
        };

        tileMap.tiles.push(newTile);

        event({
            data: newTile,
            entityId: tilemapEntityId,
            type: EventTypes.TILEMAP_TILE_CREATE,
        });
    }
};

export const generateTileMapEntities = async ({ tileMapData }: { tileMapData: TileMapData }) => {
    for (const entity of tileMapData.entities) {
        const entityData = await loadTileMapEntityData({ entityName: entity.name, entityType: entity.type })
            ?? error({
                message: `EntityData for ${entity.type} ${entity.name} not found`,
                where: generateTileMapEntities.name,
            });

        if (entity.type === EntityDataTypes.PLAYER) {
            createEntityPlayer({
                positionX: entity.x,
                positionY: entity.y,
                spritePath: entity.name.toLowerCase(),
            });
        }
        else if (entity.type === EntityDataTypes.NPC) {
            createEntityNpc({
                entityName: entity.name,
                positionX: entity.x,
                positionY: entity.y,
                spritePath: `npc_${entity.name.toLowerCase()}`,
            });
        }
        else if (entity.type === EntityDataTypes.RESOURCE_ITEM) {
            createEntityResourceItem({
                entityName: entity.name,
                positionX: entity.x,
                positionY: entity.y,
                resourceIsTemporary: entityData.data.isTemporary,
                resoureceItemName: entityData.name,
                spritePath: `resource_${entity.name.toLowerCase()}`,
            });
        }
        else if (entity.type === EntityDataTypes.RESOURCE_BUG) {
            createEntityResourceBug({
                entityName: entity.name,
                positionX: entity.x,
                positionY: entity.y,
                resourceActivityBugMaxHp: entityData.data.maxHp,
                resourceActivityBugMaxNbErrors: entityData.data.maxNbErrors,
                resourceActivityBugSymbolInterval: entityData.data.symbolInterval,
                resourceIsTemporary: entityData.data.isTemporary,
                resoureceItemName: entityData.name,
                spritePath: `resource_${entity.name.toLowerCase()}`,
            });
        }
        else if (entity.type === EntityDataTypes.RESOURCE_FISH) {
            createEntityResourceFish({
                entityName: entity.name,
                positionX: entity.x,
                positionY: entity.y,
                resourceActivityFishDamage: entityData.data.damage,
                resourceActivityFishFrenzyDuration: entityData.data.frenzyDuration,
                resourceActivityFishFrenzyInterval: entityData.data.frenzyInterval,
                resourceActivityFishMaxHp: entityData.data.maxHp,
                resourceActivityFishRodDamage: 2, // temp
                resourceActivityFishRodMaxTension: 100, // temp
                resourceIsTemporary: entityData.data.isTemporary,
                resoureceItemName: entityData.name,
                spritePath: `resource_${entity.name.toLowerCase()}`,
            });
        }
        else if (entity.type === EntityDataTypes.RESOURCE_CRAFT) {
            createEntityResourceCraft({
                entityName: entity.name,
                positionX: entity.x,
                positionY: entity.y,
                spritePath: `resource_${entity.name.toLowerCase()}`,
            });
        }
    }
};

export const setTile = ({ tilemapEntityId, entityId }: {
    entityId: string,
    tilemapEntityId?: string | null
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: setTile.name });

    const entityPosition = getComponent({ componentId: 'Position', entityId });

    const targetTile = findTileByPosition({
        x: entityPosition._x,
        y: entityPosition._y,
    }) ?? error({ message: `Tile (${entityPosition._x}-${entityPosition._y}) does not exist`, where: setTile.name });

    targetTile._entityIds.push(entityId);

    const entityTrigger = checkComponent({ componentId: 'Trigger', entityId });
    if (entityTrigger) {
        setTrigger({ entityId });
    }

    const entityCollider = checkComponent({ componentId: 'Collider', entityId });
    if (entityCollider) {
        setCollider({ entityId });
    }
};

export const updateTile = ({ tilemapEntityId, entityId, targetX, targetY }: {
    entityId: string,
    targetX: number,
    targetY: number,
    tilemapEntityId?: string | null
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: updateTile.name });

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
