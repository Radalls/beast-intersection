import { Resource, ActivityBugData, ActivityFishData, ActivityCraftData } from "../../engine/components/resource";
import { checkEntity, createEntity, destroyEntity, getEntity, getSpritePath } from "./template";
import itemRecipes from '../../assets/items/item_recipes.json';

//#region CONSTANTS
//#endregion

//#region TEMPLATES
//#region MAIN ACTIVITY
export const startActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity`,
        htmlClass: "activity",
    });
}

export const winActivity = ({ activityEntityId, resource }: {
    activityEntityId: string,
    resource: Resource,
}) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });
    activityEntity.style.visibility = 'hidden';

    const activityEntityWin = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-win`,
        htmlClass: "activity-win",
    });

    activityEntityWin.textContent = `You get ${resource.item?.info._name}!`;
}

export const endActivity = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity` });
    if (checkEntity({ entityId: `${activityEntityId}-activity-win` })) {
        destroyEntity({ entityId: `${activityEntityId}-activity-win` });
    }
}
//#endregion

//#region ACTIVITY BUG
export const startActivityBug = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => {
    const activityEntity = getEntity({ entityId: `${activityEntityId}-activity` });

    const activityBugEntity = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug`,
        htmlClass: "activity-bug",
        htmlParent: activityEntity,
        htmlAbsolute: false,
    });

    const activityBugEntityScore = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntity,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score-hp`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntityScore,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-score-error`,
        htmlClass: "activity-bug-score",
        htmlParent: activityBugEntityScore,
        htmlAbsolute: false,
    });

    const activityBugEntitySymbol = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol`,
        htmlClass: "activity-bug-symbol",
        htmlParent: activityBugEntity,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol-value`,
        htmlClass: "activity-bug-symbol-value",
        htmlParent: activityBugEntitySymbol,
        htmlAbsolute: false,
    });

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-bug-symbol-found`,
        htmlClass: "activity-bug-symbol-found",
        htmlParent: activityBugEntitySymbol,
        htmlAbsolute: false,
    });

    updateActivityBug({ activityEntityId, activityBugData });
};

export const updateActivityBug = ({ activityEntityId, activityBugData }: {
    activityEntityId: string,
    activityBugData: ActivityBugData,
}) => {
    const activityBugEntityScoreHp = getEntity({ entityId: `${activityEntityId}-activity-bug-score-hp` });
    activityBugEntityScoreHp.textContent = `HP: ${activityBugData._hp}`;

    const activityBugEntityScoreError = getEntity({ entityId: `${activityEntityId}-activity-bug-score-error` });
    activityBugEntityScoreError.textContent = `Errors: ${activityBugData._nbErrors}/${activityBugData._maxNbErrors}`;

    const activityBugEntitySymbolValue = getEntity({ entityId: `${activityEntityId}-activity-bug-symbol-value` });
    activityBugEntitySymbolValue.textContent = `Press: ${activityBugData._symbol ?? '...'}`;

    const activityBugEntitySymbolFound = getEntity({ entityId: `${activityEntityId}-activity-bug-symbol-found` });
    if (activityBugData._symbolFound === undefined) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_blank.png')})`;
    }
    else if (activityBugData._symbolFound === true) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_found.png')})`;
    }
    else if (activityBugData._symbolFound === false) {
        activityBugEntitySymbolFound.style.backgroundImage = `url(${getSpritePath('activity_bug_symbol_error.png')})`;
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
        htmlId: `${activityEntityId}-activity-fish`,
        htmlClass: "activity-fish",
        htmlParent: activityEntity,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBars = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-hp-bars`,
        htmlClass: "activity-fish-hp-bars",
        htmlParent: activityFishEntity,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBarsFishHp = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-hp`,
        htmlClass: "activity-fish-hp",
        htmlParent: activityFishEntityHpBars,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBarsFishHpLabel = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-hp-label`,
        htmlClass: "activity-fish-hp-label",
        htmlParent: activityFishEntityHpBarsFishHp,
        htmlAbsolute: false,
    });
    activityFishEntityHpBarsFishHpLabel.textContent = "Fish HP: ";

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-hp-value`,
        htmlClass: "activity-fish-hp-value",
        htmlParent: activityFishEntityHpBarsFishHp,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBarsRodTension = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-rod-tension`,
        htmlClass: "activity-fish-rod-tension",
        htmlParent: activityFishEntityHpBars,
        htmlAbsolute: false,
    });

    const activityFishEntityHpBarsRodTensionLabel = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-rod-tension-label`,
        htmlClass: "activity-fish-rod-tension-label",
        htmlParent: activityFishEntityHpBarsRodTension,
        htmlAbsolute: false,
    });
    activityFishEntityHpBarsRodTensionLabel.textContent = "Rod Tension: ";

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-rod-tension-value`,
        htmlClass: "activity-fish-rod-tension-value",
        htmlParent: activityFishEntityHpBarsRodTension,
        htmlAbsolute: false,
    });

    const activityFishEntityFrenzy = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-frenzy`,
        htmlClass: "activity-fish-frenzy",
        htmlParent: activityFishEntity,
        htmlAbsolute: false,
    });

    const activityFishEntityFrenzyLabel = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-frenzy-label`,
        htmlClass: "activity-fish-frenzy-label",
        htmlParent: activityFishEntityFrenzy,
        htmlAbsolute: false,
    });
    activityFishEntityFrenzyLabel.textContent = "Frenzy: ";

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-fish-frenzy-value`,
        htmlClass: "activity-fish-frenzy-value",
        htmlParent: activityFishEntityFrenzy,
        htmlAbsolute: false,
    });

    updateActivityFish({ activityEntityId, activityFishData });
};

