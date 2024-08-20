import dialogData from './mock-dialog.json';

import { getComponent } from '@/engine/entities';

export const loadDialogData = ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });

    //@ts-expect-error - ts error but parsing is correct
    entityDialog.texts = dialogData;
};
