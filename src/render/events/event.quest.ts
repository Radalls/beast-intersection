import { completeQuest, createQuest, destroyQuest, displayQuests } from '@/render/templates';

//#region EVENTS
export const onQuestsDisplay = () => displayQuests();

export const onQuestStart = () => {
    createQuest();
};

export const onQuestEnd = () => {
    destroyQuest();
};

export const onQuestComplete = () => {
    completeQuest();
};
//#endregion
