import { Collider } from "../../components/collider";
import { Position } from "../../components/position";
import { TileMap } from "../../components/tilemap";
import { addComponent, createEntity } from "../../services/entity";
import { generateTiles } from "../tilemap/tilemap";
import { checkCollider, destroyCollider, setCollider } from "./collider";

jest.mock('../../../render/events/event.ts', () => ({
    event: jest.fn(),
}));

describe('Trigger System', () => {
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
        _x: 0,
        _y: 0,
    };

    const fishEntityId = createEntity('ResourceFish');
    const fishPosition: Position = {
        _: 'Position',
        _x: 1,
        _y: 1,
    };
    const fishCollider: Collider = {
        _: 'Collider',
        points: [],
    };

    beforeAll(() => {
        addComponent({
            entityId: tilemapEntityId,
            component: tilemap,
        });
        generateTiles({ tilemapEntityId });

        addComponent({
            entityId: playerEntityId,
            component: playerPosition,
        });

        addComponent({
            entityId: fishEntityId,
            component: fishPosition,
        });
        addComponent({
            entityId: fishEntityId,
            component: fishCollider,
        });
    });

    describe(setCollider.name, () => {
        beforeEach(() => {
            fishCollider.points = [];

            for (const tile of tilemap.tiles) {
                tile._entityColliderIds = [];
            }
        });

        test('Should be a function', () => {
            expect(typeof setCollider).toBe('function');
        });

        test('Should set collider point on entity', () => {
            fishCollider.points.push({ _offsetX: 0, _offsetY: 0 });

            setCollider({ entityId: fishEntityId });

            expect(tilemap.tiles[4]._entityColliderIds.length).toBe(1);
            expect(tilemap.tiles[4]._entityColliderIds[0]).toBe(fishEntityId);
        });

        test('Should set collider points around entity', () => {
            fishCollider.points.push({ _offsetX: 0, _offsetY: -1 });
            fishCollider.points.push({ _offsetX: 0, _offsetY: 1 });

            setCollider({ entityId: fishEntityId });

            expect(tilemap.tiles[1]._entityColliderIds.length).toBe(1);
            expect(tilemap.tiles[1]._entityColliderIds[0]).toBe(fishEntityId);

            expect(tilemap.tiles[7]._entityColliderIds.length).toBe(1);
            expect(tilemap.tiles[7]._entityColliderIds[0]).toBe(fishEntityId);
        });

        test('Should not set collider point if out of bounds', () => {
            fishCollider.points.push({ _offsetX: 5, _offsetY: 0 });

            setCollider({ entityId: fishEntityId });

            // expect all tiles to have no collider point assigned
            for (const tile of tilemap.tiles) {
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

            expect(tilemap.tiles[4]._entityTriggerIds).not.toContain(fishEntityId);
        });
    });
});
