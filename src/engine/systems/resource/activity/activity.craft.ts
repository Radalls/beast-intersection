import itemRecipes from '../../../../assets/items/item_recipes.json';

import { canPlay, checkActivityId, endActivity, loseActivity, startActivity, winActivity } from './activity';

import { ActivityCraftData, ActivityData } from '@/engine/components/resource';
import { getComponent } from '@/engine/entities';
import { error } from '@/engine/services/error';
import { EventTypes } from '@/engine/services/event';
import { getState, setState } from '@/engine/services/state';
import { clearStore, getStore } from '@/engine/services/store';
import {
    checkInventory,
    playerHasSameActivityTool,
    playerInventoryFull,
    removeItemFromInventory,
} from '@/engine/systems/inventory';
import { randAudio } from '@/render/audio';
import { event } from '@/render/events';

//#region HELPERS
const checkActivityCraftData = (activityData: ActivityData): activityData is ActivityCraftData =>
    (activityData as ActivityCraftData)._nbErrors !== undefined;
//#endregion

//#region SERVICES
export const onActivityCraftInput = ({ inputKey }: { inputKey: string }) => {
    const managerEntityId = getStore('managerId')
        ?? error({ message: 'Store managerId is undefined', where: onActivityCraftInput.name });

    const manager = getComponent({ componentId: 'Manager', entityId: managerEntityId });

    const activityCraftEntityId = getStore('activityId')
        ?? error({ message: 'Store activityId is undefined ', where: onActivityCraftInput.name });

    if (getState('isActivityCraftSelecting')) {
        if (inputKey === manager.settings.keys.action._act) {
            confirmActivityCraftRecipe({ activityId: activityCraftEntityId });
        }
        else if (inputKey === manager.settings.keys.move._up) {
            selectActivityCraftRecipe({ activityId: activityCraftEntityId, offset: -1 });
        }
        else if (inputKey === manager.settings.keys.move._down) {
            selectActivityCraftRecipe({ activityId: activityCraftEntityId, offset: 1 });
        }
        else if (inputKey === manager.settings.keys.action._back) {
            endActivityCraft({ activityId: activityCraftEntityId });
        }
    }
    else if (getState('isActivityCraftPlaying')) {
        if (inputKey === manager.settings.keys.action._back) {
            loseActivity();
        }
        else {
            playActivityCraft({ activityId: activityCraftEntityId, symbol: inputKey });
        }
    }
};

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

    event({ type: EventTypes.ACTIVITY_CRAFT_START });
    event({ type: EventTypes.ACTIVITY_CRAFT_SELECT_START });
    event({ data: { audioName: 'activity_craft_start' }, type: EventTypes.AUDIO_PLAY });
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
        if (activityCraftData._currentRecipeIndex === 0) {
            activityCraftData._currentRecipeIndex = itemRecipes.length - 1;
        }
        else {
            activityCraftData._currentRecipeIndex = Math.max(0, activityCraftData._currentRecipeIndex - 1);
        }
    }
    else if (offset === 1) {
        if (activityCraftData._currentRecipeIndex === itemRecipes.length - 1) {
            activityCraftData._currentRecipeIndex = 0;
        }
        else {
            activityCraftData._currentRecipeIndex = Math.min(
                itemRecipes.length - 1,
                activityCraftData._currentRecipeIndex + 1,
            );
        }
    }

    event({ type: EventTypes.ACTIVITY_CRAFT_SELECT_UPDATE });
    event({ data: { audioName: 'main_select' }, type: EventTypes.AUDIO_PLAY });
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
            event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
            event({ data: { message: 'Cannot craft more of the same tool' }, type: EventTypes.MAIN_ERROR });

            throw error({
                message: `Player cannot craft more ${itemRecipes[activityCraftData._currentRecipeIndex].name}`,
                where: confirmActivityCraftRecipe.name,
            });
        }
    }

    if (!(canPlay({ entityId: playerEntityId, strict: false }))) {
        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { message: 'Not enough energy' }, type: EventTypes.MAIN_ERROR });

        throw error({
            message: `Not enough energy to craft ${itemRecipes[activityCraftData._currentRecipeIndex].name}`,
            where: confirmActivityCraftRecipe.name,
        });
    }
    if (!(checkInventory({
        entityId: playerEntityId,
        items: itemRecipes[activityCraftData._currentRecipeIndex].ingredients,
    }))) {
        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { message: 'Not enough ingredients' }, type: EventTypes.MAIN_ERROR });

        throw error({
            message: `Could not find all ingredients for ${itemRecipes[activityCraftData._currentRecipeIndex].name}`,
            where: confirmActivityCraftRecipe.name,
        });
    }

    activityCraftData._currentRecipeId = itemRecipes[activityCraftData._currentRecipeIndex].id;
    activityResource.item = {
        info: { _name: itemRecipes[activityCraftData._currentRecipeIndex].name },
        sprite: { _image: `item_${itemRecipes[activityCraftData._currentRecipeIndex].name.toLowerCase()}` },
    };

    if (playerInventoryFull({ item: activityResource.item })) {
        activityCraftData._currentRecipeId = undefined;
        activityResource.item = undefined;

        event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });
        event({ data: { message: 'Inventory full' }, type: EventTypes.MAIN_ERROR });

        throw error({
            message: `Player will not be able to get ${itemRecipes[activityCraftData._currentRecipeIndex].name}`,
            where: confirmActivityCraftRecipe.name,
        });
    }

    setState('isActivityCraftSelecting', false);
    setState('isActivityCraftPlaying', true);

    event({ type: EventTypes.ACTIVITY_CRAFT_SELECT_END });
    event({ type: EventTypes.ACTIVITY_CRAFT_PLAY_START });
    event({ data: { audioName: 'main_confirm' }, type: EventTypes.AUDIO_PLAY });
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

        event({ data: { audioName: 'activity_craft_win' }, type: EventTypes.AUDIO_PLAY });

        return;
    }

    event({ type: EventTypes.ACTIVITY_CRAFT_PLAY_UPDATE });
    event({ data: { audioName: `activity_craft_play${randAudio({ nb: 6 })}` }, type: EventTypes.AUDIO_PLAY });
};

