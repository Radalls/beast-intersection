import { Position } from './position';
import { Sprite } from './sprite';

export type TileMap = {
    _: 'TileMap',
    _height: number,
    _width: number,
    tiles: Tile[],
};

type Tile = {
    _entityIds: string[],
    position: Position,
    sprite: Sprite,
};
