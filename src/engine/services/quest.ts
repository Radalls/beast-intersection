import { error } from './error';

import { setCheck } from '@/engine/cycle';
import { findEntityByName, getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { getState, setState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { loadDialogData } from '@/engine/systems/dialog';
import { checkInventory } from '@/engine/systems/inventory';
import { event } from '@/render/events';

//#region TYPES
export type Quest = {
    check?: () => boolean,
    completed: boolean,
    items?: QuestItem[],
    name: string,
    talk?: string,
};

export type QuestData = {
    items?: { amount: number, name: string }[],
    name: string,
    talk?: string,
};

type QuestItem = {
    _amount: number,
    _name: string,
};
//#endregion

//#region SERVICES
export const initQuest = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: initQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (manager.quests.length) {
        startQuest({ quest: manager.quests[0] });
    }
};

export const createQuest = ({ questData }: { questData: QuestData }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: createQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const quest: Quest = {
        completed: false,
        items: (questData?.items)
            ? questData.items.map((item) => ({ _amount: item.amount, _name: item.name }))
            : undefined,
        name: questData.name,
        talk: (questData?.talk) ? questData.talk : undefined,
    };
    quest.check = createQuestCheck({ quest });

    manager.quests.push(quest);

    if (!(getState('isQuestActive'))) {
        startQuest({ quest });
    }
};

export const startQuest = ({ quest }: { quest: Quest }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: startQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    manager._selectedQuest = manager.quests.indexOf(quest);

    if (!(getState('isQuestActive'))) setState('isQuestActive', true);

    if (!(quest.check)) {
        quest.check = createQuestCheck({ quest });
    }
    setCheck('questCheck', quest.check ?? error({
        message: 'QuestCheck is undefined',
        where: startQuest.name,
    }));

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.QUEST_START,
    });
};

export const completeQuest = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: completeQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const quest = manager.quests[manager._selectedQuest];
    quest.completed = true;

    if (quest?.talk) {
        const { entity: talkEntity, entityId: talkEntityId } = findEntityByName({ entityName: quest.talk });
        if (!(talkEntity && talkEntityId)) throw error({
            message: `Entity ${quest.talk} does not exist`,
            where: completeQuest.name,
        });

        const talkEntityDialog = getComponent({ componentId: 'Dialog', entityId: talkEntityId });

        if (!(talkEntityDialog._currentId)) throw error({
            message: `Entity ${quest.talk} has invalid dialog`,
            where: completeQuest.name,
        });

        loadDialogData({ dialogId: `${quest.name}_complete`, entityId: talkEntityId });
    }

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.QUEST_COMPLETE,
    });
};

export const endQuest = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: endQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const quest = manager.quests[manager._selectedQuest];
    manager.questsDone.push(quest);
    manager.quests.splice(manager._selectedQuest, 1);
    manager._selectedQuest = 0;

    if (manager.quests.length) {
        startQuest({ quest: manager.quests[manager._selectedQuest] });
    }
    else {
        setState('isQuestActive', false);
        setCheck('questCheck', () => false);
    }

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.QUEST_END,
    });
};

const createQuestCheck = ({ quest }: { quest: Quest }) => {
    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: createQuestCheck.name });

    let check = () => true;
    let checkHasConditions = false;

    if (quest?.items) {
        const _check = check;
        check = () => _check() && checkInventory({
            entityId: playerEntityId,
            items: (quest.items ?? []).map((item) => {
                return {
                    amount: item._amount,
                    name: item._name,
                };
            }),
        });
        checkHasConditions = true;
    }

    if (!(checkHasConditions)) throw error({
        message: 'QuestData is invalid',
        where: createQuest.name,
    });

    return check;
};
//#endregion
