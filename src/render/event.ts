import { Event } from './../engine/event';
import { Position } from "../engine/components/position";
import { Sprite } from "../engine/components/sprite";
import { Tile, TileMap } from "../engine/components/tilemap";
import { EventTypes, onInputKeyDown as engineOnInputKeyDown } from "../engine/event";
import { createEntity, createSprite, updatePosition, createTileMap, createTileMapTile, destroyEntity, createInventory, displayInventory, updateInventory } from "./template";
import { Inventory } from '../engine/components/inventory';

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
            entityId: event.entityId,
            tilemap: event.data as Pick<TileMap, '_height' | '_width'>,
        });
    }
    else if (event.type === EventTypes.TILEMAP_TILE_CREATE && event.data) {
        onTileMapTileCreate({
            entityId: event.entityId,
            tile: event.data as Pick<Tile, 'position' | 'sprite'>,
        });
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

const onTileMapCreate = ({ entityId, tilemap }: {
    entityId: string,
    tilemap: Pick<TileMap, '_height' | '_width'>,
}) => {
    createTileMap({ entityId, tilemap });
};

const onTileMapTileCreate = ({ entityId, tile }: {
    entityId: string,
    tile: Pick<Tile, 'position' | 'sprite'>,
}) => {
    createTileMapTile({ entityId, tile });
};
