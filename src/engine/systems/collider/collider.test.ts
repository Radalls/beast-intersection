import { Collider } from '../../components/collider';
import { Position } from '../../components/position';
import { TileMap } from '../../components/tilemap';
import { addComponent, createEntity } from '../../entities/entity.manager';
import { generateTileMap } from '../tilemap/tilemap';

import { checkCollider, destroyCollider, setCollider } from './collider';

jest.mock('../tilemap/tilemap.data.ts');
jest.mock('../../../render/events/event.ts', () => ({
    event: jest.fn(),
}));

describe('Trigger System', () => {
    const tilemapEntityId = createEntity({ entityName: 'TileMap' });
    const tileMap: TileMap = {
        _: 'TileMap',
        _height: 3,
        _width: 3,
        tiles: [],
    };

    const playerEntityId = createEntity({ entityName: 'Player' });
    const playerPosition: Position = {
        _: 'Position',
        _x: 0,
        _y: 0,
    };

    const fishEntityId = createEntity({ entityName: 'ResourceFish' });
    const fishPosition: Position = {
        _: 'Position',
        _x: 1,
        _y: 1,
    };
    const fishCollider: Collider = {
        _: 'Collider',
        points: [],
    };

    beforeAll(async () => {
        addComponent({ component: tileMap, entityId: tilemapEntityId });
        await generateTileMap({ tileMapPath: 'mock-map', tilemapEntityId });

        addComponent({ component: playerPosition, entityId: playerEntityId });

        addComponent({ component: fishPosition, entityId: fishEntityId });
        addComponent({ component: fishCollider, entityId: fishEntityId });
    });

    describe(setCollider.name, () => {
        beforeEach(() => {
            fishCollider.points = [];

            for (const tile of tileMap.tiles) {
                tile._entityColliderIds = [];
            }
        });

        test('Should be a function', () => {
            expect(typeof setCollider).toBe('function');
        });

        test('Should set collider point on entity', () => {
            fishCollider.points.push({ _offsetX: 0, _offsetY: 0 });

            setCollider({ entityId: fishEntityId });

            expect(tileMap.tiles[4]._entityColliderIds.length).toBe(1);
            expect(tileMap.tiles[4]._entityColliderIds[0]).toBe(fishEntityId);
        });

        test('Should set collider points around entity', () => {
            fishCollider.points.push({ _offsetX: 0, _offsetY: -1 });
            fishCollider.points.push({ _offsetX: 0, _offsetY: 1 });

            setCollider({ entityId: fishEntityId });

            expect(tileMap.tiles[1]._entityColliderIds.length).toBe(1);
            expect(tileMap.tiles[1]._entityColliderIds[0]).toBe(fishEntityId);

            expect(tileMap.tiles[7]._entityColliderIds.length).toBe(1);
            expect(tileMap.tiles[7]._entityColliderIds[0]).toBe(fishEntityId);
        });

        test('Should not set collider point if out of bounds', () => {
            fishCollider.points.push({ _offsetX: 5, _offsetY: 0 });

            setCollider({ entityId: fishEntityId });

            // expect all tiles to have no collider point assigned
            for (const tile of tileMap.tiles) {
                expect(tile._entityColliderIds.length).toBe(0);
            }
        });
    });

    describe(checkCollider.name, () => {
        beforeAll(() => {
            fishCollider.points.push({ _offsetX: 0, _offsetY: 0 });
            fishCollider.points.push({ _offsetX: 0, _offsetY: -1 });
            fishCollider.points.push({ _offsetX: -1, _offsetY: 0 });

            setCollider({ entityId: fishEntityId });
        });

        beforeEach(() => {
            playerPosition._x = 0;
            playerPosition._y = 0;
        });

        test('Should be a function', () => {
            expect(typeof checkCollider).toBe('function');
        });

        test('Should check collider and return false if not colliding', () => {
            const result = checkCollider({ x: playerPosition._x, y: playerPosition._y });

            expect(result).toBe(false);
        });

        test('Should check collider and return true if colliding', () => {
            const result2 = checkCollider({ x: playerPosition._x + 1, y: playerPosition._y });

            expect(result2).toBe(true);
        });
    });

    describe(destroyCollider.name, () => {
        beforeAll(() => {
            fishCollider.points.push({ _offsetX: 0, _offsetY: 0 });

            setCollider({ entityId: fishEntityId });
        });

        test('Should be a function', () => {
            expect(typeof destroyCollider).toBe('function');
        });

        test('Should destroy collider points', () => {
            destroyCollider({ entityId: fishEntityId });

            expect(tileMap.tiles[4]._entityTriggerIds).not.toContain(fishEntityId);
        });
    });
});
