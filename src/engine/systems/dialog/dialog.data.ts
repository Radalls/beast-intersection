import { getComponent } from "../../entities/entity.manager";

//#region TYPES
export type DialogTextData = {
    id: number,
    value: string,
    next: number | null,
    options: number[],
};
//#endregion

//#region DATA
export const loadDialogData = async ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ entityId, componentId: 'Dialog' });

    try {
        const { default: dialogData } = await import(`../../../assets/dialogs/${entityId.split('-')[0].toLowerCase()}.json`);

        entityDialog.texts = dialogData.map((dialogText: DialogTextData) => {
            const { id, value, next, options } = dialogText;

            return {
                _id: id,
                _value: value,
                _next: next,
                _options: options,
            }
        });
    } catch (e) {
        console.error(e);
    }
};
//#endregion
