import { Item } from "./item";

export type Inventory = {
    _: 'Inventory'
    _nbItems: number;
    items: Item[];
};
