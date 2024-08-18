import itemRecipes from '../../assets/items/item_recipes.json';
import { Resource, ActivityBugData, ActivityFishData, ActivityCraftData } from '../../engine/components/resource';

import { checkEntity, createEntity, destroyEntity, getEntity, getSpritePath } from './template';

//#region CONSTANTS
//#endregion

//#region TEMPLATES
//#region MAIN ACTIVITY
export const startActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    createEntity({
        entityId: activityEntityId,
        htmlClass: 'activity',
        htmlId: `${activityEntityId}-activity`,
    });
};

export const winActivity = ({ activityEntityId, resource }: {
    activityEntityId: string,
    resource: Resource,
}) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });
    activityEntity.style.visibility = 'hidden';

    const activityEntityWin = createEntity({
        entityId: activityEntityId,
        htmlClass: 'activity-win',
        htmlId: `${activityEntityId}-activity-win`,
    });

    activityEntityWin.textContent = `You get ${resource.item?.info._name}!`;
};

export const endActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity` });
    if (checkEntity({ entityId: `${activityEntityId}-activity-win` })) {
        destroyEntity({ entityId: `${activityEntityId}-activity-win` });
    }
};
//#endregion

//#region ACTIVITY BUG
export const startActivityBug = ({ activityEntityId, activityBugData }: {
    activityBugData: ActivityBugData,
    activityEntityId: string
}) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });

    const activityBugEntity = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-bug',
        htmlId: `${activityEntityId}-activity-bug`,
        htmlParent: activityEntity,
    });

    const activityBugEntityScore = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-bug-score',
        htmlId: `${activityEntityId}-activity-bug-score`,
        htmlParent: activityBugEntity,
    });

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-bug-score',
        htmlId: `${activityEntityId}-activity-bug-score-hp`,
        htmlParent: activityBugEntityScore,
    });

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-bug-score',
        htmlId: `${activityEntityId}-activity-bug-score-error`,
        htmlParent: activityBugEntityScore,
    });

    const activityBugEntitySymbol = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-bug-symbol',
        htmlId: `${activityEntityId}-activity-bug-symbol`,
        htmlParent: activityBugEntity,
    });

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-bug-symbol-value',
        htmlId: `${activityEntityId}-activity-bug-symbol-value`,
        htmlParent: activityBugEntitySymbol,
    });

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-bug-symbol-found',
        htmlId: `${activityEntityId}-activity-bug-symbol-found`,
        htmlParent: activityBugEntitySymbol,
    });

    updateActivityBug({ activityBugData, activityEntityId });
};

export const updateActivityBug = ({ activityEntityId, activityBugData }: {
    activityBugData: ActivityBugData,
    activityEntityId: string
}) => {
    const activityBugEntityScoreHp = getEntity({ entityId: `${activityEntityId}-activity-bug-score-hp` });
    activityBugEntityScoreHp.textContent = `HP: ${activityBugData._hp}`;

    const activityBugEntityScoreError = getEntity({ entityId: `${activityEntityId}-activity-bug-score-error` });
    activityBugEntityScoreError.textContent = `Errors: ${activityBugData._nbErrors}/${activityBugData._maxNbErrors}`;

    const activityBugEntitySymbolValue = getEntity({ entityId: `${activityEntityId}-activity-bug-symbol-value` });
    activityBugEntitySymbolValue.textContent = `Press: ${activityBugData._symbol ?? '...'}`;

    const activityBugEntitySymbolFound = getEntity({ entityId: `${activityEntityId}-activity-bug-symbol-found` });
    if (activityBugData._symbolFound === undefined) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_blank')})`;
    }
    else if (activityBugData._symbolFound === true) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_found')})`;
    }
    else if (activityBugData._symbolFound === false) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_error')})`;
    }
};

