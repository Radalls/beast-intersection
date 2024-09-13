import { generateTileMap, setTile, updateTile } from './tilemap';
import { TileMapData, loadTileMapEntityData } from './tilemap.data';

import { TileExit, Tile } from '@/engine/components/tilemap';
import { destroyAllEntities, EntityTypes, findEntityByName, getComponent } from '@/engine/entities';
import {
    createEntityNpc,
    createEntityResourceItem,
    createEntityResourceBug,
    createEntityResourceFish,
    createEntityResourceCraft,
} from '@/engine/services/entity';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getStore } from '@/engine/services/store';
import { updatePosition } from '@/engine/systems/position';
import { setEntityActive } from '@/engine/systems/state';
import { randAudio } from '@/render/audio';
import { event } from '@/render/events';

//#region CHECKS
export const targetExitUp = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) => (exit._direction === 'up' && targetX === tile.position._x && targetY === tile.position._y - 1);

export const targetExitDown = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) => (exit._direction === 'down' && targetX === tile.position._x && targetY === tile.position._y + 1);

export const targetExitLeft = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) => (exit._direction === 'left' && targetX === tile.position._x - 1 && targetY === tile.position._y);

export const targetExitRight = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) => (exit._direction === 'right' && targetX === tile.position._x + 1 && targetY === tile.position._y);

export const targetExit = ({ tile, exit, targetX, targetY }: {
    exit: TileExit,
    targetX: number,
    targetY: number,
    tile: Tile,
}) =>
    targetExitUp({ exit, targetX, targetY, tile })
    || targetExitDown({ exit, targetX, targetY, tile })
    || targetExitLeft({ exit, targetX, targetY, tile })
    || targetExitRight({ exit, targetX, targetY, tile });

export const tileIsGrass = ({ tile }: { tile: Tile }) => tile.sprite._image.includes('grass');
export const tileIsSand = ({ tile }: { tile: Tile }) => tile.sprite._image.includes('sand');
//#endregion

//#region UTILS
export const getTargetXY = ({ target, x, y }: {
    target: 'up' | 'down' | 'left' | 'right',
    x: number,
    y: number,
}) => {
    if (target === 'up') return { targetX: x, targetY: y - 1 };
    else if (target === 'down') return { targetX: x, targetY: y + 1 };
    else if (target === 'left') return { targetX: x - 1, targetY: y };
    else if (target === 'right') return { targetX: x + 1, targetY: y };
    else throw error({ message: 'Invalid target', where: getTargetXY.name });
};

export const findTileByEntityId = ({ entityId }: { entityId: string }) => {
    const tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: findTileByEntityId.name });

    return getComponent({ componentId: 'TileMap', entityId: tileMapEntityId })
        .tiles.find(tile => tile._entityIds.includes(entityId));
};

export const findTileByPosition = ({ x, y }: {
    x: number,
    y: number,
}) => {
    const tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: findTileByPosition.name });

    return getComponent({ componentId: 'TileMap', entityId: tileMapEntityId })
        .tiles.find(tile => tile.position._x === x && tile.position._y === y);
};

export const generateTileMapTiles = ({ tileMapEntityId, tileMapData }: {
    tileMapData: TileMapData,
    tileMapEntityId?: string | null
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: generateTileMap.name });

    const tileMap = getComponent({ componentId: 'TileMap', entityId: tileMapEntityId });

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

        event({ data: newTile, type: EventTypes.TILEMAP_TILE_CREATE });
    }
};

export const generateTileMapEntities = ({ tileMapEntityId, tileMapData }: {
    tileMapData: TileMapData,
    tileMapEntityId?: string | null,
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: generateTileMap.name });

    for (const entity of tileMapData.entities) {
        const entityData = loadTileMapEntityData({ entityName: entity.name, entityType: entity.type })
            ?? error({
                message: `EntityData for ${entity.type} ${entity.name} not found`,
                where: generateTileMapEntities.name,
            });

        if (entity.type === EntityTypes.NPC) {
            const { entity: npcEntity, entityId: npcEntityId } = findEntityByName({ entityName: entity.name });

            if (npcEntity && npcEntityId) {
                setEntityActive({ entityId: npcEntityId, value: true });
                setTile({ entityId: npcEntityId, tileMapEntityId });
            }
            else {
                createEntityNpc({
                    entityName: entity.name,
                    positionX: entity.x,
                    positionY: entity.y,
                    spritePath: `npc_${entity.name.toLowerCase()}`,
                    triggerPriority: entityData.priority,
                });
            }
        }
        else if (entity.type === EntityTypes.RESOURCE_ITEM) {
            createEntityResourceItem({
                entityName: entity.name,
                positionX: entity.x,
                positionY: entity.y,
                resourceIsTemporary: entityData.data.isTemporary,
                resoureceItemName: entityData.name,
                spritePath: `resource_${entity.name.toLowerCase()}`,
                triggerPriority: entityData.priority,
            });
        }
        else if (entity.type === EntityTypes.RESOURCE_BUG) {
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
                triggerPriority: entityData.priority,
            });
        }
        else if (entity.type === EntityTypes.RESOURCE_FISH) {
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
                triggerPriority: entityData.priority,
            });
        }
        else if (entity.type === EntityTypes.RESOURCE_CRAFT) {
            createEntityResourceCraft({
                entityName: entity.name,
                positionX: entity.x,
                positionY: entity.y,
                spritePath: `resource_${entity.name.toLowerCase()}`,
                triggerPriority: entityData.priority,
            });
        }
    }
};

export const exitTile = ({ tileMapEntityId, entityId, targetX, targetY }: {
    entityId: string,
    targetX: number,
    targetY: number,
    tileMapEntityId?: string | null
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: exitTile.name });

    const entityTile = findTileByEntityId({ entityId })
        ?? error({ message: `Tile for entity ${entityId} not found`, where: exitTile.name });

    if (!(entityTile.exits)) throw error({ message: `Tile for entity ${entityId} has no exits`, where: exitTile.name });

    for (const exit of entityTile.exits) {
        if (targetExit({ exit, targetX, targetY, tile: entityTile })) {
            destroyTileMap({ tileMapEntityId });
            generateTileMap({ tileMapName: exit._targetMap });
            updatePosition({ entityId, x: exit.targetPosition._x, y: exit.targetPosition._y });
            setTile({ entityId, tileMapEntityId });

            return true;
        }
    }

    return false;
};

export const destroyTileMap = ({ tileMapEntityId }: {
    tileMapEntityId?: string | null
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: exitTile.name });

    const tileMap = getComponent({ componentId: 'TileMap', entityId: tileMapEntityId });

    for (const tile of tileMap.tiles) {
        event({ data: tile, type: EventTypes.TILEMAP_TILE_DESTROY });
    }

    tileMap.tiles = [];

    destroyAllEntities({});
};

export const soundTile = ({ tileMapEntityId, entityId }: {
    entityId: string,
    tileMapEntityId?: string | null,
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: updateTile.name });

    const entityTile = findTileByEntityId({ entityId })
        ?? error({ message: `Tile for entity ${entityId} not found`, where: updateTile.name });

    if (tileIsGrass({ tile: entityTile })) {
        event({ data: { audioName: `step_grass${randAudio({ nb: 4 })}` }, type: EventTypes.AUDIO_PLAY });
    }
    else if (tileIsSand({ tile: entityTile })) {
        event({ data: { audioName: `step_sand${randAudio({ nb: 4 })}` }, type: EventTypes.AUDIO_PLAY });
    }
};
//#endregion
