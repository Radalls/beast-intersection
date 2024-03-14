import { createEntity, PLAYER_ENTITY_ID, TILEMAP_ENTITY_ID } from "../entities/entity.manager";
import { loadDialog } from "../systems/dialog/dialog";
import { generateTiles, setTile } from "../systems/tilemap/tilemap";
import { addSprite, addPosition, addInventory, addTileMap, addResourcePickUp, addTrigger, addResourceBug, addCollider, addResourceFish, addDialog } from "./component";

export const createEntityPlayer = ({
    spriteHeight = 2,
    spriteWidth = 1,
    spritePath,
    inventoryMaxSlots = 20
}: {
    spriteHeight?: number,
    spriteWidth?: number,
    spritePath: string,
    inventoryMaxSlots?: number,
}) => {
    const playerEntityId = createEntity(PLAYER_ENTITY_ID);
    addSprite({ entityId: playerEntityId, height: spriteHeight, width: spriteWidth, image: spritePath });
    addPosition({ entityId: playerEntityId });
    addInventory({ entityId: playerEntityId, maxSlots: inventoryMaxSlots });
    setTile({ entityId: playerEntityId });
};

export const createEntityTileMap = () => {
    const tilemapEntityId = createEntity(TILEMAP_ENTITY_ID);
    addTileMap({ entityId: tilemapEntityId });
    generateTiles({});
};

export const createEntityResourcePickUp = ({
    entityId,
    spritePath,
    positionX,
    positionY,
    resourceIsTemporary = false,
    resoureceItemName,
}: {
    entityId: string,
    spritePath: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resoureceItemName: string,
}) => {
    const stickEntityId = createEntity(entityId);
    addSprite({ entityId: stickEntityId, image: spritePath });
    addPosition({ entityId: stickEntityId, x: positionX, y: positionY });
    addResourcePickUp({
        entityId: stickEntityId,
        isTemporary: resourceIsTemporary,
        itemName: resoureceItemName,
    });
    addTrigger({ entityId: stickEntityId });
    setTile({ entityId: stickEntityId });
};

export const createEntityResourceBug = ({
    entityId,
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
    spritePath: string,
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resourceActivityBugMaxHp: number,
    resourceActivityBugMaxNbErrors: number,
    resourceActivityBugSymbolInterval: number,
    resoureceItemName: string,
}) => {
    const butterflyEntityId = createEntity(entityId);
    addSprite({ entityId: butterflyEntityId, image: spritePath });
    addPosition({ entityId: butterflyEntityId, x: positionX, y: positionY });
    addResourceBug({
        entityId: butterflyEntityId,
        isTemporary: resourceIsTemporary,
        maxHp: resourceActivityBugMaxHp,
        maxNbErrors: resourceActivityBugMaxNbErrors,
        symbolInterval: resourceActivityBugSymbolInterval,
        itemName: resoureceItemName,
    });
    addTrigger({ entityId: butterflyEntityId });
    setTile({ entityId: butterflyEntityId });
};

export const createEntityResourceFish = ({
    entityId,
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
    const fishEntityId = createEntity(entityId);
    addSprite({ entityId: fishEntityId, image: spritePath });
    addPosition({ entityId: fishEntityId, x: positionX, y: positionY });
    addResourceFish({
        entityId: fishEntityId,
        isTemporary: resourceIsTemporary,
        fishDamage: resourceActivityFishDamage,
        fishMaxHp: resourceActivityFishMaxHp,
        frenzyDuration: resourceActivityFishFrenzyDuration,
        frenzyInterval: resourceActivityFishFrenzyInterval,
        rodDamage: resourceActivityFishRodDamage,
        rodMaxTension: resourceActivityFishRodMaxTension,
        itemName: resoureceItemName,
    });
    addCollider({ entityId: fishEntityId });
    addTrigger({
        entityId: fishEntityId,
        points: [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
    });
    setTile({ entityId: fishEntityId });
};

export const createEntityNpc = ({
    entityId,
    spritePath,
    positionX,
    positionY,
}: {
    entityId: string,
    spritePath: string,
    positionX: number,
    positionY: number,
}) => {
    const npcEntityId = createEntity(entityId);
    addSprite({ entityId: npcEntityId, height: 2, image: spritePath });
    addPosition({ entityId: npcEntityId, x: positionX, y: positionY });
    addDialog({ entityId: npcEntityId });
    loadDialog({ entityId: npcEntityId });
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
