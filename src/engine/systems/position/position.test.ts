import { Position } from "../../components/position";
import { addComponent, createEntity } from "../../services/entity";
import { updatePosition } from "./position";

jest.mock('../../../render/events/event.ts', () => ({
    event: jest.fn(),
}));

describe('Position System', () => {
    const entityId = createEntity('Entity');
    const position: Position = {
        _: 'Position',
        _x: 0,
        _y: 0,
    };

    beforeAll(() => {
        addComponent({
            entityId,
            component: position,
        });
        addComponent({
            entityId,
            component: {
                _: 'Sprite',
                _height: 1,
                _image: 'sprite.png',
                _width: 1,
            },
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
