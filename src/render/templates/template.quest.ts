import { createElement, destroyElement } from './template';
import { getElement, getSpritePath, searchElementsByClassName } from './template.utils';

import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { getStore } from '@/engine/services/store';

//#region CONSTANTS
const QUEST_ITEM_HEIGHT = 23;
//#endregion

//#region TEMPLATES
export const createQuestsMenu = () => {
    createElement({
        elementClass: 'quests',
        elementId: 'PlayerQuestsMenu',
    });
};

export const displayQuests = () => {
    const quests = getElement({ elementId: 'PlayerQuestsMenu' });

    quests.style.display = (quests.style.display === 'block') ? 'none' : 'block';
};

export const createQuest = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: createQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const quests = getElement({ elementId: 'PlayerQuestsMenu' });
    const questData = manager.quests[manager._selectedQuest];

    const quest = createElement({
        elementAbsolute: false,
        elementClass: 'quest',
        elementId: `Quest${manager._selectedQuest}`,
        elementParent: quests,
    });

    if (questData?.items) {
        quest.style.height = `${QUEST_ITEM_HEIGHT * questData.items.length}px`;

        for (const item of questData.items) {
            const questItem = createElement({
                elementAbsolute: false,
                elementClass: 'quest-item',
                elementId: `Quest${manager._selectedQuest}Item${item._name}`,
                elementParent: quest,
            });
            questItem.innerText = `- Obtain ${item._amount} ${item._name}`;
        }
    }

    const questComplete = createElement({
        elementAbsolute: false,
        elementClass: 'quest-complete',
        elementId: `Quest${manager._selectedQuest}Complete`,
        elementParent: quest,
    });
    questComplete.style.backgroundImage = `url(${getSpritePath({ spriteName: 'quest_complete' })})`;
};

export const completeQuest = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: completeQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const questData = manager.quests[manager._selectedQuest];

    const quest = getElement({ elementId: `Quest${manager._selectedQuest}` });

    const questComplete = getElement({ elementId: `Quest${manager._selectedQuest}Complete` });
    questComplete.style.display = 'block';

    if (questData?.items) {
        const questItems = searchElementsByClassName({ className: 'quest-item' });
        for (const item of questItems) {
            destroyElement({ elementId: item.id });
        }
    }

    if (questData?.talk) {
        const questTalk = createElement({
            elementAbsolute: false,
            elementClass: 'quest-talk',
            elementId: `Quest${manager._selectedQuest}Talk`,
            elementParent: quest,
        });
        questTalk.innerText = `Talk to ${questData.talk}`;
    }
};

export const destroyQuest = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: destroyQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    destroyElement({ elementId: `Quest${manager._selectedQuest}` });
};
//#endregion
