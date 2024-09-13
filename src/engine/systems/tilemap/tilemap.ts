import { loadTileMapData } from './tilemap.data';
import {
    generateTileMapTiles,
    generateTileMapEntities,
    findTileByPosition,
    findTileByEntityId,
    getTargetXY,
    exitTile,
    soundTile,
} from './tilemap.utils';

import { getComponent, checkComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { setState } from '@/engine/services/state';
import { getStore } from '@/engine/services/store';
import { setCollider, checkCollider } from '@/engine/systems/collider';
import { updatePosition } from '@/engine/systems/position';
import { setTrigger } from '@/engine/systems/trigger';
import { event } from '@/render/events';

//#region SYSTEMS
export const generateTileMap = ({ tileMapEntityId, tileMapName }: {
    tileMapEntityId?: string | null
    tileMapName: string,
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: generateTileMap.name });

    setState('isGameLoading', true);
    event({ type: EventTypes.MAIN_LOADING_ON });

    const tileMap = getComponent({ componentId: 'TileMap', entityId: tileMapEntityId });

    const tileMapData = loadTileMapData({ tileMapName })
        ?? error({ message: `TileMapData for ${tileMapName} not found`, where: generateTileMap.name });

    tileMap._name = tileMapData.name;
    tileMap._height = tileMapData.height;
    tileMap._width = tileMapData.width;

    event({ type: EventTypes.TILEMAP_CREATE });

    generateTileMapTiles({ tileMapData, tileMapEntityId });
    generateTileMapEntities({ tileMapData });

    setState('isGameLoading', false);

    event({ type: EventTypes.MAIN_LOADING_OFF });
};

export const setTile = ({ tileMapEntityId, entityId }: {
    entityId: string,
    tileMapEntityId?: string | null
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: setTile.name });

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

export const updateTile = ({ tileMapEntityId, entityId, target }: {
    entityId?: string | null,
    target: 'up' | 'down' | 'left' | 'right',
    tileMapEntityId?: string | null
}) => {
    if (!(tileMapEntityId)) tileMapEntityId = getStore('tileMapId')
        ?? error({ message: 'Store tileMapId is undefined', where: updateTile.name });

    if (!(entityId)) entityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: updateTile.name });

    const entityPosition = getComponent({ componentId: 'Position', entityId });

    const entityTile = findTileByEntityId({ entityId })
        ?? error({ message: `Tile for entity ${entityId} not found`, where: updateTile.name });

    const { targetX, targetY } = getTargetXY({ target, x: entityPosition._x, y: entityPosition._y });

    if (entityTile.exits) {
        const isExit = exitTile({ entityId, targetX, targetY, tileMapEntityId });

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
    soundTile({ entityId });
};
//#endregion
