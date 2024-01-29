import { Position } from "../engine/components/position";
import { Sprite } from "../engine/components/sprite";
import { TileMap } from "../engine/components/tilemap";
import { EventTypes, onInputKeyDown as engineOnInputKeyDown } from "../engine/event";
import { createEntity, getEntity } from "./template";

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
        onEntityPositionCreate({ entityId, position: data as Omit<Position, '_'> });
    }
    else if (type === EventTypes.ENTITY_POSITION_UPDATE) {
        onEntityPositionUpdate({ entityId, position: data as Omit<Position, '_'> });
    }
    else if (type === EventTypes.ENTITY_SPRITE_CREATE) {
        onEntitySpriteCreate({ entityId, sprite: data as Omit<Sprite, '_'> });
    }
    else if (type === EventTypes.TILEMAP_CREATE) {
        onTileMapCreate({ entityId, tilemap: data as Omit<TileMap, '_'> });
    }
    else if (type === EventTypes.TILEMAP_TILE_CREATE) {
        onTileMapTileCreate({ entityId, tile: data });
    }
    else if (type === EventTypes.TILEMAP_TILE_UPDATE) {
        onTileMapTileUpdate({ entityId, tile: data });
    }
    else {
        throw new Error(`Unknown event type: ${type}`);
    }
};

const onEntityCreate = ({ entityId }: {
    entityId: string,
}) => {
    createEntity(entityId);
};

const onEntityInventoryCreate = ({ entityId }: {
    entityId: string,
}) => {
    console.log('onEntityInventoryCreate', entityId);
    throw new Error('Not yet implemented');
}

const onEntityPositionCreate = ({ entityId, position }: {
    entityId: string,
    position: Omit<Position, '_'>
}) => {
    const entity = getEntity(entityId);
    entity.style.left = `${position._x * 64}px`;
    entity.style.top = `${position._y * 64}px`;
}

const onEntityPositionUpdate = ({ entityId, position }: {
    entityId: string,
    position: Omit<Position, '_'>
}) => {
    onEntityPositionCreate({ entityId, position });
};

const onEntitySpriteCreate = ({ entityId, sprite }: {
    entityId: string,
    sprite: Omit<Sprite, '_'>
}) => {
    const entity = getEntity(entityId);
    entity.style.height = `${sprite._height}px`;
    entity.style.backgroundImage = `url(${sprite._image})`;
    entity.style.width = `${sprite._width}px`;
};

const onTileMapCreate = ({ entityId, tilemap }: {
    entityId: string,
    tilemap: Omit<TileMap, '_'>
}) => {
    console.log('onTileMapCreate', entityId, tilemap);
    throw new Error('Not yet implemented');
};

const onTileMapTileCreate = ({ entityId, tile }: {
    entityId: string,
    tile: any,
}) => {
    console.log('onTileMapTileCreate', entityId, tile);
    throw new Error('Not yet implemented');
};

const onTileMapTileUpdate = ({ entityId, tile }: {
    entityId: string,
    tile: any,
}) => {
    console.log('onTileMapTileUpdate', entityId, tile);
    throw new Error('Not yet implemented');
};
