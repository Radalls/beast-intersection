import { Item } from "./item";

export type Inventory = {
    _: 'Inventory'
    _nbSlots: number;
    slots: (Item | undefined)[];
};
