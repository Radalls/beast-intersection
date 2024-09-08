import itemRecipes from '../../../assets/items/item_recipes.json';

import { canPlay, checkActivityId, endActivity, startActivity, winActivity } from './activity';

import { ActivityCraftData, ActivityData } from '@/engine/components/resource';
import { addComponent, getComponent } from '@/engine/entities';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';
import { getState, setState } from '@/engine/state';
import { getStore } from '@/engine/store';
import { playerHasSameActivityTool, removeItemFromInventory } from '@/engine/systems/inventory';
import { randAudio } from '@/render/audio';
import { event } from '@/render/events';

//#region HELPERS
const checkActivityCraftData = (activityData: ActivityData): activityData is ActivityCraftData =>
    (activityData as ActivityCraftData)._nbErrors !== undefined;
//#endregion

//#region SERVICES
//#region SELECT
export const startActivityCraft = ({ activityId }: { activityId: string }) => {
    startActivity({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: startActivityCraft.name });
    }

    activityCraftData._currentRecipeIndex = 0;
    activityCraftData._nbErrors = 0;
    activityCraftData._hitCount = 0;

    setState('isActivityCraftRunning', true);
    setState('isActivityCraftSelecting', true);

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_START,
    });
    event({
        data: activityCraftData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_SELECT_START,
    });
    event({
        data: { audioName: 'activity_craft_start' },
        entityId: activityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const selectActivityCraftRecipe = ({ activityId, offset }: { activityId?: string | null, offset: 1 | -1 }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: selectActivityCraftRecipe.name });
    }

    if (activityCraftData._currentRecipeIndex === undefined) {
        throw error({ message: 'Activity Craft recipe index is invalid', where: selectActivityCraftRecipe.name });
    }

    if (offset === -1) {
        activityCraftData._currentRecipeIndex = Math.max(0, activityCraftData._currentRecipeIndex - 1);
    }
    else if (offset === 1) {
        activityCraftData._currentRecipeIndex = Math.min(
            itemRecipes.length - 1,
            activityCraftData._currentRecipeIndex + 1,
        );
    }

    event({
        data: activityCraftData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_SELECT_UPDATE,
    });
    event({
        data: { audioName: 'activity_craft_recipe_select' },
        entityId: activityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const confirmActivityCraftRecipe = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: confirmActivityCraftRecipe.name });
    }

    if (activityCraftData._currentRecipeIndex === undefined) {
        throw error({ message: 'Activity Craft recipe index is invalid', where: confirmActivityCraftRecipe.name });
    }

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: confirmActivityCraftRecipe.name });

    if (itemRecipes[activityCraftData._currentRecipeIndex].tool) {
        const playerHasTool = playerHasSameActivityTool({
            activity: itemRecipes[activityCraftData._currentRecipeIndex].tool!,
            playerEntityId: playerEntityId,
        });

        if (playerHasTool) {
            event({
                data: { audioName: 'activity_craft_recipe_fail' },
                entityId: playerEntityId,
                type: EventTypes.AUDIO_PLAY,
            });

            return;
        }
    }

    if (!(canPlay({ entityId: playerEntityId, strict: false }))) {
        event({
            data: { audioName: 'activity_fail' },
            entityId: playerEntityId,
            type: EventTypes.AUDIO_PLAY,
        });

        return;
    }

    const playerInventory = getComponent({ componentId: 'Inventory', entityId: playerEntityId });
    const playerInventoryBeforeCraft = {
        ...playerInventory,
        slots: [...playerInventory.slots],
        tools: [...playerInventory.tools],
    };

    for (const ingredient of itemRecipes[activityCraftData._currentRecipeIndex].ingredients) {
        const itemAmountRemoved = removeItemFromInventory({
            entityId: playerEntityId,
            itemAmount: ingredient.amount,
            itemName: ingredient.name,
        });

        if (!(itemAmountRemoved)) {
            addComponent({ component: playerInventoryBeforeCraft, entityId: playerEntityId });

            event({
                data: { audioName: 'activity_craft_recipe_fail' },
                entityId: playerEntityId,
                type: EventTypes.AUDIO_PLAY,
            });

            error({
                message: `Could not remove ${ingredient.amount} ${ingredient.name} from inventory`,
                where: confirmActivityCraftRecipe.name,
            });
        }
    }

    activityCraftData._currentRecipeId = itemRecipes[activityCraftData._currentRecipeIndex].id;
    activityResource.item = {
        info: { _name: itemRecipes[activityCraftData._currentRecipeIndex].name },
        sprite: { _image: `item_${itemRecipes[activityCraftData._currentRecipeIndex].name.toLowerCase()}` },
    };

    setState('isActivityCraftSelecting', false);
    setState('isActivityCraftPlaying', true);

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_SELECT_END,
    });
    event({
        data: activityCraftData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_PLAY_START,
    });
    event({
        data: { audioName: 'activity_craft_recipe_confirm' },
        entityId: activityId,
        type: EventTypes.AUDIO_PLAY,
    });
};
//#endregion

//#region PLAY
export const playActivityCraft = ({ activityId, symbol }: {
    activityId?: string | null,
    symbol: string,
}) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: playActivityCraft.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    if (symbol !== manager.settings.keys.action._act) return;

    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: playActivityCraft.name });
    }

    if (activityCraftData._hitCount === undefined) {
        throw error({ message: 'Activity Craft hit count is invalid', where: playActivityCraft.name });
    }

    activityCraftData._hitCount++;

    if (activityCraftData._hitCount >= 10) {
        endActivityCraft({ activityId });
        winActivity({ activityId });

        event({
            data: { audioName: 'activity_craft_win' },
            entityId: activityId,
            type: EventTypes.AUDIO_PLAY,
        });

        return;
    }

    event({
        data: activityCraftData,
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_PLAY_UPDATE,
    });
    event({
        data: { audioName: `activity_craft_play${randAudio({ nb: 6 })}` },
        entityId: activityId,
        type: EventTypes.AUDIO_PLAY,
    });
};

export const endActivityCraft = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: endActivityCraft.name });
    }

    if (getState('isActivityCraftSelecting')) {
        setState('isActivityCraftSelecting', false);

        event({
            entityId: activityId,
            type: EventTypes.ACTIVITY_CRAFT_SELECT_END,
        });
        event({
            data: { audioName: 'activity_craft_end' },
            entityId: activityId,
            type: EventTypes.AUDIO_PLAY,
        });

        endActivity({ activityId });
        return;
    }
    else if (getState('isActivityCraftPlaying')) {
        const playerEntityId = getStore('playerId')
            ?? error({ message: 'Store playerId is undefined', where: confirmActivityCraftRecipe.name });

        canPlay({ entityId: playerEntityId });

        setState('isActivityCraftPlaying', false);

        event({
            entityId: activityId,
            type: EventTypes.ACTIVITY_CRAFT_PLAY_END,
        });
    }

    setState('isActivityCraftRunning', false);

    event({
        entityId: activityId,
        type: EventTypes.ACTIVITY_CRAFT_END,
    });
};
//#endregion
//#endregion
