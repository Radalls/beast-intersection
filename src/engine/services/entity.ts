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
    addState,
} from './component';

import { Energy } from '@/engine/components/energy';
import { Inventory } from '@/engine/components/inventory';
import { Manager } from '@/engine/components/manager';
import { Position } from '@/engine/components/position';
import { createEntity, MANAGER_ENTITY_NAME, PLAYER_ENTITY_NAME, TILEMAP_ENTITY_NAME } from '@/engine/entities';
import { getStore } from '@/engine/services/store';
import {
    isSecretRun,
    createEntityPlayerSecret,
    createEntityResourceItemSecret,
    createEntityResourceFishSecret,
} from '@/engine/systems/manager';
import { generateTileMap, setTile } from '@/engine/systems/tilemap';

//#region SERVICES
export const createEntityTileMap = ({ tileMapName }: { tileMapName: string }) => {
    const entityId = createEntity({ entityName: TILEMAP_ENTITY_NAME });

    addTileMap({ entityId });

    generateTileMap({ tileMapName });
};

export const createEntityManager = ({ savedManager }: { savedManager?: Manager }) => {
    const entityId = getStore('managerId') ?? createEntity({ entityName: MANAGER_ENTITY_NAME });

    addManager({ entityId, savedManager });
};

export const createEntityPlayer = ({
    spriteHeight = 2,
    spriteWidth = 1,
    spritePath,
    positionX = 0,
    positionY = 0,
    inventoryMaxSlots = 10,
    energyMax = 10,
    savedPosition,
    savedInventory,
    savedEnergy,
}: {
    energyMax?: number
    inventoryMaxSlots?: number,
    positionX?: number,
    positionY?: number,
    savedEnergy?: Energy,
    savedInventory?: Inventory,
    savedPosition?: Position,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number,
}) => {
    if (isSecretRun()) {
        createEntityPlayerSecret({
            energyMax,
            inventoryMaxSlots,
            positionX,
            positionY,
            savedEnergy,
            savedInventory,
            savedPosition,
            spriteHeight,
            spritePath,
            spriteWidth,
        });

        return;
    }

    const entityId = createEntity({ entityName: PLAYER_ENTITY_NAME });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
    addPosition({ entityId, savedPosition, x: positionX, y: positionY });
    addInventory({ entityId, maxSlots: inventoryMaxSlots, savedInventory });
    addEnergy({ current: energyMax, entityId, max: energyMax, savedEnergy });

    setTile({ entityId });
};

export const createEntityNpc = ({
    entityName,
    spriteHeight = 2,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    triggerPriority = 0,
}: {
    entityName: string,
    positionX: number,
    positionY: number,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number,
    triggerPriority?: number,
}) => {
    const entityId = createEntity({ entityName });

    addState({ entityId });
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
        priority: triggerPriority,
    });

    setTile({ entityId });
};

export const createEntityResourceItem = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    triggerPriority = 0,
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
    spriteWidth?: number,
    triggerPriority?: number,
}) => {
    if (isSecretRun()) {
        createEntityResourceItemSecret({
            entityName,
            positionX,
            positionY,
            resourceIsTemporary,
            resoureceItemName,
            spriteHeight,
            spritePath,
            spriteWidth,
            triggerPriority,
        });

        return;
    }

    const entityId = createEntity({ entityName });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
    addPosition({ entityId, x: positionX, y: positionY });
    addResourceItem({
        entityId,
        isTemporary: resourceIsTemporary,
        itemName: resoureceItemName,
    });
    addTrigger({ entityId, priority: triggerPriority });

    setTile({ entityId });
};

export const createEntityResourceBug = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    triggerPriority = 0,
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
    spriteWidth?: number,
    triggerPriority?: number,
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
    addTrigger({ entityId, priority: triggerPriority });

    setTile({ entityId });
};

export const createEntityResourceFish = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    triggerPriority = 0,
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
    spriteWidth?: number,
    triggerPriority?: number,
}) => {
    if (isSecretRun()) {
        createEntityResourceFishSecret({
            entityName,
            positionX,
            positionY,
            resourceActivityFishDamage,
            resourceActivityFishFrenzyDuration,
            resourceActivityFishFrenzyInterval,
            resourceActivityFishMaxHp,
            resourceActivityFishRodDamage,
            resourceActivityFishRodMaxTension,
            resourceIsTemporary,
            resoureceItemName,
            spriteHeight,
            spritePath,
            spriteWidth,
            triggerPriority,
        });

        return;
    }

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
        priority: triggerPriority,
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
    triggerPriority = 0,
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
    spriteWidth?: number,
    triggerPriority?: number,
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
        priority: triggerPriority,
    });

    setTile({ entityId });
};
//#endregion
