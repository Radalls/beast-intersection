import { Item } from './inventory';

export type Resource = {
    _: 'Resource',
    _activityType: ActivityTypes,
    _isTemporary: boolean,
    activityData?: ActivityData,
    item?: Item,
};

export enum ActivityTypes {
    BUG = 'BUG',
    CRAFT = 'CRAFT',
    FISH = 'FISH',
    ITEM = 'ITEM'
}

export type ActivityData = ActivityBugData | ActivityFishData | ActivityCraftData;

export type ActivityBugData = {
    _hp: number,
    _maxHp: number,
    _maxNbErrors: number,
    _nbErrors: number,
    _symbol?: string,
    _symbolFound?: boolean,
    _symbolInterval: number
}

export type ActivityFishData = {
    _fishDamage: number,
    _fishHp: number,
    _fishMaxHp: number,
    _frenzyDuration: number,
    _frenzyInterval: number,
    _isFrenzy?: boolean,
    _rodDamage: number,
    _rodMaxTension: number,
    _rodTension: number
}

export type ActivityCraftData = {
    _currentRecipeId?: number,
    _currentRecipeIndex?: number,
    _hitCount?: number,
    _maxNbErrors: number,
    _nbErrors: number
}
