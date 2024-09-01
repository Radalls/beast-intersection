import { Manager } from '@/engine/components/manager';
import { completeQuest, createQuest, destroyQuest, displayQuests } from '@/render/templates';

//#region EVENTS
export const onQuestsDisplay = () => displayQuests();

export const onQuestStart = ({ manager }: { manager: Manager }) => {
    createQuest({ manager });
};

export const onQuestEnd = ({ manager }: { manager: Manager }) => {
    destroyQuest({ manager });
};

export const onQuestComplete = ({ manager }: { manager: Manager }) => {
    completeQuest({ manager });
};
//#endregion
