import { getComponent } from "../../entities/entity.manager";

export const loadDialog = async ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ entityId, componentId: 'Dialog' });

    try {
        const { default: dialogData } = await import(`../../../assets/dialogs/${entityId.toLowerCase()}.json`);
        entityDialog.texts = dialogData;
    } catch (e) {
        console.error(e);
    }
};
