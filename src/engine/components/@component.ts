import { Collider } from "./collider";
import { Dialog } from "./dialog";
import { Inventory } from "./inventory";
import { Position } from "./position";
import { Resource } from "./resource";
import { Sprite } from "./sprite";
import { TileMap } from "./tilemap";
import { Trigger } from "./trigger";

export type Component = {
    'Collider': Collider;
    'Dialog': Dialog;
    'Inventory': Inventory;
    'Position': Position;
    'Resource': Resource;
    'Sprite': Sprite;
    'TileMap': TileMap;
    'Trigger': Trigger;
};
