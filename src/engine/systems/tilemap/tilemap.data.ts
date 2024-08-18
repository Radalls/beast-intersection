//#region TYPES
export type TileMapData = {
    id: number,
    name: string,
    width: number,
    height: number,
    tiles: {
        sprite: string,
        x: number,
        y: number,
        solid?: boolean,
    }[],
    entities: {
        type: string,
        name: string,
        x: number,
        y: number,
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
export const loadTileMapData = async ({ tileMapPath }: { tileMapPath: string }) => {
    try {
        const { default: tileMapData } = await import(`../../../assets/maps/${tileMapPath.toLowerCase()}.json`);

        return tileMapData as TileMapData;
    } catch (e) {
        console.error(e);
    }
};

export const loadTileMapEntityData = async ({ entityType, entityName }: {
    entityType: string,
    entityName: string
}) => {
    try {
        const { default: entityTypeData } = await import(`../../../assets/entities/${entityType.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()}.json`);
        const entityData = entityTypeData.find((e: any) => e.name === entityName);

        return entityData as EntityData;
    } catch (e) {
        console.error(e);
    }
};
//#endregion