export const endActivityBug = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-bug` });
};
//#endregion

//#region ACTIVITY FISH
export const startActivityFish = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });

    const activityFishEntity = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish',
        htmlId: `${activityEntityId}-activity-fish`,
        htmlParent: activityEntity,
    });

    const activityFishEntityHpBars = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-hp-bars',
        htmlId: `${activityEntityId}-activity-fish-hp-bars`,
        htmlParent: activityFishEntity,
    });

    const activityFishEntityHpBarsFishHp = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-hp',
        htmlId: `${activityEntityId}-activity-fish-hp`,
        htmlParent: activityFishEntityHpBars,
    });

    const activityFishEntityHpBarsFishHpLabel = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-hp-label',
        htmlId: `${activityEntityId}-activity-fish-hp-label`,
        htmlParent: activityFishEntityHpBarsFishHp,
    });
    activityFishEntityHpBarsFishHpLabel.textContent = 'Fish HP: ';

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-hp-value',
        htmlId: `${activityEntityId}-activity-fish-hp-value`,
        htmlParent: activityFishEntityHpBarsFishHp,
    });

    const activityFishEntityHpBarsRodTension = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-rod-tension',
        htmlId: `${activityEntityId}-activity-fish-rod-tension`,
        htmlParent: activityFishEntityHpBars,
    });

    const activityFishEntityHpBarsRodTensionLabel = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-rod-tension-label',
        htmlId: `${activityEntityId}-activity-fish-rod-tension-label`,
        htmlParent: activityFishEntityHpBarsRodTension,
    });
    activityFishEntityHpBarsRodTensionLabel.textContent = 'Rod Tension: ';

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-rod-tension-value',
        htmlId: `${activityEntityId}-activity-fish-rod-tension-value`,
        htmlParent: activityFishEntityHpBarsRodTension,
    });

    const activityFishEntityFrenzy = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-frenzy',
        htmlId: `${activityEntityId}-activity-fish-frenzy`,
        htmlParent: activityFishEntity,
    });

    const activityFishEntityFrenzyLabel = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-frenzy-label',
        htmlId: `${activityEntityId}-activity-fish-frenzy-label`,
        htmlParent: activityFishEntityFrenzy,
    });
    activityFishEntityFrenzyLabel.textContent = 'Frenzy: ';

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-fish-frenzy-value',
        htmlId: `${activityEntityId}-activity-fish-frenzy-value`,
        htmlParent: activityFishEntityFrenzy,
    });

    updateActivityFish({ activityEntityId, activityFishData });
};

export const updateActivityFish = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => {
    const activityFishEntityHpBarsFishHpValue =
        getEntity({ entityId: `${activityEntityId}-activity-fish-hp-value` });
    activityFishEntityHpBarsFishHpValue.innerHTML =
        `<progress value="${activityFishData._fishHp}" max="${activityFishData._fishMaxHp}"></progress>`;

    const activityFishEntityHpBarsRodTensionValue =
        getEntity({ entityId: `${activityEntityId}-activity-fish-rod-tension-value` });
    activityFishEntityHpBarsRodTensionValue.innerHTML =
        `<progress value="${activityFishData._rodTension}" max="${activityFishData._rodMaxTension}"></progress>`;

    const activityFishEntityFrenzyValue = getEntity({ entityId: `${activityEntityId}-activity-fish-frenzy-value` });
    activityFishEntityFrenzyValue.style.backgroundImage = (activityFishData._isFrenzy)
        ? `url(${getSpritePath('activity_fish_frenzy_on')})`
        : `url(${getSpritePath('activity_fish_frenzy_off')})`;
};

export const endActivityFish = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-fish` });
};
//#endregion

//#region ACTIVITY CRAFT
export const startActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-craft',
        htmlId: `${activityEntityId}-activity-craft`,
        htmlParent: activityEntity,
    });
};

