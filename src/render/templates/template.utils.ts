import { error } from '@/engine/services/error';

//#region CONSTANTS
const spriteFiles: Record<string, { default: string }>
    = import.meta.glob('/src/assets/sprites/**/*.png', { eager: true });
//#endregion

//#region UTILS
export const getSpritePath = (spriteName: string) => {
    const spriteKey = spriteName.replace(/^(.*?)(\/[^/]+)?(\.[^./]+)?$/, '$1').split('_')[0];
    const spritePath = `/src/assets/sprites/${spriteKey}/${spriteName}.png`;

    return spriteFiles[spritePath].default
        ?? error({ message: `Sprite ${spriteName} not found`, where: getSpritePath.name });
};

export const getElement = ({ elementId }: { elementId: string }) => {
    return document.getElementById(elementId)
        ?? error({ message: `Element ${elementId} does not exist`, where: getElement.name });
};

export const checkElement = ({ elementId }: { elementId: string }) => {
    return document.getElementById(elementId) !== null;
};

export const searchElementById = ({ partialElementId }: { partialElementId: string }) => {
    return [...document.querySelectorAll(`[id*="${partialElementId}"]`)] as HTMLElement[]
        ?? error({ message: `Element ${partialElementId} does not exist`, where: searchElementById.name });
};

export const searchElementsByClassName = ({ className }: { className: string }) => {
    const elements = [...document.querySelectorAll(`.${className}`)] as HTMLElement[];

    return (elements.length)
        ? elements
        : error({
            message: `No element with class ${className} found`,
            where: searchElementsByClassName.name,
        });
};
//#endregion
