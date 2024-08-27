import { Collider } from '@/engine/components/collider';
import { Dialog } from '@/engine/components/dialog';
import { Energy } from '@/engine/components/energy';
import { Inventory } from '@/engine/components/inventory';
import { Manager } from '@/engine/components/manager';
import { Position } from '@/engine/components/position';
import {
    ActivityBugData,
    ActivityCraftData,
    ActivityFishData,
    ActivityTypes,
    Resource,
} from '@/engine/components/resource';
import { Sprite } from '@/engine/components/sprite';
import { TileMap } from '@/engine/components/tilemap';
import { Trigger } from '@/engine/components/trigger';
import { addComponent, isPlayer } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { loadDialogData } from '@/engine/systems/dialog/dialog.data';
import { event } from '@/render/events';

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

    addComponent({ component: collider, entityId });
};

export const addDialog = ({ entityId }: {
    entityId: string,
}) => {
    const dialog: Dialog = {
        _: 'Dialog',
        texts: [],
    };

    addComponent({ component: dialog, entityId });
    loadDialogData({ entityId });
};

export const addEnergy = ({ entityId, current = 0, max = 10 }: {
    current?: number,
    entityId: string,
    max?: number,
}) => {
    const energy: Energy = {
        _: 'Energy',
        _current: current,
        _max: max,
    };

    addComponent({ component: energy, entityId });

    event({
        data: energy,
        entityId,
        type: EventTypes.ENERGY_CREATE,
    });
    event({
        data: energy,
        entityId,
        type: EventTypes.ENERGY_UPDATE,
    });
    event({
        data: energy,
        entityId,
        type: EventTypes.ENERGY_DISPLAY,
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

    addComponent({ component: inventory, entityId });

    if (isPlayer(entityId)) {
        event({
            data: inventory,
            entityId,
            type: EventTypes.INVENTORY_CREATE,
        });
    }
};

export const addManager = ({ entityId }: {
    entityId: string,
}) => {
    const manager: Manager = {
        _: 'Manager',
        _selectedSetting: 0,
        settings: {
            _audio: false,
            keys: {
                action: {
                    _act: 'e',
                    _back: 'Escape',
                    _inventory: 'i',
                },
                move: {
                    _down: 's',
                    _left: 'q',
                    _right: 'd',
                    _up: 'z',
                },
            },
        },
    };

    addComponent({ component: manager, entityId });
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

    addComponent({ component: position, entityId });

    event({
        data: position,
        entityId,
        type: EventTypes.ENTITY_POSITION_UPDATE,
    });
};

export const addResourceBug = ({
    entityId,
    isTemporary = false,
    maxHp,
    maxNbErrors,
    symbolInterval,
    itemName,
}: {
    entityId: string,
    isTemporary?: boolean,
    itemName: string,
    maxHp: number,
    maxNbErrors: number,
    symbolInterval: number
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

    addComponent({ component: resource, entityId });
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
    };

    const resource: Resource = {
        _: 'Resource',
        _activityType: ActivityTypes.CRAFT,
        _isTemporary: isTemporary,
        activityData: activityCraftData,
        item: undefined,
    };

    addComponent({ component: resource, entityId });
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
    itemName,
}: {
    entityId: string,
    fishDamage: number,
    fishMaxHp: number,
    frenzyDuration: number,
    frenzyInterval: number,
    isTemporary?: boolean,
    itemName: string,
    rodDamage: number,
    rodMaxTension: number
}) => {
    const activityFishData: ActivityFishData = {
        _fishDamage: fishDamage,
        _fishHp: fishMaxHp,
        _fishMaxHp: fishMaxHp,
        _frenzyDuration: frenzyDuration,
        _frenzyInterval: frenzyInterval,
        _rodDamage: rodDamage,
        _rodMaxTension: rodMaxTension,
        _rodTension: 0,
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

    addComponent({ component: resource, entityId });
};

export const addResourceItem = ({
    entityId,
    isTemporary = false,
    itemName,
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

    addComponent({ component: resource, entityId });
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

    addComponent({ component: sprite, entityId });

    event({
        data: sprite,
        entityId,
        type: EventTypes.ENTITY_SPRITE_CREATE,
    });
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

    addComponent({ component: tileMap, entityId });
};

export const addTrigger = ({ entityId, priority = 0, points }: {
    entityId: string,
    points?: { x: number, y: number }[],
    priority?: number
}) => {
    const trigger: Trigger = {
        _: 'Trigger',
        _priority: priority,
        points: (points)
            ? points.map(({ x, y }) => ({ _offsetX: x, _offsetY: y }))
            : [{ _offsetX: 0, _offsetY: 0 }],
    };

    addComponent({ component: trigger, entityId });
};
