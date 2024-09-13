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
import { State } from '@/engine/components/state';
import { TileMap } from '@/engine/components/tilemap';
import { Trigger } from '@/engine/components/trigger';
import { addComponent, isPlayer } from '@/engine/entities';
import { EventTypes } from '@/engine/services/event';
import { loadDialogData } from '@/engine/systems/dialog/dialog.data';
import { event } from '@/render/events';

//#region SERVICES
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

export const addEnergy = ({ entityId, current = 0, max = 10, savedEnergy }: {
    current?: number,
    entityId: string,
    max?: number,
    savedEnergy?: Energy,
}) => {
    const energy: Energy = savedEnergy ?? {
        _: 'Energy',
        _current: current,
        _max: max,
    };

    addComponent({ component: energy, entityId });

    event({ entityId, type: EventTypes.ENERGY_CREATE });
    event({ entityId, type: EventTypes.ENERGY_UPDATE });
    event({ entityId, type: EventTypes.ENERGY_DISPLAY });
};

export const addInventory = ({ entityId, maxSlots = 10, maxTools = 3, savedInventory }: {
    entityId: string,
    maxSlots?: number,
    maxTools?: number,
    savedInventory?: Inventory,
}) => {
    const inventory: Inventory = savedInventory ?? {
        _: 'Inventory',
        _maxSlots: maxSlots,
        _maxTools: maxTools,
        slots: [],
        tools: [],
    };

    addComponent({ component: inventory, entityId });

    if (isPlayer({ entityId })) {
        event({ entityId, type: EventTypes.INVENTORY_CREATE });
        event({ entityId, type: EventTypes.INVENTORY_UPDATE });
        event({ entityId, type: EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY });
        event({ entityId, type: EventTypes.INVENTORY_TOOL_ACTIVATE });
        event({ entityId, type: EventTypes.INVENTORY_TOOL_UPDATE });
    }
};

export const addManager = ({ entityId, savedManager }: {
    entityId: string,
    savedManager?: Manager,
}) => {
    const manager: Manager = savedManager ?? {
        _: 'Manager',
        _selectedLaunchOption: 0,
        _selectedQuest: 0,
        _selectedSetting: 0,
        quests: [],
        questsDone: [],
        settings: {
            _audio: false,
            keys: {
                action: {
                    _act: ' ',
                    _back: 'Escape',
                    _inventory: 'i',
                    _quit: 'Shift',
                    _save: 'Control',
                    _tool: 't',
                },
                move: {
                    _down: 'ArrowDown',
                    _left: 'ArrowLeft',
                    _right: 'ArrowRight',
                    _up: 'ArrowUp',
                },
            },
        },
    };

    addComponent({ component: manager, entityId });

    if (!(savedManager)) {
        event({ type: EventTypes.MENU_LAUNCH_DISPLAY });
        event({ type: EventTypes.MENU_LAUNCH_UPDATE });
    }
};

export const addPosition = ({ entityId, savedPosition, x = 0, y = 0 }: {
    entityId: string,
    savedPosition?: Position,
    x?: number,
    y?: number,
}) => {
    const position: Position = savedPosition ?? {
        _: 'Position',
        _x: x,
        _y: y,
    };

    addComponent({ component: position, entityId });

    event({ entityId, type: EventTypes.ENTITY_POSITION_UPDATE });
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

    event({ entityId, type: EventTypes.ENTITY_SPRITE_CREATE });
};

export const addState = ({ entityId }: { entityId: string }) => {
    const state: State = {
        _: 'State',
        _active: true,
        _talk: false,
    };

    addComponent({ component: state, entityId });
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
//#endregion
