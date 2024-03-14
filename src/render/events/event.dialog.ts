import { Dialog } from "../../engine/components/dialog";
import { startDialog, updateDialog, endDialog } from "../templates/template.dialog";

//#region EVENTS
export const onDialogStart = ({ entityId, dialog }: {
    entityId: string,
    dialog: Dialog,
}) => {
    startDialog({ entityId, dialog });
}

export const onDialogNext = ({ entityId, dialog }: {
    entityId: string,
    dialog: Dialog,
}) => {
    updateDialog({ entityId, dialog });
}

export const onDialogEnd = ({ entityId }: { entityId: string }) => {
    endDialog({ entityId });
}
//#endregion
