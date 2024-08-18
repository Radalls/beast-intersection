import { Position } from "../../components/position";
import { TileMap } from "../../components/tilemap";
import { Trigger } from "../../components/trigger";
import { addComponent, createEntity } from "../../entities/entity.manager";
import { generateTileMap } from "../tilemap/tilemap";
import { checkTrigger, destroyTrigger, setTrigger } from "./trigger";

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
        _x: 1,
        _y: 1,
    };

    const stickEntityId = createEntity({ entityName: 'ResourceStick' });
    const stickPosition: Position = {
        _: 'Position',
        _x: 1,
        _y: 1,
    };
    const stickTrigger: Trigger = {
        _: 'Trigger',
        _priority: 0,
        points: [],
    };

    const rockEntityId = createEntity({ entityName: 'ResourceRock' });
    const rockPosition: Position = {
        _: 'Position',
        _x: 2,
        _y: 1,
    };
    const rockTrigger: Trigger = {
        _: 'Trigger',
        _priority: 1,
        points: [],
    };

    beforeAll(async () => {
        addComponent({
            entityId: tilemapEntityId,
            component: tileMap,
        });
        await generateTileMap({ tilemapEntityId, tileMapPath: 'mock-map' });

        addComponent({
            entityId: playerEntityId,
            component: playerPosition,
        });

        addComponent({
            entityId: stickEntityId,
            component: stickPosition,
        });
        addComponent({
            entityId: stickEntityId,
            component: stickTrigger,
        });

        addComponent({
            entityId: rockEntityId,
            component: rockPosition,
        });
        addComponent({
            entityId: rockEntityId,
            component: rockTrigger,
        });
    });

    describe(setTrigger.name, () => {
        beforeEach(() => {
            stickTrigger.points = [];
            rockTrigger.points = [];

            for (const tile of tileMap.tiles) {
                tile._entityTriggerIds = [];
            }
        });

        test('Should be a function', () => {
            expect(typeof setTrigger).toBe('function');
        });

        test('Should set trigger point on entity', () => {
            stickTrigger.points.push({ _offsetX: 0, _offsetY: 0 });

            setTrigger({ entityId: stickEntityId });

            expect(tileMap.tiles[4]._entityTriggerIds.length).toBe(1);
            expect(tileMap.tiles[4]._entityTriggerIds[0]).toBe(stickEntityId);
        });

        test('Should set trigger points around entity', () => {
            stickTrigger.points.push({ _offsetX: 0, _offsetY: -1 });
            stickTrigger.points.push({ _offsetX: 1, _offsetY: 1 });

            setTrigger({ entityId: stickEntityId });

            expect(tileMap.tiles[1]._entityTriggerIds.length).toBe(1);
            expect(tileMap.tiles[1]._entityTriggerIds[0]).toBe(stickEntityId);

            expect(tileMap.tiles[8]._entityTriggerIds.length).toBe(1);
            expect(tileMap.tiles[8]._entityTriggerIds[0]).toBe(stickEntityId);
        });

        test('Should not set trigger point if out of bounds', () => {
            stickTrigger.points.push({ _offsetX: 5, _offsetY: 0 });

            setTrigger({ entityId: stickEntityId });

            // expect all tiles to have no trigger point assigned
            for (const tile of tileMap.tiles) {
                expect(tile._entityTriggerIds.length).toBe(0);
            }
        });

        test('Should set trigger points and sort by priority', () => {
            stickTrigger.points.push({ _offsetX: 0, _offsetY: 0 });
            rockTrigger.points.push({ _offsetX: -1, _offsetY: 0 });

            setTrigger({ entityId: stickEntityId });
            setTrigger({ entityId: rockEntityId });

            expect(tileMap.tiles[4]._entityTriggerIds.length).toBe(2);
            expect(tileMap.tiles[4]._entityTriggerIds[0]).toBe(rockEntityId);
            expect(tileMap.tiles[4]._entityTriggerIds[1]).toBe(stickEntityId);
        });
    });

    describe(checkTrigger.name, () => {
        beforeAll(() => {
            stickTrigger.points.push({ _offsetX: 0, _offsetY: 0 });
            stickTrigger.points.push({ _offsetX: 0, _offsetY: -1 });
            rockTrigger.points.push({ _offsetX: 0, _offsetY: 0 });
            rockTrigger.points.push({ _offsetX: -1, _offsetY: 0 });

            setTrigger({ entityId: stickEntityId });
            setTrigger({ entityId: rockEntityId });
        });

        beforeEach(() => {
            playerPosition._x = 1;
            playerPosition._y = 1;
        });

        test('Should be a function', () => {
            expect(typeof checkTrigger).toBe('function');
        });

        test('Should check trigger and return triggered entity', () => {
            const result = checkTrigger({ entityId: playerEntityId });

            expect(result).toBe(rockEntityId);

            playerPosition._y -= 1;

            const result2 = checkTrigger({ entityId: playerEntityId });

            expect(result2).toBe(stickEntityId);
        });

        test('Should check trigger and return null if no trigger found', () => {
            playerPosition._x = 0;
            playerPosition._y = 0;

            const result = checkTrigger({ entityId: playerEntityId });

            expect(result).toBe(null);
        });
    });

    describe(destroyTrigger.name, () => {
        beforeAll(() => {
            stickTrigger.points.push({ _offsetX: 0, _offsetY: 0 });
            rockTrigger.points.push({ _offsetX: 0, _offsetY: 0 });

            setTrigger({ entityId: stickEntityId });
            setTrigger({ entityId: rockEntityId });
        });

        test('Should be a function', () => {
            expect(typeof destroyTrigger).toBe('function');
        });

        test('Should destroy trigger points', () => {
            destroyTrigger({ entityId: stickEntityId });

            expect(tileMap.tiles[4]._entityTriggerIds).not.toContain(stickEntityId);
            expect(tileMap.tiles[5]._entityTriggerIds).toContain(rockEntityId);

            destroyTrigger({ entityId: rockEntityId });
            expect(tileMap.tiles[5]._entityTriggerIds).not.toContain(rockEntityId);
        });
    });
});
