import { createElement, destroyElement } from './template';
import { getElement } from './template.utils';

import { Dialog } from '@/engine/components/dialog';

//#region TEMPLATES
export const startDialog = ({ entityId, dialog }: {
    dialog: Dialog,
    entityId: string
}) => {
    const dialogElement = createElement({
        elementClass: 'dialog',
        elementId: `${entityId}-dialog`,
        entityId,
    });

    createElement({
        elementAbsolute: false,
        elementClass: 'dialog-text',
        elementId: `${entityId}-dialog-text`,
        elementParent: dialogElement,
        entityId,
    });

    createElement({
        elementClass: 'dialog-text-options',
        elementId: `${entityId}-dialog-text-options`,
        elementParent: dialogElement,
        entityId,
    });

    updateDialog({ dialog, entityId });
};

export const updateDialog = ({ entityId, dialog }: {
    dialog: Dialog,
    entityId: string
}) => {
    const dialogText = getElement({ elementId: `${entityId}-dialog-text` });
    dialogText.textContent = dialog._currentValue ?? 'DIALOG TEXT ERROR';

    destroyDialogOptions({ entityId });

    const dialogTextOptions = getElement({ elementId: `${entityId}-dialog-text-options` });
    dialogTextOptions.style.visibility = (dialog._currentOptionIndex !== undefined) ? 'visible' : 'hidden';

    if (dialog._currentOptionsValues) {
        if (!(dialogTextOptions.children.length)) {
            for (let i = 0; i < dialog._currentOptionsValues.length; i++) {
                const dialogOption = createElement({
                    elementAbsolute: false,
                    elementClass: 'dialog-text-option',
                    elementId: `${entityId}-dialog-text-options-${i}`,
                    elementParent: dialogTextOptions,
                    entityId,
                });
                dialogOption.textContent = dialog._currentOptionsValues[i];
            }
        }

        for (let i = 0; i < dialog._currentOptionsValues.length; i++) {
            const dialogOption = getElement({ elementId: `${entityId}-dialog-text-options-${i}` });
            dialogOption.style.fontWeight = (i === dialog._currentOptionIndex) ? 'bold' : 'normal';
        }
    }
};

const destroyDialogOptions = ({ entityId }: { entityId: string }) => {
    const dialogTextOptions = getElement({ elementId: `${entityId}-dialog-text-options` });
    if (dialogTextOptions.children.length) {
        while (dialogTextOptions.children.length) {
            destroyElement({ elementId: dialogTextOptions.children[0].id });
        }
    }
};

export const endDialog = ({ entityId }: { entityId: string }) => {
    destroyDialogOptions({ entityId });
    destroyElement({ elementId: `${entityId}-dialog` });
};
//#endregion
