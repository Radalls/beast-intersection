import { getComponent } from "../../../entities/entity.manager";
import dialogData from './mock-dialog.json';

export const loadDialogData = async ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ entityId, componentId: 'Dialog' });

    //@ts-expect-error - ts error but parsing is correct
    entityDialog.texts = dialogData;
};