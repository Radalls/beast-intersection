import { Event } from './../engine/event';
import { Position } from "../engine/components/position";
import { Sprite } from "../engine/components/sprite";
import { Tile, TileMap } from "../engine/components/tilemap";
import { EventTypes, onInputKeyDown as engineOnInputKeyDown } from "../engine/event";
import { createEntity, createSprite, updatePosition, createTileMap, createTileMapTile, destroyEntity, createInventory, displayInventory, updateInventory, startActivityBug, updateActivityBug, endActivityBug, winActivity, endActivity } from "./template";
import { Inventory } from '../engine/components/inventory';
import { ActivityBugData, Resource } from '../engine/components/resource';

export const onInputKeyDown = (e: any) => { engineOnInputKeyDown(e.key); };

export const event = (event: Event) => {
    if (event.type === EventTypes.ENTITY_CREATE) {
        onEntityCreate({ entityId: event.entityId });
    }
    else if (event.type === EventTypes.ENTITY_DESTROY) {
        onEntityDestroy({ entityId: event.entityId });
    }
    else if (event.type === EventTypes.ENTITY_INVENTORY_CREATE && event.data) {
        onEntityInventoryCreate({
            entityId: event.entityId,
            inventory: event.data as Pick<Inventory, '_maxSlots'>,
        });
    }
    else if (event.type === EventTypes.ENTITY_INVENTORY_DISPLAY) {
        onEntityInventoryDisplay({ entityId: event.entityId });
    }
    else if (event.type === EventTypes.ENTITY_INVENTORY_UPDATE && event.data) {
        onEntityInventoryUpdate({
            entityId: event.entityId,
            inventory: event.data as Pick<Inventory, 'slots'>,
        });
    }
    else if (event.type === EventTypes.ENTITY_POSITION_UPDATE && event.data) {
        onEntityPositionUpdate({
            entityId: event.entityId,
            data: event.data as {
                position: Pick<Position, '_x' | '_y'>,
                sprite: Pick<Sprite, '_height' | '_width'>,
            },
        });
    }
    else if (event.type === EventTypes.ENTITY_SPRITE_CREATE && event.data) {
        onEntitySpriteCreate({
            entityId: event.entityId,
            sprite: event.data as Pick<Sprite, '_height' | '_image' | '_width'>,
        });
    }
    else if (event.type === EventTypes.TILEMAP_CREATE && event.data) {
        onTileMapCreate({
            tilemapEntityId: event.entityId,
            tilemap: event.data as Pick<TileMap, '_height' | '_width'>,
        });
    }
    else if (event.type === EventTypes.TILEMAP_TILE_CREATE && event.data) {
        onTileMapTileCreate({
            tilemapEntityId: event.entityId,
            tile: event.data as Pick<Tile, 'position' | 'sprite'>,
        });
    }
    else if (event.type === EventTypes.ACTIVITY_WIN && event.data) {
        onActivityWin({
            activityEntityId: event.entityId,
            activityItem: event.data as Resource['item'],
        });
    }
    else if (event.type === EventTypes.ACTIVITY_END) {
        onActivityEnd({ activityEntityId: event.entityId });
    }
    else if (event.type === EventTypes.ACTIVITY_BUG_START && event.data) {
        onActivityBugStart({
            activityEntityId: event.entityId,
            activityBugData: event.data as ActivityBugData,
        });
    }
    else if (event.type === EventTypes.ACTIVITY_BUG_UPDATE && event.data) {
        onActivityBugUpdate({
            activityEntityId: event.entityId,
            activityBugData: event.data as ActivityBugData,
        });
    }
    else if (event.type === EventTypes.ACTIVITY_BUG_END) {
        onActivityBugEnd({ activityEntityId: event.entityId });
    }
    else {
        throw new Error(`Unknown event type: ${event.type}`);
    }
};

const onEntityCreate = ({ entityId }: {
    entityId: string,
}) => {
    createEntity({ entityId });
};

const onEntityDestroy = ({ entityId }: {
    entityId: string,
}) => {
    destroyEntity({ entityId });
};

const onEntityInventoryCreate = ({ entityId, inventory }: {
    entityId: string,
    inventory: Pick<Inventory, '_maxSlots'>,
}) => {
    createInventory({ entityId, inventory });
}

const onEntityInventoryDisplay = ({ entityId }: { entityId: string }) => {
    displayInventory({ entityId });
};

const onEntityInventoryUpdate = ({ entityId, inventory }: {
    entityId: string,
    inventory: Pick<Inventory, 'slots'>,
}) => {
    updateInventory({ entityId, inventory });
};

const onEntityPositionUpdate = ({ entityId, data: { position, sprite } }: {
    entityId: string,
    data: {
        position: Pick<Position, '_x' | '_y'>,
        sprite: Pick<Sprite, '_height' | '_width'>,
    },
}) => {
    updatePosition({ entityId, position, sprite });
};

const onEntitySpriteCreate = ({ entityId, sprite }: {
    entityId: string,
    sprite: Pick<Sprite, '_height' | '_image' | '_width'>,
}) => {
    createSprite({ entityId, sprite });
};

const onTileMapCreate = ({ tilemapEntityId, tilemap }: {
    tilemapEntityId: string,
    tilemap: Pick<TileMap, '_height' | '_width'>,
}) => {
    createTileMap({ tilemapEntityId, tilemap });
};

const onTileMapTileCreate = ({ tilemapEntityId, tile }: {
    tilemapEntityId: string,
    tile: Pick<Tile, 'position' | 'sprite'>,
}) => {
    createTileMapTile({ tilemapEntityId, tile });
};

const onActivityWin = ({ activityEntityId, activityItem }: {
    activityEntityId: string,
    activityItem: Resource['item'],
}) => {
    winActivity({ activityEntityId, activityItem });
}

const onActivityEnd = ({ activityEntityId }: { activityEntityId: string }) => {
    endActivity({ activityEntityId });
};

const onActivityBugStart = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => {
    startActivityBug({ activityEntityId, activityBugData });
};

const onActivityBugUpdate = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => {
    updateActivityBug({ activityEntityId, activityBugData });
}

const onActivityBugEnd = ({ activityEntityId }: { activityEntityId: string }) => {
    endActivityBug({ activityEntityId });
};
