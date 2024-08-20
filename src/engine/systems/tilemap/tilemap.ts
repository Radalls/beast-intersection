import { EntityDataTypes, loadTileMapData, loadTileMapEntityData, TileMapData } from './tilemap.data';
import { findTileByPosition, findTileByEntityId } from './tilemap.utils';

import { Tile, TileExit, TileMap } from '@/engine/components/tilemap';
import { checkComponent, destroyAllEntities, getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import {
    createEntityNpc,
    createEntityResourceBug,
    createEntityResourceCraft,
    createEntityResourceFish,
    createEntityResourceItem,
} from '@/engine/services/entity';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/store';
import { checkCollider, setCollider } from '@/engine/systems/collider';
import { updatePosition } from '@/engine/systems/position';
import { setTrigger } from '@/engine/systems/trigger';
import { event } from '@/render/events';

//#region CHECKS
const targetExitUp = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) => (exit._direction === 'up' && targetX === tile.position._x && targetY === tile.position._y - 1);

const targetExitDown = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) => (exit._direction === 'down' && targetX === tile.position._x && targetY === tile.position._y + 1);

const targetExitLeft = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) => (exit._direction === 'left' && targetX === tile.position._x - 1 && targetY === tile.position._y);

const targetExitRight = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) => (exit._direction === 'right' && targetX === tile.position._x + 1 && targetY === tile.position._y);

const targetExit = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) =>
    targetExitUp({ exit, targetX, targetY, tile })
    || targetExitDown({ exit, targetX, targetY, tile })
    || targetExitLeft({ exit, targetX, targetY, tile })
    || targetExitRight({ exit, targetX, targetY, tile });
//#endregion

//#region SYSTEMS
export const generateTileMap = ({ tilemapEntityId, tileMapName }: {
    tileMapName: string,
    tilemapEntityId?: string | null
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: generateTileMap.name });

    const tileMap = getComponent({ componentId: 'TileMap', entityId: tilemapEntityId });

    const tileMapData = loadTileMapData({ tileMapName })
        ?? error({ message: `TileMapData for ${tileMapName} not found`, where: generateTileMap.name });

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

    if (entityTile.exits) {
        const isExit = exitTile({ entityId, targetX, targetY, tilemapEntityId });

        if (isExit) return;
    }

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

const generateTileMapTiles = ({ tilemapEntityId, tileMap, tileMapData }: {
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
            exits: (tile.exits)
                ? tile.exits.map(exit => ({
                    _direction: exit.direction,
                    _targetMap: exit.map,
                    targetPosition: {
                        _x: exit.x,
                        _y: exit.y,
                    },
                }))
                : undefined,
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

const generateTileMapEntities = ({ tileMapData }: { tileMapData: TileMapData }) => {
    for (const entity of tileMapData.entities) {
        const entityData = loadTileMapEntityData({ entityName: entity.name, entityType: entity.type })
            ?? error({
                message: `EntityData for ${entity.type} ${entity.name} not found`,
                where: generateTileMapEntities.name,
            });

        if (entity.type === EntityDataTypes.NPC) {
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

const exitTile = ({ tilemapEntityId, entityId, targetX, targetY }: {
    entityId: string,
    targetX: number,
    targetY: number,
    tilemapEntityId?: string | null
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: exitTile.name });

    const entityTile = findTileByEntityId({ entityId })
        ?? error({ message: `Tile for entity ${entityId} not found`, where: exitTile.name });

    if (!(entityTile.exits)) throw error({ message: `Tile for entity ${entityId} has no exits`, where: exitTile.name });

    for (const exit of entityTile.exits) {
        if (targetExit({ exit, targetX, targetY, tile: entityTile })) {
            destroyTileMap({ tilemapEntityId });
            generateTileMap({ tileMapName: exit._targetMap });
            updatePosition({ entityId, x: exit.targetPosition._x, y: exit.targetPosition._y });
            setTile({ entityId, tilemapEntityId });

            return true;
        }
    }

    return false;
};

const destroyTileMap = ({ tilemapEntityId }: {
    tilemapEntityId?: string | null
}) => {
    if (!(tilemapEntityId)) tilemapEntityId = getStore('tilemapId')
        ?? error({ message: 'Store tilemapId is undefined', where: exitTile.name });

    const tileMap = getComponent({ componentId: 'TileMap', entityId: tilemapEntityId });

    for (const tile of tileMap.tiles) {
        event({
            data: tile,
            entityId: tilemapEntityId,
            type: EventTypes.TILEMAP_TILE_DESTROY,
        });
    }

    tileMap.tiles = [];

    destroyAllEntities();
};
//#endregion
