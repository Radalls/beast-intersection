import tileMapData from "./mock-map.json";

//#region TYPES
export type TileMapData = {
    id: number,
    name: string,
    width: number,
    height: number,
    tiles: {
        sprite: string,
        x: number,
        y: number
    }[],
    entities: {
        type: string,
        name: string,
        x: number,
        y: number
    }[],
};

export type EntityData = {
    type: string,
    name: string,
    data?: any,
};

export enum EntityDataTypes {
    PLAYER = 'Player',
    NPC = 'Npc',
    RESOURCE_ITEM = 'ResourceItem',
    RESOURCE_BUG = 'ResourceBug',
    RESOURCE_FISH = 'ResourceFish',
    RESOURCE_CRAFT = 'ResourceCraft',
}
//#endregion

//#region DATA
export const loadTileMapData = async () => tileMapData as TileMapData;

export const loadTileMapEntityData = async () => {
    const mockEntityData: EntityData = {
        type: 'Player',
        name: 'Player',
    }

    return mockEntityData;
};
//#endregion
