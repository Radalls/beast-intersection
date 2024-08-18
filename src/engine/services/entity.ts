import { createEntity, PLAYER_ENTITY_NAME, TILEMAP_ENTITY_NAME } from "../entities/entity.manager";
import { generateTileMap, setTile } from "../systems/tilemap/tilemap";
import { addSprite, addPosition, addInventory, addTileMap, addResourceItem, addTrigger, addResourceBug, addCollider, addResourceFish, addDialog, addResourceCraft } from "./component";

export const createEntityPlayer = ({
    spriteHeight = 2,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    inventoryMaxSlots = 20
}: {
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
    inventoryMaxSlots?: number,
}) => {
    const entityId = createEntity({ entityName: PLAYER_ENTITY_NAME });

    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addInventory({ entityId, maxSlots: inventoryMaxSlots });

    setTile({ entityId });
};

export const createEntityTileMap = async ({ tileMapPath }: { tileMapPath: string }) => {
    const entityId = createEntity({ entityName: TILEMAP_ENTITY_NAME });

    addTileMap({ entityId });

    await generateTileMap({ tileMapPath });
};

export const createEntityResourceItem = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    resourceIsTemporary = false,
    resoureceItemName,
}: {
    entityName: string,
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resoureceItemName: string,
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourceItem({
        entityId,
        isTemporary: resourceIsTemporary,
        itemName: resoureceItemName,
    });
    addTrigger({ entityId });

    setTile({ entityId });
};

export const createEntityResourceBug = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    resourceIsTemporary = false,
    resourceActivityBugMaxHp,
    resourceActivityBugMaxNbErrors,
    resourceActivityBugSymbolInterval,
    resoureceItemName,
}: {
    entityName: string,
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resourceActivityBugMaxHp: number,
    resourceActivityBugMaxNbErrors: number,
    resourceActivityBugSymbolInterval: number,
    resoureceItemName: string,
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourceBug({
        entityId,
        isTemporary: resourceIsTemporary,
        maxHp: resourceActivityBugMaxHp,
        maxNbErrors: resourceActivityBugMaxNbErrors,
        symbolInterval: resourceActivityBugSymbolInterval,
        itemName: resoureceItemName,
    });
    addTrigger({ entityId });

    setTile({ entityId });
};

export const createEntityResourceFish = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    resourceIsTemporary = false,
    resourceActivityFishDamage,
    resourceActivityFishMaxHp,
    resourceActivityFishFrenzyDuration,
    resourceActivityFishFrenzyInterval,
    resourceActivityFishRodDamage,
    resourceActivityFishRodMaxTension,
    resoureceItemName,
}: {
    entityName: string,
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resourceActivityFishDamage: number,
    resourceActivityFishMaxHp: number,
    resourceActivityFishFrenzyDuration: number,
    resourceActivityFishFrenzyInterval: number,
    resourceActivityFishRodDamage: number,
    resourceActivityFishRodMaxTension: number,
    resoureceItemName: string,
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourceFish({
        entityId,
        isTemporary: resourceIsTemporary,
        fishDamage: resourceActivityFishDamage,
        fishMaxHp: resourceActivityFishMaxHp,
        frenzyDuration: resourceActivityFishFrenzyDuration,
        frenzyInterval: resourceActivityFishFrenzyInterval,
        rodDamage: resourceActivityFishRodDamage,
        rodMaxTension: resourceActivityFishRodMaxTension,
        itemName: resoureceItemName,
    });
    addCollider({ entityId });
    addTrigger({
        entityId,
        points: [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
    });

    setTile({ entityId });
};

export const createEntityNpc = ({
    entityName,
    spriteHeight = 2,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
}: {
    entityName: string,
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addDialog({ entityId });
    addCollider({ entityId });
    addTrigger({
        entityId,
        points: [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
    });

    setTile({ entityId });
};

export const createEntityResourceCraft = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    resourceIsTemporary = false,
    resourceMaxNbErrors = 0,
}: {
    entityName: string,
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resourceMaxNbErrors?: number,
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourceCraft({ entityId, isTemporary: resourceIsTemporary, maxNbErrors: resourceMaxNbErrors });
    addCollider({ entityId });
    addTrigger({
        entityId,
        points: [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
    });

    setTile({ entityId });
};
