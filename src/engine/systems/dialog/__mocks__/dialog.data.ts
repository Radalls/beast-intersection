import { getComponent } from "../../../entities/entity.manager";

export const loadDialog = async ({ entityId }: { entityId: string }) => {
    const entityDialog = getComponent({ entityId, componentId: 'Dialog' });

    try {
        const { default: dialogData } = await import(`./mock-dialog.json`);
        //@ts-expect-error - ts error but parsing is correct
        entityDialog.texts = dialogData;
    } catch (e) {
        console.error(e);
    }
};