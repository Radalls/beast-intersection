import { Dialog } from "../../engine/components/dialog";
import { createEntity, destroyEntity, getEntity } from "./template";

//#region TEMPLATES
export const startDialog = ({ entityId, dialog }: {
    entityId: string,
    dialog: Dialog,
}) => {
    const entityDialog = createEntity({
        entityId,
        htmlId: `${entityId}-dialog`,
        htmlClass: 'dialog',
    });

    createEntity({
        entityId,
        htmlId: `${entityId}-dialog-text`,
        htmlClass: 'dialog-text',
        htmlParent: entityDialog,
        htmlAbsolute: false,
    });

    createEntity({
        entityId,
        htmlId: `${entityId}-dialog-text-options`,
        htmlClass: 'dialog-text-options',
        htmlParent: entityDialog,
    });

    updateDialog({ entityId, dialog });
}

export const updateDialog = ({ entityId, dialog }: {
    entityId: string,
    dialog: Dialog,
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
                    htmlId: `${entityId}-dialog-text-options-${i}`,
                    htmlClass: 'dialog-text-option',
                    htmlParent: entityDialogTextOptions,
                    htmlAbsolute: false,
                });
                entityDialogOption.textContent = dialog._currentOptionsValues[i];
            }
        }

        for (let i = 0; i < dialog._currentOptionsValues.length; i++) {
            const entityDialogOption = getEntity({ entityId: `${entityId}-dialog-text-options-${i}` });
            entityDialogOption.style.fontWeight = (i === dialog._currentOptionIndex) ? 'bold' : 'normal';
        }
    }
}

const destroyDialogOptions = ({ entityId }: { entityId: string }) => {
    const entityDialogTextOptions = getEntity({ entityId: `${entityId}-dialog-text-options` });
    if (entityDialogTextOptions.children.length) {
        while (entityDialogTextOptions.children.length) {
            destroyEntity({ entityId: entityDialogTextOptions.children[0].id });
        }
    }
}

export const endDialog = ({ entityId }: { entityId: string }) => {
    destroyDialogOptions({ entityId });
    destroyEntity({ entityId: `${entityId}-dialog-text-options` });
    destroyEntity({ entityId: `${entityId}-dialog-text` });
    destroyEntity({ entityId: `${entityId}-dialog` });
}
//#endregion