import { error } from '@/engine/services/error';

const tileMapFiles: Record<string, { default: TileMapData }>
    = import.meta.glob('../../../assets/maps/*.json', { eager: true });
const entityFiles: Record<string, { default: EntityData[] }>
    = import.meta.glob('../../../assets/entities/*.json', { eager: true });

//#region TYPES
export type TileMapData = {
    entities: {
        name: string,
        type: string,
        x: number,
        y: number,
    }[],
    height: number,
    id: number,
    name: string,
    tiles: {
        exits?: {
            direction: 'up' | 'down' | 'left' | 'right',
            map: string,
            x: number,
            y: number
        }[],
        solid?: boolean,
        sprite: string,
        x: number,
        y: number
    }[],
    width: number
};

export type EntityData = {
    data?: any,
    name: string,
    type: string
};

export enum EntityDataTypes {
    NPC = 'Npc',
    PLAYER = 'Player',
    RESOURCE_BUG = 'ResourceBug',
    RESOURCE_CRAFT = 'ResourceCraft',
    RESOURCE_FISH = 'ResourceFish',
    RESOURCE_ITEM = 'ResourceItem'
}
//#endregion

//#region DATA
export const loadTileMapData = ({ tileMapName }: { tileMapName: string }) => {
    const tileMapPath = `../../../assets/maps/${tileMapName.toLowerCase()}.json`;
    const tileMapData = tileMapFiles[tileMapPath].default
        ?? error({ message: `TileMapData for ${tileMapName} not found`, where: loadTileMapData.name });

    return tileMapData as TileMapData;
};

export const loadTileMapEntityData = ({ entityType, entityName }: {
    entityName: string,
    entityType: string
}) => {
    const entityTypePath
        = `../../../assets/entities/${entityType.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()}.json`;
    const entityTypeData = entityFiles[entityTypePath].default
        ?? error({
            message: `EntityData for ${entityType} not found`,
            where: loadTileMapEntityData.name,
        });

    const entityData = entityTypeData.find((e) => e.name === entityName)
        ?? error({
            message: `EntityData for ${entityType} ${entityName} not found`,
            where: loadTileMapEntityData.name,
        });

    return entityData as EntityData;
};
//#endregion
