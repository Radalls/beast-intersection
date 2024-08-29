import { addItemToInventory, removeItemFromInventory } from './inventory';

import { Inventory, Item } from '@/engine/components/inventory';
import { addComponent, createEntity } from '@/engine/entities';

// maxAmount is always 2
vi.mock('./inventory.data');

describe('Inventory system', () => {
    const entityId = createEntity({ entityName: 'Entity' });
    const inventory: Inventory = {
        _: 'Inventory',
        _maxSlots: 2,
        _maxTools: 2,
        slots: [],
        tools: [],
    };
    const item1: Item = {
        info: { _name: 'item1' },
        sprite: { _image: 'item1' },
    };
    const item2: Item = {
        info: { _name: 'item2' },
        sprite: { _image: 'item2' },
    };

    beforeAll(() => {
        addComponent({ component: inventory, entityId });
    });

    beforeEach(() => {
        inventory.slots = [];
    });

    describe(addItemToInventory.name, () => {
        test('Should be a function', () => {
            expect(typeof addItemToInventory).toBe('function');
        });

        test('Should throw if parameters are invalid', () => {
            expect(() => addItemToInventory({
                entityId,
                item: {
                    info: { _name: '' },
                    sprite: { _image: 'item' },
                },
                itemAmount: 1,
            })).toThrow();

            expect(() => addItemToInventory({
                entityId,
                item: {
                    info: { _name: 'ItemTest' },
                    sprite: { _image: '' },
                },
                itemAmount: 1,
            })).toThrow();

            expect(() => addItemToInventory({
                entityId,
                item: item1,
                itemAmount: -5,
            })).toThrow();
        });

        test('Should add item to available slot', () => {
            const result = addItemToInventory({ entityId, item: item1, itemAmount: 1 });

            expect(result).toEqual({ success: true });
            expect(inventory.slots.length).toBe(1);
            expect(inventory.slots[0].item.info._name).toBe('item1');
            expect(inventory.slots[0]._amount).toBe(1);
        });

        test('Should add item to multiple available slots', () => {
            const result = addItemToInventory({ entityId, item: item1, itemAmount: 4 });

            expect(result).toEqual({ success: true });
            expect(inventory.slots.length).toBe(2);
            expect(inventory.slots[1]._amount).toBe(2);
        });

        test('Should add multiple items to multiple available slots', () => {
            const result1 = addItemToInventory({ entityId, item: item1, itemAmount: 1 });
            const result2 = addItemToInventory({ entityId, item: item2, itemAmount: 1 });

            expect(result1).toEqual({ success: true });
            expect(result2).toEqual({ success: true });
            expect(inventory.slots.length).toBe(2);
            expect(inventory.slots[0].item.info._name).toBe('item1');
            expect(inventory.slots[1].item.info._name).toBe('item2');
        });

        test('Should add item to existing slot', () => {
            const result1 = addItemToInventory({ entityId, item: item1, itemAmount: 1 });
            const result2 = addItemToInventory({ entityId, item: item1, itemAmount: 1 });

            expect(result1).toEqual({ success: true });
            expect(result2).toEqual({ success: true });
            expect(inventory.slots.length).toBe(1);
            expect(inventory.slots[0].item.info._name).toBe('item1');
            expect(inventory.slots[0]._amount).toBe(2);
        });

        test('Should not add item if no slots available', () => {
            inventory.slots = [
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
            ];

            const result = addItemToInventory({ entityId, item: item1, itemAmount: 1 });

            expect(result).toEqual({
                amountRemaining: 1,
                success: false,
            });
        });

        test('Should not add remaining item if no slots available', () => {
            inventory.slots = [
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
            ];

            const result = addItemToInventory({ entityId, item: item1, itemAmount: 3 });

            expect(result).toEqual({
                amountRemaining: 1,
                success: false,
            });
            expect(inventory.slots.length).toBe(2);
            expect(inventory.slots[1]._amount).toBe(2);
        });
    });

    describe(removeItemFromInventory.name, () => {
        test('Should be a function', () => {
            expect(typeof removeItemFromInventory).toBe('function');
        });

        test('Should throw if parameters are invalid', () => {
            expect(() => removeItemFromInventory({
                entityId,
                itemAmount: 1,
                itemName: '',
            })).toThrow();

            expect(() => removeItemFromInventory({
                entityId,
                itemAmount: -5,
                itemName: 'item1',
            })).toThrow();
        });

        test('Should remove item from slot', () => {
            inventory.slots = [
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
            ];

            const result = removeItemFromInventory({
                entityId,
                itemAmount: 1,
                itemName: 'item1',
            });

            expect(result).toBe(true);
            expect(inventory.slots.length).toBe(1);
            expect(inventory.slots[0]._amount).toBe(1);
        });

        test('Should remove item and remove emptied slot', () => {
            inventory.slots = [
                {
                    _amount: 1,
                    _maxAmount: 2,
                    item: item1,
                },
            ];

            const result = removeItemFromInventory({
                entityId,
                itemAmount: 1,
                itemName: 'item1',
            });

            expect(result).toBe(true);
            expect(inventory.slots.length).toBe(0);
        });

        test('Should remove item from multiple slots', () => {
            inventory.slots = [
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
            ];

            const result = removeItemFromInventory({
                entityId,
                itemAmount: 3,
                itemName: 'item1',
            });

            expect(result).toBe(true);
            expect(inventory.slots.length).toBe(1);
            expect(inventory.slots[0]._amount).toBe(1);
        });

        test('Should not remove item if not present in inventory', () => {
            inventory.slots = [
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
            ];

            const result = removeItemFromInventory({
                entityId,
                itemAmount: 1,
                itemName: 'item2',
            });

            expect(result).toBe(false);
            expect(inventory.slots.length).toBe(1);
            expect(inventory.slots[0]._amount).toBe(2);
        });

        test('Should not remove item if not enough in inventory', () => {
            inventory.slots = [
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
                {
                    _amount: 2,
                    _maxAmount: 2,
                    item: item1,
                },
            ];

            const result = removeItemFromInventory({
                entityId,
                itemAmount: 5,
                itemName: 'item1',
            });

            expect(result).toBe(false);
            expect(inventory.slots.length).toBe(2);
        });
    });
});
