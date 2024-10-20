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
    addResourcePlace,
} from './component';

import { Energy } from '@/engine/components/energy';
import { Inventory } from '@/engine/components/inventory';
import { Manager } from '@/engine/components/manager';
import { Position } from '@/engine/components/position';
import { createEntity, MANAGER_ENTITY_NAME, PLAYER_ENTITY_NAME, TILEMAP_ENTITY_NAME } from '@/engine/entities';
import { getStore } from '@/engine/services/store';
import { generateTileMap, setTile } from '@/engine/systems/tilemap';

//#region SERVICES
export const createEntityTileMap = ({ tileMapName }: { tileMapName: string }) => {
    const entityId = createEntity({ entityName: TILEMAP_ENTITY_NAME });

    addTileMap({ entityId, tileMapName });

    generateTileMap({ tileMapName });
};

export const createEntityManager = ({ savedManager, managerEntityId }: {
    managerEntityId?: string | null,
    savedManager?: Manager,
}) => {
    if (!(managerEntityId)) managerEntityId = getStore('managerId')
        ?? createEntity({ entityName: MANAGER_ENTITY_NAME });

    addManager({ entityId: managerEntityId, savedManager });
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
    const entityId = createEntity({ entityName: PLAYER_ENTITY_NAME });

    addState({ entityId, load: true });
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

    addState({ active: false, entityId, load: true });
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
    positionX,
    positionY,
    resourceItems,
    stateCooldown = true,
}: {
    entityName: string,
    positionX: number,
    positionY: number,
    resourceItems: { name: string, rate: number }[],
    spriteHeight?: number,
    spriteWidth?: number,
    stateCooldown?: boolean,
}) => {
    const entityId = createEntity({ entityName });

    addState({
        cooldown: (stateCooldown)
            ? false
            : undefined,
        entityId,
        load: true,
    });
    const { resource, resourceData } = addResourceItem({
        entityId,
        items: resourceItems,
    });

    addSprite({
        entityId,
        height: spriteHeight,
        image: `resource_${resource.item?.info._name.toLowerCase()}`,
        width: spriteWidth,
    });
    addPosition({ entityId, x: positionX, y: positionY });
    addTrigger({ entityId, priority: resourceData.priority });

    setTile({ entityId });
};

export const createEntityResourceBug = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    positionX,
    positionY,
    resourceItems,
}: {
    entityName: string,
    positionX: number,
    positionY: number,
    resourceItems: { name: string, rate: number }[],
    spriteHeight?: number,
    spriteWidth?: number,
}) => {
    const entityId = createEntity({ entityName });

    addState({ cooldown: false, entityId, load: true });
    const { resourceData } = addResourceBug({
        entityId,
        items: resourceItems,
    });

    addSprite({
        entityId,
        gif: true,
        height: spriteHeight,
        image: 'resource_bug',
        width: spriteWidth,
    });
    addPosition({ entityId, x: positionX, y: positionY });
    addTrigger({ entityId, priority: resourceData.priority });

    setTile({ entityId });
};

export const createEntityResourceFish = ({
    entityName,
    spriteHeight = 1,
    spriteWidth = 1,
    positionX,
    positionY,
    resourceItems,
}: {
    entityName: string,
    positionX: number,
    positionY: number,
    resourceItems: { name: string, rate: number }[],
    spriteHeight?: number,
    spriteWidth?: number,
}) => {
    const entityId = createEntity({ entityName });

    addState({ cooldown: false, entityId, load: true });
    const { resourceData } = addResourceFish({
        entityId,
        items: resourceItems,
    });

    addSprite({ entityId, gif: true, height: spriteHeight, image: 'resource_fish', width: spriteWidth });
    addPosition({ entityId, x: positionX, y: positionY });
    addCollider({ entityId });
    addTrigger({
        entityId,
        points: [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
        priority: resourceData.priority,
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

    addState({ entityId, load: true });
    addResourceCraft({ entityId });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
    addPosition({ entityId, x: positionX, y: positionY });
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

export const createEntityResourcePlace = ({
    entityName,
    itemName,
    spriteHeight = 1,
    spriteWidth = 1,
    spritePath,
    positionX,
    positionY,
    stateActive = false,
    triggerPriority = 0,
}: {
    entityName: string,
    itemName: string,
    positionX: number,
    positionY: number,
    spriteHeight?: number,
    spritePath: string,
    spriteWidth?: number,
    stateActive?: boolean
    triggerPriority?: number,
}) => {
    const entityId = createEntity({ entityName });

    addState({
        active: (stateActive)
            ? false
            : undefined,
        entityId,
        load: true,
    });
    addResourcePlace({ entityId, itemName });

    addSprite({ entityId, height: spriteHeight, image: spritePath, width: spriteWidth });
    addPosition({ entityId, x: positionX, y: positionY });
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
