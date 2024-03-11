import { Inventory } from "../../components/inventory";
import { Resource, ActivityTypes } from "../../components/resource";
import { addComponent, createEntity, getEntity } from "../../entities/entity.manager";
import { destroyResource, getResourceItem, useResource } from "./resource";

jest.mock('../../../render/events/event.ts', () => ({
    event: jest.fn(),
}));

describe('Resource System', () => {
    const resourceEntityId = createEntity('ResourceWood1');
    const resource: Resource = {
        _: 'Resource',
        _activityType: ActivityTypes.PICKUP,
        _isTemporary: false,
        item: {
            info: { _name: 'Wood1' },
            sprite: { _image: 'item_wood1.png' },
        }
    };

    const playerEntityId = createEntity('Player');
    const playerInventory: Inventory = {
        _: 'Inventory',
        _maxSlots: 3,
        slots: [],
    };

    beforeAll(() => {
        addComponent({
            entityId: resourceEntityId,
            component: resource,
        });

        addComponent({
            entityId: playerEntityId,
            component: playerInventory,
        });
    });

    describe(useResource.name, () => {
        test('Should be a function', () => {
            expect(typeof useResource).toBe('function');
        });

        test('Should use temp pickup resource', () => {
            const temporaryResourceEntityId = createEntity('TemporaryResource');

            addComponent({
                entityId: temporaryResourceEntityId,
                component: { ...resource, _isTemporary: true },
            });

            useResource({
                entityId: playerEntityId,
                resourceEntityId: temporaryResourceEntityId,
            });

            expect(playerInventory.slots).toHaveLength(1);
            expect(getEntity(temporaryResourceEntityId)).toBeNull();
        });

        test('Should use bug resource', () => {
            const bugResourceEntityId = createEntity('ResourceBug');

            addComponent({
                entityId: bugResourceEntityId,
                component: { ...resource, _activityType: ActivityTypes.BUG },
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
