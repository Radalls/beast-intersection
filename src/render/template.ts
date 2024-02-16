import { Sprite } from "../engine/components/sprite";
import { app } from "./main";
import { Position } from '../engine/components/position';
import { Tile, TileMap } from "../engine/components/tilemap";
import { Inventory } from "../engine/components/inventory";

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

export const createEntity = ({ entityId, htmlId, htmlClass, htmlParent, htmlAbsolute = true }: {
    entityId: string,
    htmlId?: string,
    htmlClass?: string,
    htmlParent?: HTMLElement,
    htmlAbsolute?: boolean,
}) => {
    const entity = document.createElement('div');

    entity.setAttribute('id', htmlId ?? entityId);
    entity.setAttribute('class', htmlClass ?? entityId);

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

export const createTileMap = ({ entityId, tilemap }: {
    entityId: string,
    tilemap: Pick<TileMap, '_height' | '_width'>,
}) => {
    const tilemapEntity = getEntity({ entityId });

    tilemapEntity.style.left = `${TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.top = `${TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.width = `${tilemap._width * TILE_PIXEL_SIZE}px`;
    tilemapEntity.style.height = `${tilemap._height * TILE_PIXEL_SIZE}px`;
};

export const createTileMapTile = ({ entityId, tile }: {
    entityId: string,
    tile: Pick<Tile, 'position' | 'sprite'>,
}) => {
    const tilemapEntity = getEntity({ entityId });

    const tileEntity = createEntity({
        entityId,
        htmlId: `${entityId}-tile-${tile.position._x}-${tile.position._y}`,
        htmlClass: "tile",
        htmlParent: tilemapEntity,
    });

    tileEntity.style.left = `${tile.position._x * TILE_PIXEL_SIZE}px`;
    tileEntity.style.top = `${tile.position._y * TILE_PIXEL_SIZE}px`;
    tileEntity.style.backgroundImage = `url(${getSpritePath(tile.sprite._image)})`;
    tileEntity.style.width = `${TILE_PIXEL_SIZE}px`;
    tileEntity.style.height = `${TILE_PIXEL_SIZE}px`;
};
//#endregion
