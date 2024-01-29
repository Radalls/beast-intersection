import { event } from "../../../render/event";
import { getComponent } from "../../entities/entity.manager"
import { EventTypes } from "../../event";

export const generateTiles = (entityId: string) => {
    const tilemap = getComponent({ entityId, componentId: 'TileMap' });

    for (let i = 0; i < tilemap._width; i++) {
        for (let j = 0; j < tilemap._height; j++) {
            tilemap.tiles.push({
                _entityIds: [],
                position: {
                    _: 'Position',
                    _x: i,
                    _y: j,
                },
                sprite: {
                    _: 'Sprite',
                    _height: 64,
                    _image: 'grass.png',
                    _width: 64,
                },
            });

            event({
                type: EventTypes.TILEMAP_TILE_CREATE,
                entityId,
                data: {
                    x: i,
                    y: j,
                    sprite: 'grass.png',
                },
            });
        }
    }
}