export const startSelectActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => {
    const activityCraftEntity = getEntity({ entityId: `${activityEntityId}-activity-craft` });

    const activityCraftRecipesEntity = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-craft-recipes',
        htmlId: `${activityEntityId}-activity-craft-recipes`,
        htmlParent: activityCraftEntity,
    });

    for (let i = 0; i < itemRecipes.length; i++) {
        const activityCraftRecipeEntity = createEntity({
            entityId: activityEntityId,
            htmlAbsolute: false,
            htmlClass: 'activity-craft-recipe',
            htmlId: `${activityEntityId}-activity-craft-recipe-${i}`,
            htmlParent: activityCraftRecipesEntity,
        });

        const activityCraftRecipeIconEntity = createEntity({
            entityId: activityEntityId,
            htmlAbsolute: false,
            htmlClass: 'activity-craft-recipe-icon',
            htmlId: `${activityEntityId}-activity-craft-recipe-${i}-icon`,
            htmlParent: activityCraftRecipeEntity,
        });
        activityCraftRecipeIconEntity.style.backgroundImage =
            `url(${getSpritePath(`item_${itemRecipes[i].name.toLowerCase()}`)})`;

        const activityCraftRecipeNameEntity = createEntity({
            entityId: activityEntityId,
            htmlAbsolute: false,
            htmlClass: 'activity-craft-recipe-name',
            htmlId: `${activityEntityId}-activity-craft-recipe-${i}-name`,
            htmlParent: activityCraftRecipeEntity,
        });
        activityCraftRecipeNameEntity.textContent = itemRecipes[i].name;

        const activityCraftRecipeIngredientsEntity = createEntity({
            entityId: activityEntityId,
            htmlAbsolute: false,
            htmlClass: 'activity-craft-recipe-ingredients',
            htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredients`,
            htmlParent: activityCraftRecipeEntity,
        });

        for (let j = 0; j < itemRecipes[i].ingredients.length; j++) {
            const activityCraftRecipeIngredientEntity = createEntity({
                entityId: activityEntityId,
                htmlAbsolute: false,
                htmlClass: 'activity-craft-recipe-ingredient',
                htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}`,
                htmlParent: activityCraftRecipeIngredientsEntity,
            });

            const activityCraftRecipeIngredientIconEntity = createEntity({
                entityId: activityEntityId,
                htmlAbsolute: false,
                htmlClass: 'activity-craft-recipe-ingredient-icon',
                htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-icon`,
                htmlParent: activityCraftRecipeIngredientEntity,
            });
            activityCraftRecipeIngredientIconEntity.style.backgroundImage =
                `url(${getSpritePath(`item_${itemRecipes[i].ingredients[j].name.toLowerCase()}`)})`;

            const activityCraftRecipeIngredientNameEntity = createEntity({
                entityId: activityEntityId,
                htmlAbsolute: false,
                htmlClass: 'activity-craft-recipe-ingredient-name',
                htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-name`,
                htmlParent: activityCraftRecipeIngredientEntity,
            });
            activityCraftRecipeIngredientNameEntity.textContent = itemRecipes[i].ingredients[j].name;

            const activityCraftRecipeIngredientAmountEntity = createEntity({
                entityId: activityEntityId,
                htmlAbsolute: false,
                htmlClass: 'activity-craft-recipe-ingredient-amount',
                htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-amount`,
                htmlParent: activityCraftRecipeIngredientEntity,
            });
            activityCraftRecipeIngredientAmountEntity.textContent = `x${itemRecipes[i].ingredients[j].amount}`;
        }
    }

    updateSelectActivityCraft({ activityCraftData, activityEntityId });
};

export const updateSelectActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => {
    const activityCraftRecipesEntity = getEntity({ entityId: `${activityEntityId}-activity-craft-recipes` });

    for (let i = 0; i < activityCraftRecipesEntity.children.length; i++) {
        const activityCraftRecipeEntity = getEntity({ entityId: `${activityEntityId}-activity-craft-recipe-${i}` });
        activityCraftRecipeEntity.style.border = 'solid 4px rgb(70, 70, 70)';
    }

    const selectedActivityCraftRecipeEntity =
        getEntity({ entityId: `${activityEntityId}-activity-craft-recipe-${activityCraftData._currentRecipeIndex}` });
    selectedActivityCraftRecipeEntity.style.border = 'solid 4px red';
};

export const endSelectActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-craft-recipes` });
};

export const startPlayActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => {
    const activityCraftEntity = getEntity({ entityId: `${activityEntityId}-activity-craft` });

    const activityCraftProgressEntity = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-craft-progress',
        htmlId: `${activityEntityId}-activity-craft-progress`,
        htmlParent: activityCraftEntity,
    });

    const activityCraftProgressLabelEntity = createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-craft-progress-label',
        htmlId: `${activityEntityId}-activity-craft-progress-label`,
        htmlParent: activityCraftProgressEntity,
    });
    activityCraftProgressLabelEntity.textContent = 'Craft: ';

    createEntity({
        entityId: activityEntityId,
        htmlAbsolute: false,
        htmlClass: 'activity-craft-progress-value',
        htmlId: `${activityEntityId}-activity-craft-progress-value`,
        htmlParent: activityCraftProgressEntity,
    });

    updatePlayActivityCraft({ activityCraftData, activityEntityId });
};

export const updatePlayActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityCraftData: ActivityCraftData,
    activityEntityId: string
}) => {
    const activityCraftProgressValueEntity =
        getEntity({ entityId: `${activityEntityId}-activity-craft-progress-value` });
    activityCraftProgressValueEntity.innerHTML =
        `<progress value="${activityCraftData._hitCount}" max="${10}"></progress>`;
};

export const endPlayActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-craft-progress` });
};

export const endActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-craft` });
};
//#endregion
//#endregion
