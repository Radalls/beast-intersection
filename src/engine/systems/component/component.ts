import { emit } from "../../../render/render";
import { Inventory } from "../../components/inventory";
import { Position } from "../../components/position";
import { Sprite } from "../../components/sprite";
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

    emit({
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

    emit({
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

    emit({
        type: EventTypes.ENTITY_SPRITE_CREATE,
        entityId,
        data: {
            height: sprite._height,
            image: sprite._image,
            width: sprite._width,
        },
    });
};
