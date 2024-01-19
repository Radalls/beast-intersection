type InventoryData = {
    itemRules: ItemRule[];
};

type ItemRule = {
    itemName: 'Leaf' | 'Stick' | 'Rock';
    maxAmount: number;
};

export const findItemRule = (itemName: string) => inventoryData.itemRules.find((rule) => rule.itemName === itemName);

export const inventoryData: InventoryData = {
    itemRules: [
        {
            itemName: 'Leaf',
            maxAmount: 5,
        },
        {
            itemName: 'Stick',
            maxAmount: 3,
        },
        {
            itemName: 'Rock',
            maxAmount: 2,
        }
    ]
}