import { generateTileMap, setTile, updateTile } from './tilemap';
import { TileMapData } from './tilemap.data';

import { TileExit, Tile } from '@/engine/components/tilemap';
import {
    checkComponent,
    destroyAllEntities,
    EntityTypes,
    findEntityByName,
    findEntityByMapPosition,
    getComponent,
    loadEntityData,
    findEntitiesByMap,
} from '@/engine/entities';
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
import { setEntityLoad } from '@/engine/systems/state';
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
}) => {
    return (
        targetExitUp({ exit, targetX, targetY, tile })
        || targetExitDown({ exit, targetX, targetY, tile })
        || targetExitLeft({ exit, targetX, targetY, tile })
        || targetExitRight({ exit, targetX, targetY, tile })
    );
};

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

export const findTileByEntityId = ({ entityId, tileMapEntityId }: {
    entityId: string,
    tileMapEntityId?: string | null
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: findTileByEntityId.name });

    return getComponent({ componentId: 'TileMap', entityId: tileMapEntityId })
        .tiles.find(tile => tile._entityIds.includes(entityId));
};

export const findTileByPosition = ({ x, y, tileMapEntityId }: {
    tileMapEntityId?: string | null
    x: number,
    y: number,
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
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

    for (const mapEntity of tileMapData.entities) {
        const { entity, entityId } = (mapEntity.name)
            ? findEntityByName({ entityName: mapEntity.name })
            : findEntityByMapPosition({ tileMapName: tileMapData.name, x: mapEntity.x, y: mapEntity.y });

        if (entity && entityId && checkComponent({ componentId: 'State', entityId })) {
            setEntityLoad({ entityId, value: true });
            setTile({ entityId, tileMapEntityId });
            continue;
        }
        else {
            if (mapEntity.name) {
                const entityData = loadEntityData({ entityName: mapEntity.name, entityType: mapEntity.type })
                    ?? error({
                        message: `EntityData for ${mapEntity.type} ${mapEntity.name} not found`,
                        where: generateTileMapEntities.name,
                    });

                if (mapEntity.type === EntityTypes.NPC) {
                    createEntityNpc({
                        entityName: mapEntity.name,
                        positionX: mapEntity.x,
                        positionY: mapEntity.y,
                        spritePath: `npc_${mapEntity.name.toLowerCase()}`,
                        triggerPriority: entityData.priority,
                    });
                }
                else if (mapEntity.type === EntityTypes.RESOURCE_CRAFT) {
                    createEntityResourceCraft({
                        entityName: mapEntity.name,
                        positionX: mapEntity.x,
                        positionY: mapEntity.y,
                        spritePath: `resource_${mapEntity.name.toLowerCase()}`,
                        triggerPriority: entityData.priority,
                    });
                }
            }
            else if (mapEntity.items) {
                if (mapEntity.type === EntityTypes.RESOURCE_ITEM) {
                    createEntityResourceItem({
                        entityName: mapEntity.type,
                        positionX: mapEntity.x,
                        positionY: mapEntity.y,
                        resourceItems: mapEntity.items,
                    });
                }
                else if (mapEntity.type === EntityTypes.RESOURCE_BUG) {
                    createEntityResourceBug({
                        entityName: mapEntity.type,
                        positionX: mapEntity.x,
                        positionY: mapEntity.y,
                        resourceItems: mapEntity.items,
                    });
                }
                else if (mapEntity.type === EntityTypes.RESOURCE_FISH) {
                    createEntityResourceFish({
                        entityName: mapEntity.type,
                        positionX: mapEntity.x,
                        positionY: mapEntity.y,
                        resourceItems: mapEntity.items,
                    });
                }
            }
            else {
                throw error({ message: 'Invalid entity data', where: generateTileMapEntities.name });
            }
        }
    }

    const { entities, entityIds } = findEntitiesByMap({ tileMapName: tileMapData.name });
    for (const entity of entities) {
        const entityId = entityIds[entities.indexOf(entity)];

        if (checkComponent({ componentId: 'State', entityId })) {
            const state = getComponent({ componentId: 'State', entityId });
            if (!(state._load)) {
                setEntityLoad({ entityId, value: true });
                setTile({ entityId, tileMapEntityId });
                continue;
            }
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
            setEntityLoad({ entityId, value: false });

            destroyTileMap({ tileMapEntityId });
            generateTileMap({ tileMapName: exit._targetMap });
            updatePosition({ entityId, target: exit._direction, x: exit.targetPosition._x, y: exit.targetPosition._y });
            setTile({ entityId, tileMapEntityId });

            setEntityLoad({ entityId, value: true });

            return true;
        }
    }

    return false;
};

export const destroyTileMap = ({ tileMapEntityId }: { tileMapEntityId?: string | null }) => {
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
