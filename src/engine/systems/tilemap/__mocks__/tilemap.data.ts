import tileMapData from './mock-map.json';

//#region TYPES
export type TileMapData = {
    entities: {
        name: string,
        type: string,
        x: number,
        y: number
    }[],
    height: number,
    id: number,
    name: string,
    tiles: {
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
export const loadTileMapData = async () => tileMapData as TileMapData;

export const loadTileMapEntityData = async () => {
    const mockEntityData: EntityData = {
        name: 'Player',
        type: 'Player',
    };

    return mockEntityData;
};
//#endregion
