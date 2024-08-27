import {
    addSprite,
    addPosition,
    addInventory,
    addTileMap,
    addResourceItem,
    addTrigger,
    addResourceBug,
    addCollider,
    addResourceFish,
    addDialog,
    addResourceCraft,
    addManager,
    addEnergy,
} from './component';

import { createEntity, MANAGER_ENTITY_NAME, PLAYER_ENTITY_NAME, TILEMAP_ENTITY_NAME } from '@/engine/entities';
import { generateTileMap, setTile } from '@/engine/systems/tilemap';

export const createEntityManager = () => {
    const entityId = createEntity({ entityName: MANAGER_ENTITY_NAME });

    addManager({ entityId });
};

export const createEntityPlayer = ({
    spriteHeight = 2,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    inventoryMaxSlots = 20,
    energyMax = 10,
}: {
    energyMax?: number
    inventoryMaxSlots?: number,
    positionX: number,
    positionY: number,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number,
}) => {
    const entityId = createEntity({ entityName: PLAYER_ENTITY_NAME });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
    addPosition({ entityId, x: positionX, y: positionY });
    addInventory({ entityId, maxSlots: inventoryMaxSlots });
    addEnergy({ current: energyMax, entityId, max: energyMax });

    setTile({ entityId });
};

export const createEntityTileMap = ({ tileMapName }: { tileMapName: string }) => {
    const entityId = createEntity({ entityName: TILEMAP_ENTITY_NAME });

    addTileMap({ entityId });

    generateTileMap({ tileMapName });
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
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resoureceItemName: string,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
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
    positionX: number,
    positionY: number,
    resourceActivityBugMaxHp: number,
    resourceActivityBugMaxNbErrors: number,
    resourceActivityBugSymbolInterval: number,
    resourceIsTemporary?: boolean,
    resoureceItemName: string,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourceBug({
        entityId,
        isTemporary: resourceIsTemporary,
        itemName: resoureceItemName,
        maxHp: resourceActivityBugMaxHp,
        maxNbErrors: resourceActivityBugMaxNbErrors,
        symbolInterval: resourceActivityBugSymbolInterval,
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
    positionX: number,
    positionY: number,
    resourceActivityFishDamage: number,
    resourceActivityFishFrenzyDuration: number,
    resourceActivityFishFrenzyInterval: number,
    resourceActivityFishMaxHp: number,
    resourceActivityFishRodDamage: number,
    resourceActivityFishRodMaxTension: number,
    resourceIsTemporary?: boolean,
    resoureceItemName: string,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourceFish({
        entityId,
        fishDamage: resourceActivityFishDamage,
        fishMaxHp: resourceActivityFishMaxHp,
        frenzyDuration: resourceActivityFishFrenzyDuration,
        frenzyInterval: resourceActivityFishFrenzyInterval,
        isTemporary: resourceIsTemporary,
        itemName: resoureceItemName,
        rodDamage: resourceActivityFishRodDamage,
        rodMaxTension: resourceActivityFishRodMaxTension,
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
    positionX: number,
    positionY: number,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
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
    positionX: number,
    positionY: number,
    resourceIsTemporary?: boolean,
    resourceMaxNbErrors?: number,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number
}) => {
    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
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
