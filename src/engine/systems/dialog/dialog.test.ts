import { addComponent, createEntity } from "../../entities/entity.manager";
import { Dialog } from '../../components/dialog';
import { endDialog, nextDialog, selectDialogOption, startDialog } from "./dialog";

jest.mock('../../../render/events/event.ts', () => ({
    event: jest.fn(),
}));

import { loadDialogData } from './__mocks__/dialog.data';

describe('Dialog system', () => {
    const entityId = createEntity({ entityName: 'Entity' });
    const dialog: Dialog = {
        _: 'Dialog',
        texts: [],
    };

    beforeAll(() => {
        addComponent({
            entityId,
            component: dialog,
        });

        loadDialogData({ entityId });
    });

    beforeEach(() => {
        dialog._currentId = undefined;
        dialog._currentOptionIndex = undefined;
        dialog._currentValue = undefined;
        dialog._currentOptionsValues = undefined;
    });

    describe(startDialog.name, () => {
        test('Should be a function', () => {
            expect(typeof startDialog).toBe('function');
        });

        test('Should set dialog data at start', () => {
            startDialog({ entityId });

            expect(dialog._currentId).toBe(1);
            expect(dialog._currentOptionIndex).toBeUndefined();
            expect(dialog._currentValue).toBe('text1');
            expect(dialog._currentOptionsValues).toBeUndefined();
        });
    });

    describe(nextDialog.name, () => {
        test('Should be a function', () => {
            expect(typeof nextDialog).toBe('function');
        });

        test('Should set next dialog text without options', () => {
            dialog._currentId = 1;
            nextDialog({ entityId });

            expect(dialog._currentId).toBe(2);
            expect(dialog._currentOptionIndex).toBeUndefined();
            expect(dialog._currentValue).toBe('text2');
            expect(dialog._currentOptionsValues).toBeUndefined();
        });

        test('Should set next dialog text with options', () => {
            dialog._currentId = 2;
            nextDialog({ entityId });

            expect(dialog._currentId).toBe(3);
            expect(dialog._currentOptionIndex).toBe(0);
            expect(dialog._currentValue).toBe('text3');
            expect(dialog._currentOptionsValues).toEqual(['text4', 'text5']);
        });

        test('Should set next dialog text with options and select option', () => {
            dialog._currentId = 3;
            dialog._currentOptionIndex = 0;
            nextDialog({ entityId });

            expect(dialog._currentId).toBe(6);
            expect(dialog._currentOptionIndex).toBe(0);
            expect(dialog._currentValue).toBe('text6');
            expect(dialog._currentOptionsValues).toEqual(['text1', 'text2', 'text3']);
        });
    });

    describe(selectDialogOption.name, () => {
        test('Should be a function', () => {
            expect(typeof selectDialogOption).toBe('function');
        });

        test('Should select previous dialog option', () => {
            dialog._currentId = 6;
            dialog._currentOptionIndex = 1;
            selectDialogOption({ entityId, offset: -1 });

            expect(dialog._currentOptionIndex).toBe(0);
        });

        test('Should select next dialog option', () => {
            dialog._currentId = 6;
            dialog._currentOptionIndex = 1;
            selectDialogOption({ entityId, offset: 1 });

            expect(dialog._currentOptionIndex).toBe(2);
        });

        test('Should remain on first dialog option', () => {
            dialog._currentId = 6;
            dialog._currentOptionIndex = 0;
            selectDialogOption({ entityId, offset: -1 });

            expect(dialog._currentOptionIndex).toBe(0);
        });

        test('Should remain on last dialog option', () => {
            dialog._currentId = 6;
            dialog._currentOptionIndex = 2;
            selectDialogOption({ entityId, offset: 1 });

            expect(dialog._currentOptionIndex).toBe(2);
        });
    });

    describe(endDialog.name, () => {
        test('Should be a function', () => {
            expect(typeof endDialog).toBe('function');
        });

        test('Should end dialog', () => {
            dialog._currentId = 6;
            endDialog({ entityId });

            expect(dialog._currentId).toBeUndefined();
            expect(dialog._currentOptionIndex).toBeUndefined();
            expect(dialog._currentValue).toBeUndefined();
            expect(dialog._currentOptionsValues).toBeUndefined();
        });
    });
});
