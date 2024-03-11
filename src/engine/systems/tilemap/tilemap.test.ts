import { Position } from "../../components/position";
import { Sprite } from "../../components/sprite";
import { TileMap } from "../../components/tilemap";
import { addComponent, createEntity } from "../../entities/entity.manager";
import { generateTiles, setTile, updateTile } from "./tilemap";

jest.mock('../../../render/events/event.ts', () => ({
    event: jest.fn(),
}));

describe('TileMap System', () => {
    const tilemapEntityId = createEntity('TileMap');
    const tilemap: TileMap = {
        _: 'TileMap',
        _height: 3,
        _width: 3,
        tiles: [],
    };

    const playerEntityId = createEntity('Player');
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
        addComponent({
            entityId: tilemapEntityId,
            component: tilemap,
        });

        addComponent({
            entityId: playerEntityId,
            component: playerPosition,
        });
        addComponent({
            entityId: playerEntityId,
            component: playerSprite,
        });
    });

    describe(generateTiles.name, () => {
        afterAll(() => {
            tilemap.tiles = [];
        });

        test('Should be a function', () => {
            expect(typeof generateTiles).toBe('function');
        });

        test('Should generate tiles', () => {
            generateTiles({ tilemapEntityId });

            expect(tilemap.tiles.length).toBe(9);
            expect(tilemap.tiles[0]._entityIds.length).toBe(0);
            expect(tilemap.tiles[0].position._x).toBe(0);
            expect(tilemap.tiles[0].position._y).toBe(0);
            expect(tilemap.tiles[playerStartTileId].position._x).toBe(1);
            expect(tilemap.tiles[playerStartTileId].position._y).toBe(1);
            expect(tilemap.tiles[tilemap.tiles.length - 1].position._x).toBe(2);
            expect(tilemap.tiles[tilemap.tiles.length - 1].position._y).toBe(2);
        });
    });

    describe(setTile.name, () => {
        beforeAll(() => {
            generateTiles({ tilemapEntityId });
        });

        beforeEach(() => {
            tilemap.tiles.forEach(tile => tile._entityIds = []);
            playerPosition._x = 1;
            playerPosition._y = 1;
        });

        test('Should be a function', () => {
            expect(typeof setTile).toBe('function');
        });

        test('Should throw if parameters are invalid', () => {
            playerPosition._x = -5;

            expect(() => setTile({
                tilemapEntityId,
                entityId: playerEntityId,
            })).toThrow();
        });

        test('Should set entity in tile', () => {
            setTile({
                tilemapEntityId,
                entityId: playerEntityId,
            });

            expect(tilemap.tiles[playerStartTileId]._entityIds).toContain(playerEntityId);
        });
    });

    describe(updateTile.name, () => {
        beforeAll(() => {
            generateTiles({ tilemapEntityId });
        });

        beforeEach(() => {
            tilemap.tiles.forEach(tile => tile._entityIds = []);
            tilemap.tiles[playerStartTileId]._entityIds = [playerEntityId];
            playerPosition._x = 1;
            playerPosition._y = 1;
        });

        test('Should be a function', () => {
            expect(typeof updateTile).toBe('function');
        });

        test('Should throw if parameters are invalid', () => {
            expect(() => updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: -5,
                targetY: 0,
            })).toThrow();

            expect(() => updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: 0,
                targetY: -5,
            })).toThrow();
        });

        test('Should update tile', () => {
            updateTile({
                tilemapEntityId,
                entityId: playerEntityId,
                targetX: playerPosition._x + 1,
                targetY: playerPosition._y,
            });

            expect(tilemap.tiles[5]._entityIds).toContain(playerEntityId);
            expect(tilemap.tiles[playerStartTileId]._entityIds).not.toContain(playerEntityId);
            expect(playerPosition._x).toBe(2);
            expect(playerPosition._y).toBe(1);
        });
    });
});
