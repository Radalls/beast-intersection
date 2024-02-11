import { event } from "../../../render/event";
import { Inventory } from "../../components/inventory";
import { Position } from "../../components/position";
import { Resource } from "../../components/resource";
import { Sprite } from "../../components/sprite";
import { TileMap } from "../../components/tilemap";
import { Trigger } from "../../components/trigger";
import { addComponent, getComponent } from "../../entities/entity.manager";
import { EventTypes } from "../../event";

export const addInventory = ({ entityId, maxSlots = 10 }: {
    entityId: string,
    maxSlots?: number,
}) => {
    const inventory: Inventory = {
        _: 'Inventory',
        _maxSlots: maxSlots,
        slots: [],
    };

    addComponent({ entityId, component: inventory });

    event({
        type: EventTypes.ENTITY_INVENTORY_CREATE,
        entityId,
    });
};

export const addPosition = ({ entityId, x = 0, y = 0 }: {
    entityId: string,
    x?: number,
    y?: number,
}) => {
    const position: Position = {
        _: 'Position',
        _x: x,
        _y: y,
    };

    addComponent({ entityId, component: position });

    const sprite = getComponent({ entityId, componentId: 'Sprite' });

    event({
        type: EventTypes.ENTITY_POSITION_UPDATE,
        entityId,
        data: {
            position: (({ _, ...positionData }) => positionData)(position),
            sprite: (({ _, _image, ...spriteData }) => spriteData)(sprite),
        },
    });
};

export const addResource = ({ entityId, isTemporary = false, itemName }: {
    entityId: string,
    isTemporary?: boolean,
    itemName: string,
}) => {
    const resource: Resource = {
        _: 'Resource',
        _isTemporary: isTemporary,
        item: {
            info: {
                _name: itemName,
            },
            sprite: {
                _image: `${itemName.toLowerCase()}.png`,
            },
        },
    };

    addComponent({ entityId, component: resource });
};

export const addSprite = ({ entityId, height = 1, image, width = 1 }: {
    entityId: string,
    height?: number,
    image: string,
    width?: number,
}) => {
    const sprite: Sprite = {
        _: 'Sprite',
        _height: height,
        _image: image,
        _width: width,
    };

    addComponent({ entityId, component: sprite });

    event({
        type: EventTypes.ENTITY_SPRITE_CREATE,
        entityId,
        data: (({ _, ...spriteData }) => spriteData)(sprite),
    });
};

export const addTileMap = ({ entityId, height = 10, width = 10 }: {
    entityId: string,
    height?: number,
    width?: number,
}) => {
    const tilemap: TileMap = {
        _: 'TileMap',
        _height: height,
        _width: width,
        tiles: [],
    };

    addComponent({ entityId, component: tilemap });

    event({
        type: EventTypes.TILEMAP_CREATE,
        entityId,
        data: (({ _, tiles, ...tilemapData }) => tilemapData)(tilemap),
    });
}

export const addTrigger = ({ entityId, priority = 0, points }: {
    entityId: string,
    priority?: number,
    points?: { x: number, y: number }[],
}) => {
    const trigger: Trigger = {
        _: 'Trigger',
        _priority: priority,
        points: (points)
            ? points.map(({ x, y }) => ({ _offsetX: x, _offsetY: y }))
            : [{ _offsetX: 0, _offsetY: 0 }],
    };

    addComponent({ entityId, component: trigger });
}
