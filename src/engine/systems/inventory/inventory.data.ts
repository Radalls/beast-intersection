type InventoryData = {
    itemRules: ItemRule[];
};

type ItemRule = {
    itemName: 'Wood1' | 'Bug1' | 'Bug2' | 'Fish1';
    maxAmount: number;
};

export const findItemRule = (itemName: string) => inventoryData.itemRules.find((rule) => rule.itemName === itemName);

export const inventoryData: InventoryData = {
    itemRules: [
        {
            itemName: 'Wood1',
            maxAmount: 5,
        },
        {
            itemName: 'Bug1',
            maxAmount: 1,
        },
        {
            itemName: 'Bug2',
            maxAmount: 1,
        },
        {
            itemName: 'Fish1',
            maxAmount: 1,
        }
    ]
}