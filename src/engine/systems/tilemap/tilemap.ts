import { event } from "../../../render/event";
import { Tile } from "../../components/tilemap";
import { getComponent } from "../../entities/entity.manager"
import { EventTypes } from "../../event";

export const generateTiles = (entityId: string) => {
    const tilemap = getComponent({ entityId, componentId: 'TileMap' });

    for (let i = 0; i < tilemap._width; i++) {
        for (let j = 0; j < tilemap._height; j++) {
            const tile: Tile = {
                _entityIds: [],
                position: {
                    _: 'Position',
                    _x: i,
                    _y: j,
                },
                sprite: { // temp
                    _: 'Sprite',
                    _height: 1,
                    _image: 'tile_grass.png',
                    _width: 1,
                },
            }

            console.log('tile', tile)

            tilemap.tiles.push(tile);

            event({
                type: EventTypes.TILEMAP_TILE_CREATE,
                entityId,
                data: {
                    positionX: tile.position._x,
                    positionY: tile.position._y,
                    sprite: tile.sprite._image,
                },
            });
        }
    }
}
