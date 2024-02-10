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
    _: 'Item';
    info: ItemInfo;
    sprite: Sprite;
};

type ItemInfo = {
    _: 'Info';
    _description?: string;
    _name: string;
};
