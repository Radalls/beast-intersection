import { DialogText } from '@/engine/components/dialog';
import { getComponent } from '@/engine/entities/entity.manager';
import { error } from '@/engine/services/error';

const dialogRecords: Record<string, { default: DialogTextData[] }>
    = import.meta.glob('../../../assets/dialogs/*.json', { eager: true });

//#region TYPES
export type DialogTextData = {
    id: number,
    next?: number,
    options: number[],
    value: string
};
//#endregion

//#region DATA
export const loadDialogData = ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });
    const dialogPath = `../../../assets/dialogs/${entityId.split('-')[0].toLowerCase()}.json`;
    const dialogData = dialogRecords[dialogPath].default
        ?? error({ message: `DialogData for ${entityId} not found`, where: loadDialogData.name });

    entityDialog.texts = dialogData.map((dialogText: DialogTextData) => {
        const text: DialogText = {
            _id: dialogText.id,
            _next: dialogText.next,
            _options: dialogText.options,
            _value: dialogText.value,
        };

        return text;
    });
};
//#endregion
