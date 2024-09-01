import { createElement, destroyElement } from './template';
import { getElement, getSpritePath, searchElementsByClassName } from './template.utils';

import { Manager } from '@/engine/components/manager';

//#region CONSTANTS
const QUEST_ITEM_HEIGHT = 23;
//#endregion

//#region TEMPLATES
export const createQuestsMenu = () => {
    createElement({
        elementClass: 'quests',
        elementId: 'QuestsMenu',
        entityId: '',
    });
};

export const displayQuests = () => {
    const quests = getElement({ elementId: 'QuestsMenu' });

    quests.style.display = (quests.style.display === 'block') ? 'none' : 'block';
};

export const createQuest = ({ manager }: { manager: Manager }) => {
    const quests = getElement({ elementId: 'QuestsMenu' });
    const questData = manager.quests[manager._selectedQuest];

    const quest = createElement({
        elementAbsolute: false,
        elementClass: 'quest',
        elementId: `Quest${manager._selectedQuest}`,
        elementParent: quests,
        entityId: '',
    });

    if (questData?.items) {
        quest.style.height = `${QUEST_ITEM_HEIGHT * questData.items.length}px`;

        for (const item of questData.items) {
            const questItem = createElement({
                elementAbsolute: false,
                elementClass: 'quest-item',
                elementId: `Quest${manager._selectedQuest}Item${item._name}`,
                elementParent: quest,
                entityId: '',
            });
            questItem.innerText = `- Obtain ${item._amount} ${item._name}`;
        }
    }

    const questComplete = createElement({
        elementAbsolute: false,
        elementClass: 'quest-complete',
        elementId: `Quest${manager._selectedQuest}Complete`,
        elementParent: quest,
        entityId: '',
    });
    questComplete.style.backgroundImage = `url(${getSpritePath('quest_complete')})`;
};

export const completeQuest = ({ manager }: { manager: Manager }) => {
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
            entityId: '',
        });
        questTalk.innerText = `Talk to ${questData.talk}`;
    }
};

export const destroyQuest = ({ manager }: { manager: Manager }) => {
    destroyElement({ elementId: `Quest${manager._selectedQuest}` });
};
//#endregion
