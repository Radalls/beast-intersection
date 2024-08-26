import { createEntity, destroyEntity } from './template';
import { getEntity } from './template.utils';

import { Dialog } from '@/engine/components/dialog';

//#region TEMPLATES
export const startDialog = ({ entityId, dialog }: {
    dialog: Dialog,
    entityId: string
}) => {
    const entityDialog = createEntity({
        entityId,
        htmlClass: 'dialog',
        htmlId: `${entityId}-dialog`,
    });

    createEntity({
        entityId,
        htmlAbsolute: false,
        htmlClass: 'dialog-text',
        htmlId: `${entityId}-dialog-text`,
        htmlParent: entityDialog,
    });

    createEntity({
        entityId,
        htmlClass: 'dialog-text-options',
        htmlId: `${entityId}-dialog-text-options`,
        htmlParent: entityDialog,
    });

    updateDialog({ dialog, entityId });
};

export const updateDialog = ({ entityId, dialog }: {
    dialog: Dialog,
    entityId: string
}) => {
    const entityDialogText = getEntity({ entityId: `${entityId}-dialog-text` });
    entityDialogText.textContent = dialog._currentValue ?? 'DIALOG TEXT ERROR';

    destroyDialogOptions({ entityId });

    const entityDialogTextOptions = getEntity({ entityId: `${entityId}-dialog-text-options` });
    entityDialogTextOptions.style.visibility = (dialog._currentOptionIndex !== undefined) ? 'visible' : 'hidden';

    if (dialog._currentOptionsValues) {
        if (!(entityDialogTextOptions.children.length)) {
            for (let i = 0; i < dialog._currentOptionsValues.length; i++) {
                const entityDialogOption = createEntity({
                    entityId,
                    htmlAbsolute: false,
                    htmlClass: 'dialog-text-option',
                    htmlId: `${entityId}-dialog-text-options-${i}`,
                    htmlParent: entityDialogTextOptions,
                });
                entityDialogOption.textContent = dialog._currentOptionsValues[i];
            }
        }

        for (let i = 0; i < dialog._currentOptionsValues.length; i++) {
            const entityDialogOption = getEntity({ entityId: `${entityId}-dialog-text-options-${i}` });
            entityDialogOption.style.fontWeight = (i === dialog._currentOptionIndex) ? 'bold' : 'normal';
        }
    }
};

const destroyDialogOptions = ({ entityId }: { entityId: string }) => {
    const entityDialogTextOptions = getEntity({ entityId: `${entityId}-dialog-text-options` });
    if (entityDialogTextOptions.children.length) {
        while (entityDialogTextOptions.children.length) {
            destroyEntity({ entityId: entityDialogTextOptions.children[0].id });
        }
    }
};

export const endDialog = ({ entityId }: { entityId: string }) => {
    destroyDialogOptions({ entityId });
    destroyEntity({ entityId: `${entityId}-dialog` });
};
//#endregion
