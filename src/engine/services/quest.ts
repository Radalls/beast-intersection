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
    check: () => boolean,
    completed: boolean,
    items?: QuestItem[],
    talk?: string,
};

export type QuestData = {
    items?: { amount: number, name: string }[],
    talk?: string,
};

type QuestItem = {
    _amount: number,
    _name: string,
};
//#endregion

//#region SERVICES
export const createQuest = ({ questData }: { questData: QuestData }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: createQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: createQuest.name });

    let check = () => true;
    let checkHasConditions = false;

    if (questData?.items) {
        const _check = check;
        check = () => _check() && checkInventory({ entityId: playerEntityId, items: questData.items ?? [] });
        checkHasConditions = true;
    }

    if (!(checkHasConditions)) throw error({
        message: 'QuestData is invalid',
        where: createQuest.name,
    });

    const quest: Quest = {
        check,
        completed: false,
        items: (questData?.items)
            ? questData.items.map((item) => ({ _amount: item.amount, _name: item.name }))
            : undefined,
        talk: (questData?.talk) ? questData.talk : undefined,
    };
    manager.quests.push(quest);

    if (!(getState('isQuestActive'))) {
        startQuest({ quest });
    }
};

export const completeQuest = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: createQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const quest = manager.quests[manager._selectedQuest];
    quest.completed = true;

    if (quest?.talk) {
        const { entity: talkEntity, entityId: talkEntityId } = findEntityByName({ entityName: quest.talk });
        if (!(talkEntity && talkEntityId)) throw error({
            message: `Entity ${quest.talk} does not exist`,
            where: createQuest.name,
        });

        const talkEntityDialog = getComponent({ componentId: 'Dialog', entityId: talkEntityId });

        if (!(talkEntityDialog._currentId)) throw error({
            message: `Entity ${quest.talk} has invalid dialog`,
            where: createQuest.name,
        });

        loadDialogData({ entityId: talkEntityId, index: talkEntityDialog._currentId + 1 });
    }

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.QUEST_COMPLETE,
    });
};

export const endQuest = () => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: createQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

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

const startQuest = ({ quest }: { quest: Quest }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: createQuest.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    manager._selectedQuest = manager.quests.indexOf(quest);

    if (!(getState('isQuestActive'))) setState('isQuestActive', true);
    setCheck('questCheck', quest.check);

    event({
        data: manager,
        entityId: managerEntityId,
        type: EventTypes.QUEST_START,
    });
};
//#endregion
