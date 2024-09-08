import { Position } from './position';
import { Sprite } from './sprite';

export type TileMap = {
    _: 'TileMap',
    _height: number,
    _name?: string,
    _width: number,
    tiles: Tile[],
};

export type Tile = {
    _entityColliderIds: string[],
    _entityIds: string[],
    _entityTriggerIds: string[],
    _solid?: boolean,
    exits?: TileExit[],
    position: TilePosition,
    sprite: TileSprite,
};

export type TileExit = {
    _direction: 'up' | 'down' | 'left' | 'right',
    _targetMap: string,
    targetPosition: TilePosition,
};

type TilePosition = Pick<Position, '_x' | '_y'>;

type TileSprite = Pick<Sprite, '_image'>;
