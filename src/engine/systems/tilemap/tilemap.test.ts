import { generateTileMap, setTile, updateTile } from './tilemap';

import { Position } from '@/engine/components/position';
import { Sprite } from '@/engine/components/sprite';
import { TileMap } from '@/engine/components/tilemap';
import { addComponent, createEntity } from '@/engine/entities';

vi.mock('./tilemap.data.ts');

describe('TileMap System', () => {
    const tileMapEntityId = createEntity({ entityName: 'TileMap' });
    const tileMap: TileMap = {
        _: 'TileMap',
        _height: 0,
        _width: 0,
        tiles: [],
    };

    const playerEntityId = createEntity({ entityName: 'Player' });
    const playerPosition: Position = {
        _: 'Position',
        _x: 1,
        _y: 1,
    };
    const playerSprite: Sprite = {
        _: 'Sprite',
        _height: 1,
        _image: 'player.png',
        _width: 1,
    };

    const playerStartTileId = 4;

    beforeAll(() => {
        addComponent({ component: tileMap, entityId: tileMapEntityId });
        addComponent({ component: playerPosition, entityId: playerEntityId });
        addComponent({ component: playerSprite, entityId: playerEntityId });
    });

    describe(generateTileMap.name, () => {
        afterAll(() => {
            tileMap.tiles = [];
        });

        test('Should be a function', () => {
            expect(typeof generateTileMap).toBe('function');
        });

        test('Should generate tiles', () => {
            generateTileMap({ tileMapEntityId, tileMapName: 'mock-map' });

            expect(tileMap._height).toBe(3);
            expect(tileMap._width).toBe(3);
            expect(tileMap.tiles.length).toBe(9);
            expect(tileMap.tiles[0]._entityIds.length).toBe(0);
            expect(tileMap.tiles[0].position._x).toBe(0);
            expect(tileMap.tiles[0].position._y).toBe(0);
            expect(tileMap.tiles[tileMap.tiles.length - 1].position._x).toBe(2);
            expect(tileMap.tiles[tileMap.tiles.length - 1].position._y).toBe(2);
        });
    });

    describe(setTile.name, () => {
        beforeAll(() => {
            generateTileMap({ tileMapEntityId, tileMapName: 'mock-map' });
        });

        beforeEach(() => {
            tileMap.tiles.forEach(tile => tile._entityIds = []);
            playerPosition._x = 1;
            playerPosition._y = 1;
        });

        test('Should be a function', () => {
            expect(typeof setTile).toBe('function');
        });

        test('Should throw if parameters are invalid', () => {
            playerPosition._x = -5;

            expect(() => setTile({
                entityId: playerEntityId,
                tileMapEntityId,
            })).toThrow();
        });

        test('Should set entity in tile', () => {
            setTile({
                entityId: playerEntityId,
                tileMapEntityId,
            });

            expect(tileMap.tiles[playerStartTileId]._entityIds).toContain(playerEntityId);
        });
    });

    describe(updateTile.name, () => {
        beforeAll(() => {
            generateTileMap({ tileMapEntityId, tileMapName: 'mock-map' });
        });

        beforeEach(() => {
            tileMap.tiles.forEach(tile => tile._entityIds = []);
            tileMap.tiles[playerStartTileId]._entityIds = [playerEntityId];
            playerPosition._x = 1;
            playerPosition._y = 1;
        });

        test('Should be a function', () => {
            expect(typeof updateTile).toBe('function');
        });

        // test('Should throw if parameters are invalid', () => {
        //     expect(() => updateTile({
        //         entityId: playerEntityId,
        //         targetX: -5,
        //         targetY: 0,
        //         tileMapEntityId,
        //     })).toThrow();

        //     expect(() => updateTile({
        //         entityId: playerEntityId,
        //         targetX: 0,
        //         targetY: -5,
        //         tileMapEntityId,
        //     })).toThrow();
        // });

        test('Should throw if target tile is solid', () => {
            tileMap.tiles[1]._solid = true;

            expect(() => updateTile({
                entityId: playerEntityId,
                target: 'up',
                tileMapEntityId,
            })).toThrow();

            tileMap.tiles[1]._solid = false;
        });

        test('Should throw if target tile has a collider entity inside it', () => {
            tileMap.tiles[1]._entityColliderIds = ['mockColliderId'];

            expect(() => updateTile({
                entityId: playerEntityId,
                target: 'up',
                tileMapEntityId,
            })).toThrow();

            tileMap.tiles[1]._entityColliderIds = [];
        });

        test('Should update tile', () => {
            updateTile({
                entityId: playerEntityId,
                target: 'right',
                tileMapEntityId,
            });

            expect(tileMap.tiles[5]._entityIds).toContain(playerEntityId);
            expect(tileMap.tiles[playerStartTileId]._entityIds).not.toContain(playerEntityId);
            expect(playerPosition._x).toBe(2);
            expect(playerPosition._y).toBe(1);
        });
    });
});
