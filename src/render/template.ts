import { Sprite } from "../engine/components/sprite";
import { app } from "./main";
import { Position } from '../engine/components/position';
import { Tile, TileMap } from "../engine/components/tilemap";
import { Inventory } from "../engine/components/inventory";
import { ActivityBugData, Resource } from "../engine/components/resource";

//#region CONSTANTS
const spritePath = new URL('../assets/sprites', import.meta.url).pathname;

const TILE_PIXEL_SIZE = 64;

const INVENTORY_SLOT_SIZE = 64;
const INVENTORY_SLOTS_PER_ROW = 7;
//#endregion

//#region HELPERS
const getSpritePath = (spriteName: string) => {
    const spriteFolderPath = spriteName.replace(/^(.*?)(\/[^\/]+)?(\.[^\.\/]+)?$/, '$1').split('_')[0];
    return `${spritePath}/${spriteFolderPath}/${spriteName}`;
}
//#endregion

//#region TEMPLATE
const getEntity = ({ entityId }: { entityId: string }) => {
    const entity = document.getElementById(entityId);
    if (!(entity)) {
        throw new Error(`Entity ${entityId} not found.`);
    }

    return entity;
}

const checkEntity = ({ entityId }: { entityId: string }) => {
    return document.getElementById(entityId) !== null;
}

export const createEntity = ({ entityId, htmlId, htmlClass, htmlParent, htmlAbsolute = true }: {
    entityId: string,
    htmlId?: string,
    htmlClass?: string,
    htmlParent?: HTMLElement,
    htmlAbsolute?: boolean,
}) => {
    const entity = document.createElement('div');

    entity.setAttribute('id', htmlId ?? entityId);
    entity.setAttribute('class', htmlClass ?? entityId.toLowerCase());

    entity.style.position = htmlAbsolute ? 'absolute' : 'relative';

    const parent = htmlParent ?? app;
    parent.appendChild(entity);

    return entity;
};

export const destroyEntity = ({ entityId }: { entityId: string }) => {
    const entity = getEntity({ entityId });

    entity.remove();
};

export const createInventory = ({ entityId, inventory }: {
    entityId: string,
    inventory: Pick<Inventory, '_maxSlots'>,
}) => {
    const entityInventory = createEntity({
        entityId,
        htmlId: `${entityId}-inventory`,
        htmlClass: 'inventory',
    });

    const inventoryWidth = INVENTORY_SLOTS_PER_ROW * INVENTORY_SLOT_SIZE + (INVENTORY_SLOTS_PER_ROW - 1) * 2;
    entityInventory.style.width = `${inventoryWidth}px`;
    const inventoryHeight = (Math.ceil(inventory._maxSlots / INVENTORY_SLOTS_PER_ROW)) * INVENTORY_SLOT_SIZE;
    entityInventory.style.height = `${inventoryHeight}px`;

    for (let i = 0; i < inventory._maxSlots; i++) {
        createEntity({
            entityId,
            htmlId: `${entityId}-inventory-slot-${i}`,
            htmlClass: 'inventory-slot',
            htmlParent: entityInventory,
            htmlAbsolute: false,
        });
    }
}

export const displayInventory = ({ entityId }: { entityId: string }) => {
    const entityInventory = getEntity({ entityId: `${entityId}-inventory` });

    entityInventory.style.display = (entityInventory.style.display === 'flex') ? 'none' : 'flex';
}

