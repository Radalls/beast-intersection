// maxAmount is always 2
export const findItemRule = (itemName: string) => {
    return {
        id: 1,
        name: itemName,
        maxAmount: 2,
    };
};