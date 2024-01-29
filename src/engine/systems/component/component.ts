import { event } from "../../../render/event";
import { Inventory } from "../../components/inventory";
import { Position } from "../../components/position";
import { Sprite } from "../../components/sprite";
import { TileMap } from "../../components/tilemap";
import { addComponent } from "../../entities/entity.manager";
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

    event({
        type: EventTypes.ENTITY_POSITION_CREATE,
        entityId,
        data: { x: position._x, y: position._y },
    })
};

export const addSprite = ({ entityId, height = 64, image, width = 64 }: {
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
        data: {
            height: sprite._height,
            image: sprite._image,
            width: sprite._width,
        },
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
        data: {
            height: tilemap._height,
            width: tilemap._width,
        },
    });
}
