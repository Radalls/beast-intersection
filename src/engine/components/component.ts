import { Inventory } from "./inventory";
import { Position } from "./position";
import { Resource } from "./resource";
import { Sprite } from "./sprite";
import { TileMap } from "./tilemap";
import { Trigger } from "./trigger";

export type Component = {
    'Inventory': Inventory;
    'Sprite': Sprite;
    'Position': Position;
    'Resource': Resource;
    'TileMap': TileMap;
    'Trigger': Trigger;
};
