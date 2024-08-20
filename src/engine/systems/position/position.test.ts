import { updatePosition } from './position';

import { Position } from '@/engine/components/position';
import { addComponent, createEntity } from '@/engine/entities';

describe('Position System', () => {
    const entityId = createEntity({ entityName: 'Entity' });
    const position: Position = {
        _: 'Position',
        _x: 0,
        _y: 0,
    };

    beforeAll(() => {
        addComponent({ component: position, entityId });
        addComponent({
            component: {
                _: 'Sprite',
                _height: 1,
                _image: 'sprite',
                _width: 1,
            },
            entityId,
        });
    });

    beforeEach(() => {
        position._x = 0;
        position._y = 0;
    });

    describe(updatePosition.name, () => {
        test('Should be a function', () => {
            expect(typeof updatePosition).toBe('function');
        });

        test('Should throw if parameters are invalid', () => {
            expect(() => updatePosition({
                entityId,
                x: 0,
                y: 0,
            })).toThrow();

            expect(() => updatePosition({
                entityId,
                x: -5,
                y: 0,
            })).toThrow();

            expect(() => updatePosition({
                entityId,
                x: 0,
                y: -5,
            })).toThrow();
        });

        test('Should update position', () => {
            updatePosition({
                entityId,
                x: 5,
                y: 5,
            });

            expect(position._x).toBe(5);
            expect(position._y).toBe(5);
        });
    });
});
