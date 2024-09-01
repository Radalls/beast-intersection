import { DialogText } from '@/engine/components/dialog';
import { getComponent, getRawEntityId } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { createQuest, QuestData } from '@/engine/services/quest';

const dialogFiles: Record<string, { default: DialogTextData[][] }>
    = import.meta.glob('../../../assets/dialogs/*.json', { eager: true });
const questFiles: Record<string, { default: QuestData }>
    = import.meta.glob('../../../assets/quests/*.json', { eager: true });

//#region TYPES
export type DialogTextData = {
    id: number,
    next?: number,
    nextDialog?: number,
    options: number[],
    questEnd?: string,
    questStart?: string,
    value: string
};
//#endregion

//#region DATA
export const loadDialogData = ({ entityId, index = 0 }: {
    entityId: string,
    index?: number,
}) => {
    const entityDialog = getComponent({ componentId: 'Dialog', entityId });
    const dialogPath = `../../../assets/dialogs/${getRawEntityId({ entityId }).toLowerCase()}.json`;
    const dialogData = dialogFiles[dialogPath].default
        ?? error({ message: `DialogData for ${entityId} not found`, where: loadDialogData.name });

    entityDialog._currentId = index;

    entityDialog.texts = dialogData[index].map((dialogText: DialogTextData) => {
        const text: DialogText = {
            _id: dialogText.id,
            _next: dialogText.next,
            _nextDialog: dialogText.nextDialog,
            _options: dialogText.options,
            _questEnd: dialogText.questEnd,
            _questStart: dialogText.questStart,
            _value: dialogText.value,
        };

        return text;
    });
};

export const loadQuestData = ({ questName }: { questName: string }) => {
    const questPath = `../../../assets/quests/${questName.toLowerCase()}.json`;
    const questData = questFiles[questPath].default
        ?? error({ message: `QuestData for ${questName} not found`, where: loadQuestData.name });

    createQuest({ questData });
};
//#endregion
