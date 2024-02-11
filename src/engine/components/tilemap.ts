import { Position } from './position';
import { Sprite } from './sprite';

export type TileMap = {
    _: 'TileMap',
    _height: number,
    _width: number,
    tiles: Tile[],
};

export type Tile = {
    _entityIds: string[],
    _triggerEntityIds: string[],
    position: TilePosition,
    sprite: TileSprite,
};

type TilePosition = Pick<Position, '_x' | '_y'>;

type TileSprite = Pick<Sprite, '_image'>;
