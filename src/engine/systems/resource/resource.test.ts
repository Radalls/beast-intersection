import { destroyResource, getResourceItem, useResource } from './resource';

import { Energy } from '@/engine/components/energy';
import { Inventory } from '@/engine/components/inventory';
import { Resource, ActivityTypes } from '@/engine/components/resource';
import { addComponent, createEntity, getEntity } from '@/engine/entities';

describe('Resource System', () => {
    const resourceEntityId = createEntity({ entityName: 'ResourceWood1' });
    const resource: Resource = {
        _: 'Resource',
        _activityType: ActivityTypes.ITEM,
        _isTemporary: false,
        item: {
            info: { _name: 'Wood1' },
            sprite: { _image: 'item_wood1' },
        },
    };

    const playerEntityId = createEntity({ entityName: 'Player' });
    const playerInventory: Inventory = {
        _: 'Inventory',
        _maxSlots: 3,
        slots: [],
    };
    const playerEnergy: Energy = {
        _: 'Energy',
        _current: 2,
        _max: 3,
    };

    beforeAll(() => {
        addComponent({ component: resource, entityId: resourceEntityId });
        addComponent({ component: playerInventory, entityId: playerEntityId });
        addComponent({ component: playerEnergy, entityId: playerEntityId });
    });

    describe(useResource.name, () => {
        test('Should be a function', () => {
            expect(typeof useResource).toBe('function');
        });

        test('Should use temp item resource', () => {
            const temporaryResourceEntityId = createEntity({ entityName: 'TemporaryResource' });

            addComponent({
                component: { ...resource, _isTemporary: true },
                entityId: temporaryResourceEntityId,
            });

            useResource({
                entityId: playerEntityId,
                resourceEntityId: temporaryResourceEntityId,
            });

            expect(playerInventory.slots).toHaveLength(1);
            expect(getEntity(temporaryResourceEntityId)).toBeNull();
        });

        test('Should use bug resource', () => {
            const bugResourceEntityId = createEntity({ entityName: 'ResourceBug' });

            addComponent({
                component: { ...resource, _activityType: ActivityTypes.BUG },
                entityId: bugResourceEntityId,
            });

            useResource({
                entityId: playerEntityId,
                resourceEntityId: bugResourceEntityId,
            });

            expect(getEntity(bugResourceEntityId)).not.toBeNull();
        });
    });

    describe(getResourceItem.name, () => {
        beforeEach(() => {
            playerInventory.slots = [];
        });

        test('Should be a function', () => {
            expect(typeof getResourceItem).toBe('function');
        });

        test('Should add resource item to player inventory', () => {
            getResourceItem({
                entityId: playerEntityId,
                resourceEntityId,
            });

            expect(playerInventory.slots).toHaveLength(1);
            expect(playerInventory.slots[0]._amount).toBe(1);
            expect(playerInventory.slots[0].item.info._name).toBe('Wood1');
        });
    });

    describe(destroyResource.name, () => {
        test('Should be a function', () => {
            expect(typeof destroyResource).toBe('function');
        });

        test('Should destroy resource entity', () => {
            destroyResource({ resourceEntityId: resourceEntityId });

            expect(getEntity(resourceEntityId)).toBeNull();
        });
    });
});
