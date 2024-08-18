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
export const loadTileMapData = async ({ tileMapPath }: { tileMapPath: string }) => {
    try {
        const { default: tileMapData } = await import(`../../../assets/maps/${tileMapPath.toLowerCase()}.json`);

        return tileMapData as TileMapData;
    } catch (e) {
        console.error(e);
    }
};

export const loadTileMapEntityData = async ({ entityType, entityName }: {
    entityName: string,
    entityType: string
}) => {
    try {
        const { default: entityTypeData } = await import(
            `../../../assets/entities/${entityType.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()}.json`,
        );
        const entityData = entityTypeData.find((e: any) => e.name === entityName);

        return entityData as EntityData;
    } catch (e) {
        console.error(e);
    }
};
//#endregion
