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
    _entityColliderIds: string[],
    _entityTriggerIds: string[],
    _solid?: boolean,
    position: TilePosition,
    sprite: TileSprite,
};

type TilePosition = Pick<Position, '_x' | '_y'>;

type TileSprite = Pick<Sprite, '_image'>;
