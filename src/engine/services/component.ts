import { event } from "../../render/events/event";
import { Inventory } from "../components/inventory";
import { Position } from "../components/position";
import { Resource, ActivityTypes, ActivityBugData, ActivityFishData, ActivityCraftData } from "../components/resource";
import { Sprite } from "../components/sprite";
import { TileMap } from "../components/tilemap";
import { Trigger } from "../components/trigger";
import { PLAYER_ENTITY_NAME, addComponent } from "../entities/entity.manager";
import { EventTypes } from "../event";
import { Collider } from "../components/collider";
import { Dialog } from "../components/dialog";
import { loadDialogData } from "../systems/dialog/dialog.data";

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
        type: EventTypes.ENTITY_POSITION_UPDATE,
        entityId,
        data: position,
    });
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
        data: sprite,
    });
};

export const addInventory = ({ entityId, maxSlots = 20 }: {
    entityId: string,
    maxSlots?: number,
}) => {
    const inventory: Inventory = {
        _: 'Inventory',
        _maxSlots: maxSlots,
        slots: [],
    };

    addComponent({ entityId, component: inventory });

    if (entityId.split('-')[0] === PLAYER_ENTITY_NAME) {
        event({
            type: EventTypes.INVENTORY_CREATE,
            entityId,
            data: inventory,
        });
    }
};

export const addTileMap = ({ entityId }: {
    entityId: string,
}) => {
    const tileMap: TileMap = {
        _: 'TileMap',
        _height: 0,
        _width: 0,
        tiles: [],
    };

    addComponent({ entityId, component: tileMap });
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

export const addCollider = ({ entityId, points }: {
    entityId: string,
    points?: { x: number, y: number }[],
}) => {
    const collider: Collider = {
        _: 'Collider',
        points: (points)
            ? points.map(({ x, y }) => ({ _offsetX: x, _offsetY: y }))
            : [{ _offsetX: 0, _offsetY: 0 }],
    };

    addComponent({ entityId, component: collider });
}

export const addResourceItem = ({
    entityId,
    isTemporary = false,
    itemName
}: {
    entityId: string,
    isTemporary?: boolean,
    itemName: string,
}) => {
    const resource: Resource = {
        _: 'Resource',
        _activityType: ActivityTypes.ITEM,
        _isTemporary: isTemporary,
        item: {
            info: {
                _name: itemName,
            },
            sprite: {
                _image: `item_${itemName.toLowerCase()}`,
            },
        },
    };

    addComponent({ entityId, component: resource });
};

export const addResourceBug = ({
    entityId,
    isTemporary = false,
    maxHp,
    maxNbErrors,
    symbolInterval,
    itemName
}: {
    entityId: string,
    isTemporary?: boolean,
    maxHp: number,
    maxNbErrors: number,
    symbolInterval: number,
    itemName: string,
}) => {
    const activityBugData: ActivityBugData = {
        _hp: maxHp,
        _maxHp: maxHp,
        _maxNbErrors: maxNbErrors,
        _nbErrors: 0,
        _symbolInterval: symbolInterval,
    };

    const resource: Resource = {
        _: 'Resource',
        _activityType: ActivityTypes.BUG,
        _isTemporary: isTemporary,
        activityData: activityBugData,
        item: {
            info: {
                _name: itemName,
            },
            sprite: {
                _image: `item_${itemName.toLowerCase()}`,
            },
        },
    };

    addComponent({ entityId, component: resource });
};

export const addResourceFish = ({
    entityId,
    isTemporary = false,
    fishDamage,
    fishMaxHp,
    frenzyDuration,
    frenzyInterval,
    rodDamage,
    rodMaxTension,
    itemName
}: {
    entityId: string,
    isTemporary?: boolean,
    fishDamage: number,
    fishMaxHp: number,
    frenzyDuration: number,
    frenzyInterval: number,
    rodDamage: number,
    rodMaxTension: number,
    itemName: string,
}) => {
    const activityFishData: ActivityFishData = {
        _fishDamage: fishDamage,
        _fishHp: fishMaxHp,
        _fishMaxHp: fishMaxHp,
        _frenzyDuration: frenzyDuration,
        _frenzyInterval: frenzyInterval,
        _rodDamage: rodDamage,
        _rodTension: 0,
        _rodMaxTension: rodMaxTension,
    };

    const resource: Resource = {
        _: 'Resource',
        _activityType: ActivityTypes.FISH,
        _isTemporary: isTemporary,
        activityData: activityFishData,
        item: {
            info: {
                _name: itemName,
            },
            sprite: {
                _image: `item_${itemName.toLowerCase()}`,
            },
        },
    };

    addComponent({ entityId, component: resource });
};

export const addResourceCraft = ({
    entityId,
    isTemporary = false,
    maxNbErrors,
}: {
    entityId: string,
    isTemporary?: boolean,
    maxNbErrors: number,
}) => {
    const activityCraftData: ActivityCraftData = {
        _maxNbErrors: maxNbErrors,
        _nbErrors: 0,
    }

    const resource: Resource = {
        _: 'Resource',
        _activityType: ActivityTypes.CRAFT,
        _isTemporary: isTemporary,
        activityData: activityCraftData,
        item: undefined,
    };

    addComponent({ entityId, component: resource });
}

export const addDialog = ({ entityId }: {
    entityId: string,
}) => {
    const dialog: Dialog = {
        _: 'Dialog',
        texts: [],
    };

    addComponent({ entityId, component: dialog });
    loadDialogData({ entityId });
}
