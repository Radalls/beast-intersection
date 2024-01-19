import { Item } from "./item";

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
