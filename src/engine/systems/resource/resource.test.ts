import { Inventory } from "../../components/inventory";
import { Resource } from "../../components/resource";
import { addComponent, createEntity, getEntity } from "../../entities/entity.manager";
import { useResource } from "./resource";

jest.mock('../../../render/event.ts', () => ({
    event: jest.fn(),
}));

describe('Resource System', () => {
    const resourceEntityId = createEntity('Resource');
    const resource: Resource = {
        _: 'Resource',
        _isTemporary: false,
        item: {
            info: { _name: 'Stick' },
            sprite: { _image: 'stick.png' },
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
        beforeEach(() => {
            playerInventory.slots = [];
        });

        test('Should be a function', () => {
            expect(typeof useResource).toBe('function');
        });

        test('Should add resource to player inventory', () => {
            useResource({
                entityId: playerEntityId,
                triggeredEntityId: resourceEntityId,
            });

            expect(playerInventory.slots).toHaveLength(1);
            expect(playerInventory.slots[0].item.info._name).toBe('Stick');
        });

        test('Should destroy resource entity if temporary', () => {
            const temporaryResourceEntityId = createEntity('TemporaryResource');

            addComponent({
                entityId: temporaryResourceEntityId,
                component: { ...resource, _isTemporary: true },
            });
            useResource({
                entityId: playerEntityId,
                triggeredEntityId: temporaryResourceEntityId,
            });

            expect(getEntity(temporaryResourceEntityId)).toBeNull();
        });
    });
});
