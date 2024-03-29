import { createEntity, PLAYER_ENTITY_ID, TILEMAP_ENTITY_ID } from "../entities/entity.manager";
import { setTile } from "../systems/tilemap/tilemap";
import { addSprite, addPosition, addInventory, addTileMap, addResourcePickUp, addTrigger, addResourceBug, addCollider, addResourceFish, addDialog, addResourceCraft } from "./component";

export const createEntityPlayer = ({
    spriteHeight = 2,
    spriteWidth = 1,
    spritePath,
    positionX = 0,
    positionY = 0,
    inventoryMaxSlots = 20
}: {
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX?: number,
    positionY?: number,
    inventoryMaxSlots?: number,
}) => {
    const entityId = PLAYER_ENTITY_ID;
    createEntity(entityId);
    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addInventory({ entityId, maxSlots: inventoryMaxSlots });
    setTile({ entityId });
};

export const createEntityTileMap = () => {
    const entityId = TILEMAP_ENTITY_ID;
    createEntity(entityId);
    addTileMap({ entityId });
};

export const createEntityResourcePickUp = ({
    entityId,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    resourceIsTemporary = false,
    resoureceItemName,
}: {
    entityId: string,
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resoureceItemName: string,
}) => {
    createEntity(entityId);
    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourcePickUp({
        entityId,
        isTemporary: resourceIsTemporary,
        itemName: resoureceItemName,
    });
    addTrigger({ entityId });
    setTile({ entityId });
};

export const createEntityResourceBug = ({
    entityId,
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
    entityId: string,
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
    createEntity(entityId);
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
    entityId,
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
    entityId: string,
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
    createEntity(entityId);
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
    entityId,
    spriteHeight = 2,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
}: {
    entityId: string,
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
}) => {
    const npcEntityId = createEntity(entityId);
    addSprite({ entityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId, x: positionX, y: positionY });
    addDialog({ entityId: npcEntityId });
    addCollider({ entityId: npcEntityId });
    addTrigger({
        entityId: npcEntityId,
        points: [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
    });
    setTile({ entityId: npcEntityId });
};

export const createEntityResourceCraft = ({
    entityId,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    resourceIsTemporary = false,
    resourceMaxNbErrors,
}: {
    entityId: string,
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resourceMaxNbErrors: number,
}) => {
    createEntity(entityId);
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