export const updateActivityFish = ({ activityEntityId, activityFishData }: {
    activityEntityId: string,
    activityFishData: ActivityFishData,
}) => {
    const activityFishEntityHpBarsFishHpValue = getEntity({ entityId: `${activityEntityId}-activity-fish-hp-value` });
    activityFishEntityHpBarsFishHpValue.innerHTML = `<progress value="${activityFishData._fishHp}" max="${activityFishData._fishMaxHp}"></progress>`;

    const activityFishEntityHpBarsRodTensionValue = getEntity({ entityId: `${activityEntityId}-activity-fish-rod-tension-value` });
    activityFishEntityHpBarsRodTensionValue.innerHTML = `<progress value="${activityFishData._rodTension}" max="${activityFishData._rodMaxTension}"></progress>`;

    const activityFishEntityFrenzyValue = getEntity({ entityId: `${activityEntityId}-activity-fish-frenzy-value` });
    activityFishEntityFrenzyValue.style.backgroundImage = (activityFishData._isFrenzy)
        ? `url(${getSpritePath('activity_fish_frenzy_on.png')})`
        : `url(${getSpritePath('activity_fish_frenzy_off.png')})`;
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
        htmlId: `${activityEntityId}-activity-craft`,
        htmlClass: "activity-craft",
        htmlParent: activityEntity,
        htmlAbsolute: false,
    });
}

