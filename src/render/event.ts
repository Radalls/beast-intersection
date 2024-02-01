import { Position } from "../engine/components/position";
import { Sprite } from "../engine/components/sprite";
import { Tile, TileMap } from "../engine/components/tilemap";
import { EventTypes, onInputKeyDown as engineOnInputKeyDown } from "../engine/event";
import { createEntity, updateSprite, updatePosition, createTileMap, updateTileMapTile } from "./template";

export const onInputKeyDown = (e: any) => { engineOnInputKeyDown(e.key); };

export const event = ({ type, entityId, data }: {
    type: EventTypes,
    entityId: string,
    data?: Object,
}) => {
    console.log(`[${type}] - ${entityId}: ${JSON.stringify(data)}`);

    if (type === EventTypes.ENTITY_CREATE) {
        onEntityCreate({ entityId });
    }
    else if (type === EventTypes.ENTITY_INVENTORY_CREATE) {
        onEntityInventoryCreate({ entityId });
    }
    else if (type === EventTypes.ENTITY_POSITION_CREATE) {
        onEntityPositionCreate({
            entityId,
            position: data as Omit<Position, '_'>,
        });
    }
    else if (type === EventTypes.ENTITY_POSITION_UPDATE) {
        onEntityPositionUpdate({
            entityId,
            position: data as Omit<Position, '_'>,
        });
    }
    else if (type === EventTypes.ENTITY_SPRITE_CREATE) {
        onEntitySpriteCreate({
            entityId,
            sprite: data as Omit<Sprite, '_'>,
        });
    }
    else if (type === EventTypes.TILEMAP_CREATE) {
        onTileMapCreate({
            entityId,
            tilemap: data as Omit<TileMap, '_' | 'tiles'>,
        });
    }
    else if (type === EventTypes.TILEMAP_TILE_CREATE) {
        onTileMapTileCreate({
            entityId,
            tile: data as {
                positionX: Tile['position']['_x'],
                positionY: Tile['position']['_y'],
                sprite: Tile['sprite']['_image'],
            },
        });
    }
    else if (type === EventTypes.TILEMAP_TILE_UPDATE) {
        onTileMapTileUpdate({
            entityId,
            tile: data as {
                positionX: Tile['position']['_x'],
                positionY: Tile['position']['_y'],
                sprite: Tile['sprite']['_image'],
            },
        });
    }
    else {
        throw new Error(`Unknown event type: ${type}`);
    }
};

const onEntityCreate = ({ entityId }: {
    entityId: string,
}) => {
    createEntity({ entityId });
};

const onEntityInventoryCreate = ({ entityId }: {
    entityId: string,
}) => {
    console.log('onEntityInventoryCreate', entityId);
}

const onEntityPositionCreate = ({ entityId, position }: {
    entityId: string,
    position: Omit<Position, '_'>
}) => {
    updatePosition({ entityId, position });
}

const onEntityPositionUpdate = ({ entityId, position }: {
    entityId: string,
    position: Omit<Position, '_'>
}) => {
    updatePosition({ entityId, position });
};

const onEntitySpriteCreate = ({ entityId, sprite }: {
    entityId: string,
    sprite: Omit<Sprite, '_'>
}) => {
    updateSprite({ entityId, sprite });
};

const onTileMapCreate = ({ entityId, tilemap }: {
    entityId: string,
    tilemap: Omit<TileMap, '_' | 'tiles'>
}) => {
    createTileMap({ entityId, tilemap });
};

const onTileMapTileCreate = ({ entityId, tile }: {
    entityId: string,
    tile: {
        positionX: Tile['position']['_x'],
        positionY: Tile['position']['_y'],
        sprite: Tile['sprite']['_image'],
    },
}) => {
    updateTileMapTile({ entityId, tile });
};

const onTileMapTileUpdate = ({ entityId, tile }: {
    entityId: string,
    tile: {
        positionX: Tile['position']['_x'],
        positionY: Tile['position']['_y'],
        sprite: Tile['sprite']['_image'],
    },
}) => {
    updateTileMapTile({ entityId, tile });
};
