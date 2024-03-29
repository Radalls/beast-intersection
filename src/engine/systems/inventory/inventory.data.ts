import itemRules from '../../../assets/items/item_rules.json';

export const findItemRule = (itemName: string) => itemRules.find((rule) => rule.name === itemName);
