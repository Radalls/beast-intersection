// maxAmount is always 2
export const findItemRule = (itemName: string) => {
    return {
        itemName,
        maxAmount: 2,
    };
};