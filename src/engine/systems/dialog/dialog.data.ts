import { getComponent } from '../../entities/entity.manager';

//#region TYPES
export type DialogTextData = {
    id: number,
    next: number | null,
    options: number[],
    value: string
};
//#endregion

//#region DATA
export const loadDialogData = async ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });

    try {
        const { default: dialogData } = await import(
            `../../../assets/dialogs/${entityId.split('-')[0].toLowerCase()}.json`,
        );

        entityDialog.texts = dialogData.map((dialogText: DialogTextData) => {
            const { id, value, next, options } = dialogText;

            return {
                _id: id,
                _next: next,
                _options: options,
                _value: value,
            };
        });
    } catch (e) {
        console.error(e);
    }
};
//#endregion
