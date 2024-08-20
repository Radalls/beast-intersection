import { Dialog, DialogText } from '@/engine/components/dialog';
import { getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { setState } from '@/engine/state';
import { setStore, clearStore } from '@/engine/store';
import { event } from '@/render/events';

//#region CHECKS
const invalidDialog = (dialog: Dialog) => !(dialog.texts.length) || !(dialog.texts.some((text) => text._id === 1));
const invalidDialogText = (text: DialogText) => !(text._value.length);
const invalidDialogTextNext = (text: DialogText) => text._next !== undefined && text._options.length > 0;
const isDialogTextEnd = (text: DialogText) => !(text._next) && !(text._options.length);
const isDialogTextOptionsSet = (text: DialogText) => text._options.length > 0;
//#endregion

//#region HELPERS
const getDialogText = (dialog: Dialog, textId: number = 1) => dialog.texts.find((text) => text._id === textId);

const getDialogCurrentText = (dialog: Dialog) => getDialogText(dialog, dialog._currentId);

const setDialogCurrentText = (entityId: string, dialog: Dialog, textIndex: number = 1) => {
    dialog._currentId = textIndex;

    const dialogCurrentText = getDialogCurrentText(dialog)
        ?? error({
            message: `DialogText ${entityId}-${dialog._currentId} not found`,
            where: setDialogCurrentText.name,
        });

    if (invalidDialogText(dialogCurrentText)) {
        error({ message: `DialogText ${entityId}-${dialog._currentId} is invalid`, where: setDialogCurrentText.name });
    }

    if (isDialogTextOptionsSet(dialogCurrentText)) {
        dialog._currentOptionIndex = 0;
    }
    else {
        dialog._currentOptionIndex = undefined;
    }

    setDialogCurrentValues(dialog);
};

const setDialogCurrentValues = (dialog: Dialog) => {
    dialog._currentValue = undefined;
    const dialogCurrentText = getDialogCurrentText(dialog)
        ?? error({ message: `DialogText ${dialog._currentId} not found`, where: setDialogCurrentValues.name });
    dialog._currentValue = dialogCurrentText._value;

    dialog._currentOptionsValues = undefined;
    if (isDialogTextOptionsSet(dialogCurrentText)) {
        dialog._currentOptionsValues = dialogCurrentText._options.map((option) => getDialogText(dialog, option)?._value
            ?? error({
                message: `DialogText ${dialog._currentId} option ${option} not found`,
                where: setDialogCurrentValues.name,
            }),
        );
    }
};
//#endregion

//#region SYSTEMS
export const startDialog = ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });
    if (invalidDialog(entityDialog)) {
        error({ message: `Dialog ${entityId} is invalid`, where: startDialog.name });
    }

    setDialogCurrentText(entityId, entityDialog);

    setState('isPlayerDialogOpen', true);
    setStore('dialogId', entityId);

    event({
        data: entityDialog,
        entityId,
        type: EventTypes.DIALOG_START,
    });
};

export const nextDialog = ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });

    const dialogPreviousText = getDialogCurrentText(entityDialog)
        ?? error({ message: `DialogText ${entityId}-${entityDialog._currentId} not found`, where: nextDialog.name });

    if (entityDialog._currentOptionIndex !== undefined && isDialogTextOptionsSet(dialogPreviousText)) {
        entityDialog._currentId = dialogPreviousText._options[entityDialog._currentOptionIndex];
        entityDialog._currentOptionIndex = undefined;
    }

    const dialogCurrentText = getDialogCurrentText(entityDialog)
        ?? error({ message: `DialogText ${entityId}-${entityDialog._currentId} not found`, where: nextDialog.name });

    if (isDialogTextEnd(dialogCurrentText)) {
        endDialog({ entityId });
        return;
    }

    if (invalidDialogTextNext(dialogCurrentText)) {
        error({ message: `DialogText ${entityId}-${entityDialog._currentId} next is invalid`, where: nextDialog.name });
    }
    setDialogCurrentText(entityId, entityDialog, dialogCurrentText._next);

    event({
        data: entityDialog,
        entityId,
        type: EventTypes.DIALOG_UPDATE,
    });
};

export const selectDialogOption = ({ entityId, offset }: { entityId: string, offset: 1 | -1 }) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });

    if (!(entityDialog._currentOptionIndex)) {
        entityDialog._currentOptionIndex = 0;
    }

    const dialogCurrentText = getDialogCurrentText(entityDialog)
        ?? error({
            message: `DialogText ${entityId}-${entityDialog._currentId} not found`,
            where: selectDialogOption.name,
        });

    if (!(isDialogTextOptionsSet(dialogCurrentText))) {
        error({
            message: `DialogText ${entityId}-${entityDialog._currentId} options not found`,
            where: selectDialogOption.name,
        });
    }

    if (offset === -1) {
        entityDialog._currentOptionIndex = Math.max(0, entityDialog._currentOptionIndex - 1);
    }
    else if (offset === 1) {
        entityDialog._currentOptionIndex = Math.min(
            dialogCurrentText._options.length - 1,
            entityDialog._currentOptionIndex + 1,
        );
    }

    event({
        data: entityDialog,
        entityId,
        type: EventTypes.DIALOG_UPDATE,
    });
};

export const endDialog = ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });

    entityDialog._currentId = undefined;
    entityDialog._currentOptionIndex = undefined;

    setState('isPlayerDialogOpen', false);
    clearStore('dialogId');

    event({
        entityId,
        type: EventTypes.DIALOG_END,
    });
};
//#endregion SYSTEMS