export const endActivityCraft = ({ activityId }: { activityId?: string | null }) => {
    if (getState('isActivityCraftSelecting')) {
        setState('isActivityCraftSelecting', false);

        event({ type: EventTypes.ACTIVITY_CRAFT_SELECT_END });
        event({ data: { audioName: 'activity_craft_end' }, type: EventTypes.AUDIO_PLAY });

        endActivity({ activityId });
        clearStore('activityId');

        return;
    }
    else if (getState('isActivityCraftPlaying')) {
        const playerEntityId = getStore('playerId')
            ?? error({ message: 'Store playerId is undefined', where: endActivityCraft.name });

        canPlay({ entityId: playerEntityId });

        removeCraftIngredients({ activityId });

        setState('isActivityCraftPlaying', false);

        event({ type: EventTypes.ACTIVITY_CRAFT_PLAY_END });
    }

    setState('isActivityCraftRunning', false);

    event({ type: EventTypes.ACTIVITY_CRAFT_END });
};

const removeCraftIngredients = ({ activityId }: { activityId?: string | null }) => {
    activityId = checkActivityId({ activityId });

    const activityResource = getComponent({ componentId: 'Resource', entityId: activityId });
    const activityCraftData = activityResource.activityData;
    if (!(activityCraftData && checkActivityCraftData(activityCraftData))) {
        throw error({ message: 'Activity Craft data is invalid', where: removeCraftIngredients.name });
    }

    if (activityCraftData._currentRecipeIndex === undefined) {
        throw error({ message: 'Activity Craft recipe index is invalid', where: removeCraftIngredients.name });
    }

    const playerEntityId = getStore('playerId')
        ?? error({ message: 'Store playerId is undefined', where: removeCraftIngredients.name });

    for (const ingredient of itemRecipes[activityCraftData._currentRecipeIndex].ingredients) {
        const itemAmountRemoved = removeItemFromInventory({
            entityId: playerEntityId,
            itemAmount: ingredient.amount,
            itemName: ingredient.name,
        });

        if (!(itemAmountRemoved)) {
            event({ data: { audioName: 'main_fail' }, type: EventTypes.AUDIO_PLAY });

            error({
                message: `Could not remove ${ingredient.amount} ${ingredient.name} from inventory`,
                where: removeCraftIngredients.name,
            });
        }
    }
};
//#endregion
