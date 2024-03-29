import { getComponent } from "../../entities/entity.manager";

export const loadDialog = async ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ entityId, componentId: 'Dialog' });

    try {
        const { default: dialogData } = await import(`../../../assets/dialogs/${entityId.toLowerCase()}.json`);

        entityDialog.texts = dialogData.map((dialogText: any) => {
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
