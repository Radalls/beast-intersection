import { Info } from "./info";
import { Inventory } from "./inventory";
import { Item } from "./item";
import { Position } from "./position";
import { Sprite } from "./sprite";

export type Component = {
    'Info': Info;
    'Inventory': Inventory;
    'Item': Item;
    'Sprite': Sprite;
    'Position': Position;
};