export const updateInventory = ({ entityId, inventory }: {
    entityId: string,
    inventory: Pick<Inventory, 'slots'>,
}) => {
    for (const slot of inventory.slots) {
        const entityInventorySlot = getEntity({ entityId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}` });

        entityInventorySlot.style.backgroundImage = `url(${getSpritePath(slot.item.sprite._image)})`;

        const entityInventorySlotAmount = createEntity({
            entityId,
            htmlId: `${entityId}-inventory-slot-${inventory.slots.indexOf(slot)}-amount`,
            htmlClass: 'inventory-slot-amount',
            htmlParent: entityInventorySlot,
        });

        entityInventorySlotAmount.textContent = `x${slot._amount.toString()}`;
    }
}

export const updatePosition = ({ entityId, position, sprite }: {
    entityId: string,
    position: Pick<Position, '_x' | '_y'>,
    sprite: Pick<Sprite, '_height' | '_width'>,
}) => {
    const entity = getEntity({ entityId });

    entity.style.left = `${position._x * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE}px`;
    entity.style.top = `${position._y * TILE_PIXEL_SIZE + TILE_PIXEL_SIZE - ((sprite._height - 1) * TILE_PIXEL_SIZE)}px`;
    entity.style.zIndex = `${position._y}`;
};

export const createSprite = ({ entityId, sprite }: {
    entityId: string,
    sprite: Pick<Sprite, '_image' | '_width' | '_height'>,
}) => {
    const entity = getEntity({ entityId });

    entity.style.backgroundImage = `url(${getSpritePath(sprite._image)})`;
    entity.style.width = `${sprite._width * TILE_PIXEL_SIZE}px`;
    entity.style.height = `${sprite._height * TILE_PIXEL_SIZE}px`;
};

export const createTileMap = ({ tilemapEntityId, tilemap }: {
    tilemapEntityId: string,
    tilemap: Pick<TileMap, '_height' | '_width'>,
}) => {
    const tilemapEntity = getEntity({ entityId: tilemapEntityId });

    tilemapEntity.style.width = `${tilemap._width * TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.height = `${tilemap._height * TILE_PIXEL_SIZE}px`;
};

export const createTileMapTile = ({ tilemapEntityId, tile }: {
    tilemapEntityId: string,
    tile: Pick<Tile, 'position' | 'sprite'>,
}) => {
    const tilemapEntity = getEntity({ entityId: tilemapEntityId });

    const tileEntity = createEntity({
        entityId: tilemapEntityId,
        htmlId: `${tilemapEntityId}-tile-${tile.position._x}-${tile.position._y}`,
        htmlClass: "tile",
        htmlParent: tilemapEntity,
    });

    tileEntity.style.left = `${tile.position._x * TILE_PIXEL_SIZE}px`;
    tileEntity.style.top = `${tile.position._y * TILE_PIXEL_SIZE}px`;
    tileEntity.style.backgroundImage = `url(${getSpritePath(tile.sprite._image)})`;
};

export const winActivity = ({ activityEntityId, activityItem }: {
    activityEntityId: string,
    activityItem: Resource['item'],
}) => {
    const activityEntityWin = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-win`,
        htmlClass: "activity-win",
    });

    activityEntityWin.textContent = `You get ${activityItem.info._name}!`;
}

export const endActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    if (checkEntity({ entityId: `${activityEntityId}-activity-win` })) {
        destroyEntity({ entityId: `${activityEntityId}-activity-win` });
    }
}

export const startActivityBug = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => {
    const activityBugEntity = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug`,
        htmlClass: "activity-bug",
    });

    const activityBugEntityScore = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntity,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score-hp`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntityScore,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score-error`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntityScore,
        htmlAbsolute: false,
    });

    const activityBugEntitySymbol = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol`,
        htmlClass: "activity-bug-symbol",
        htmlParent: activityBugEntity,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol-value`,
        htmlClass: "activity-bug-symbol-value",
        htmlParent: activityBugEntitySymbol,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol-found`,
        htmlClass: "activity-bug-symbol-found",
        htmlParent: activityBugEntitySymbol,
        htmlAbsolute: false,
    });

    updateActivityBug({ activityEntityId, activityBugData });
};

export const updateActivityBug = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => {
    const activityBugEntityScoreHp = getEntity({ entityId: `${activityEntityId}-activity-bug-score-hp` });
    activityBugEntityScoreHp.textContent = `HP: ${activityBugData._hp}`;

    const activityBugEntityScoreError = getEntity({ entityId: `${activityEntityId}-activity-bug-score-error` });
    activityBugEntityScoreError.textContent = `Errors: ${activityBugData._nbErrors}/${activityBugData._maxNbErrors}`;

    const activityBugEntitySymbolValue = getEntity({ entityId: `${activityEntityId}-activity-bug-symbol-value` });
    activityBugEntitySymbolValue.textContent = `Press: ${activityBugData._symbol ?? '...'}`;

    const activityBugEntitySymbolFound = getEntity({ entityId: `${activityEntityId}-activity-bug-symbol-found` });
    // activityBugEntitySymbolFound.style.visibility = activityBugData._symbolFound !== undefined ? 'visible' : 'hidden';
    if (activityBugData._symbolFound === undefined) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_blank.png')})`;
    }
    else if (activityBugData._symbolFound === true) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_found.png')})`;
    }
    else if (activityBugData._symbolFound === false) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_error.png')})`;
    }
};

export const endActivityBug = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-bug-score-hp` });
    destroyEntity({ entityId: `${activityEntityId}-activity-bug-score-error` });
    destroyEntity({ entityId: `${activityEntityId}-activity-bug-score` });
    destroyEntity({ entityId: `${activityEntityId}-activity-bug-symbol` });
    destroyEntity({ entityId: `${activityEntityId}-activity-bug` });
};
//#endregion