export const startSelectActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityEntityId: string,
    activityCraftData: ActivityCraftData,
}) => {
    const activityCraftEntity = getEntity({ entityId: `${activityEntityId}-activity-craft` });

    const activityCraftRecipesEntity = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-craft-recipes`,
        htmlClass: "activity-craft-recipes",
        htmlParent: activityCraftEntity,
        htmlAbsolute: false,
    });

    for (let i = 0; i < itemRecipes.length; i++) {
        const activityCraftRecipeEntity = createEntity({
            entityId: activityEntityId,
            htmlId: `${activityEntityId}-activity-craft-recipe-${i}`,
            htmlClass: "activity-craft-recipe",
            htmlParent: activityCraftRecipesEntity,
            htmlAbsolute: false,
        });

        const activityCraftRecipeIconEntity = createEntity({
            entityId: activityEntityId,
            htmlId: `${activityEntityId}-activity-craft-recipe-${i}-icon`,
            htmlClass: "activity-craft-recipe-icon",
            htmlParent: activityCraftRecipeEntity,
            htmlAbsolute: false,
        });
        activityCraftRecipeIconEntity.style.backgroundImage = `url(${getSpritePath(`item_${itemRecipes[i].name.toLowerCase()}.png`)})`;

        const activityCraftRecipeNameEntity = createEntity({
            entityId: activityEntityId,
            htmlId: `${activityEntityId}-activity-craft-recipe-${i}-name`,
            htmlClass: "activity-craft-recipe-name",
            htmlParent: activityCraftRecipeEntity,
            htmlAbsolute: false,
        });
        activityCraftRecipeNameEntity.textContent = itemRecipes[i].name;

        const activityCraftRecipeIngredientsEntity = createEntity({
            entityId: activityEntityId,
            htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredients`,
            htmlClass: "activity-craft-recipe-ingredients",
            htmlParent: activityCraftRecipeEntity,
            htmlAbsolute: false,
        });

        for (let j = 0; j < itemRecipes[i].ingredients.length; j++) {
            const activityCraftRecipeIngredientEntity = createEntity({
                entityId: activityEntityId,
                htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}`,
                htmlClass: "activity-craft-recipe-ingredient",
                htmlParent: activityCraftRecipeIngredientsEntity,
                htmlAbsolute: false,
            });

            const activityCraftRecipeIngredientIconEntity = createEntity({
                entityId: activityEntityId,
                htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-icon`,
                htmlClass: "activity-craft-recipe-ingredient-icon",
                htmlParent: activityCraftRecipeIngredientEntity,
                htmlAbsolute: false,
            });
            activityCraftRecipeIngredientIconEntity.style.backgroundImage = `url(${getSpritePath(`item_${itemRecipes[i].ingredients[j].name.toLowerCase()}.png`)})`;

            const activityCraftRecipeIngredientNameEntity = createEntity({
                entityId: activityEntityId,
                htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-name`,
                htmlClass: "activity-craft-recipe-ingredient-name",
                htmlParent: activityCraftRecipeIngredientEntity,
                htmlAbsolute: false,
            });
            activityCraftRecipeIngredientNameEntity.textContent = itemRecipes[i].ingredients[j].name;

            const activityCraftRecipeIngredientAmountEntity = createEntity({
                entityId: activityEntityId,
                htmlId: `${activityEntityId}-activity-craft-recipe-${i}-ingredient-${j}-amount`,
                htmlClass: "activity-craft-recipe-ingredient-amount",
                htmlParent: activityCraftRecipeIngredientEntity,
                htmlAbsolute: false,
            });
            activityCraftRecipeIngredientAmountEntity.textContent = `x${itemRecipes[i].ingredients[j].amount}`;
        }
    }

    updateSelectActivityCraft({ activityEntityId, activityCraftData });
};

export const updateSelectActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityEntityId: string,
    activityCraftData: ActivityCraftData,
}) => {
    const activityCraftRecipesEntity = getEntity({ entityId: `${activityEntityId}-activity-craft-recipes` });

    for (let i = 0; i < activityCraftRecipesEntity.children.length; i++) {
        const activityCraftRecipeEntity = getEntity({ entityId: `${activityEntityId}-activity-craft-recipe-${i}` });
        activityCraftRecipeEntity.style.border = 'solid 4px rgb(70, 70, 70)';
    }

    const selectedActivityCraftRecipeEntity = getEntity({ entityId: `${activityEntityId}-activity-craft-recipe-${activityCraftData._currentRecipeIndex}` });
    selectedActivityCraftRecipeEntity.style.border = 'solid 4px red';
};

export const endSelectActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-craft-recipes` });
};

export const startPlayActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityEntityId: string,
    activityCraftData: ActivityCraftData,
}) => {
    const activityCraftEntity = getEntity({ entityId: `${activityEntityId}-activity-craft` });

    const activityCraftProgressEntity = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-craft-progress`,
        htmlClass: "activity-craft-progress",
        htmlParent: activityCraftEntity,
        htmlAbsolute: false,
    });

    const activityCraftProgressLabelEntity = createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-craft-progress-label`,
        htmlClass: "activity-craft-progress-label",
        htmlParent: activityCraftProgressEntity,
        htmlAbsolute: false,
    });
    activityCraftProgressLabelEntity.textContent = "Craft: ";

    createEntity({
        entityId: activityEntityId,
        htmlId: `${activityEntityId}-activity-craft-progress-value`,
        htmlClass: "activity-craft-progress-value",
        htmlParent: activityCraftProgressEntity,
        htmlAbsolute: false,
    });

    updatePlayActivityCraft({ activityEntityId, activityCraftData });
};

export const updatePlayActivityCraft = ({ activityEntityId, activityCraftData }: {
    activityEntityId: string,
    activityCraftData: ActivityCraftData,
}) => {
    const activityCraftProgressValueEntity = getEntity({ entityId: `${activityEntityId}-activity-craft-progress-value` });
    activityCraftProgressValueEntity.innerHTML = `<progress value="${activityCraftData._hitCount}" max="${10}"></progress>`;
};

export const endPlayActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-craft-progress` });
};

export const endActivityCraft = ({ activityEntityId }: { activityEntityId: string }) => {
    destroyEntity({ entityId: `${activityEntityId}-activity-craft` });
};
//#endregion
//#endregion
