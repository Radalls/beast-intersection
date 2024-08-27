import { gainEnergy, useEnergy } from './energy';

import { Energy } from '@/engine/components/energy';
import { addComponent, createEntity } from '@/engine/entities';

vi.mock('../tilemap/tilemap.data.ts');

describe('Energy System', () => {
    const playerEntityId = createEntity({ entityName: 'Player' });
    const playerEnergy: Energy = {
        _: 'Energy',
        _current: 2,
        _max: 3,
    };

    beforeAll(() => {
        addComponent({
            component: playerEnergy,
            entityId: playerEntityId,
        });
    });

    describe(useEnergy.name, () => {
        beforeEach(() => {
            playerEnergy._current = 2;
        });

        test('Should be a function', () => {
            expect(typeof useEnergy).toBe('function');
        });

        test('Should use energy when current is enough', () => {
            const result = useEnergy({ amount: 1, entityId: playerEntityId });

            expect(result).toBe(true);
            expect(playerEnergy._current).toBe(1);
        });

        test('Should use energy when amount brings current to zero', () => {
            const result = useEnergy({ amount: 2, entityId: playerEntityId });

            expect(result).toBe(true);
            expect(playerEnergy._current).toBe(0);
        });

        test('Should not use energy when current is not enough', () => {
            expect(() => useEnergy({ amount: 3, entityId: playerEntityId })).toThrow();
            expect(playerEnergy._current).toBe(2);
        });
    });

    describe(gainEnergy.name, () => {
        beforeEach(() => {
            playerEnergy._current = 2;
        });

        test('Should be a function', () => {
            expect(typeof gainEnergy).toBe('function');
        });

        test('Should gain energy when amount does not bring to max', () => {
            const result = gainEnergy({ amount: 1, entityId: playerEntityId });

            expect(result).toBe(true);
            expect(playerEnergy._current).toBe(3);
        });

        test('Should gain energy when amount brings to max', () => {
            const result = gainEnergy({ amount: 2, entityId: playerEntityId });

            expect(result).toBe(true);
            expect(playerEnergy._current).toBe(3);
        });

        test('Should not gain energy when current is max', () => {
            playerEnergy._current = 3;

            expect(() => gainEnergy({ amount: 1, entityId: playerEntityId })).toThrow();

            expect(playerEnergy._current).toBe(3);
        });
    });
});
