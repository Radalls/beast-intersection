import { Sprite } from "./sprite";

export type Inventory = {
    _: 'Inventory';
    _maxSlots: number;
    slots: InventorySlot[];
};

type InventorySlot = {
    _amount: number;
    _maxAmount: number;
    item: Item;
};

export type Item = {
    info: ItemInfo;
    sprite: ItemSprite;
};

type ItemInfo = {
    _description?: string;
    _name: string;
};

type ItemSprite = Pick<Sprite, '_image'>;
