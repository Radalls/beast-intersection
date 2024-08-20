import { Dialog } from '@/engine/components/dialog';
import { startDialog, updateDialog, endDialog } from '@/render/templates';

//#region EVENTS
export const onDialogStart = ({ entityId, dialog }: {
    dialog: Dialog,
    entityId: string
}) => {
    startDialog({ dialog, entityId });
};

export const onDialogNext = ({ entityId, dialog }: {
    dialog: Dialog,
    entityId: string
}) => {
    updateDialog({ dialog, entityId });
};

export const onDialogEnd = ({ entityId }: { entityId: string }) => {
    endDialog({ entityId });
};
//#endregion
