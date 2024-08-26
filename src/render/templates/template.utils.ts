import { error } from '@/engine/services/error';

//#region CONSTANTS
const spriteFiles: Record<string, { default: string }>
    = import.meta.glob('../../assets/sprites/**/*.png', { eager: true });
//#endregion

//#region UTILS
export const getSpritePath = (spriteName: string) => {
    const spriteKey = spriteName.replace(/^(.*?)(\/[^/]+)?(\.[^./]+)?$/, '$1').split('_')[0];
    const spritePath = `../../assets/sprites/${spriteKey}/${spriteName}.png`;

    return spriteFiles[spritePath].default
        ?? error({ message: `Sprite ${spriteName} not found`, where: getSpritePath.name });
};

export const getEntity = ({ entityId }: { entityId: string }) => {
    const entity = document.getElementById(entityId)
        ?? error({ message: `HTML Entity ${entityId} does not exist`, where: getEntity.name });

    return entity;
};

export const checkEntity = ({ entityId }: { entityId: string }) => {
    return document.getElementById(entityId) !== null;
};

export const searchEntityById = ({ partialEntityId }: { partialEntityId: string }) => {
    return document.querySelectorAll(`[id*="${partialEntityId}"]`)[0] as HTMLElement
        ?? error({ message: `HTML Entity ${partialEntityId} does not exist`, where: searchEntityById.name });
};

export const searchEntitiesByClassName = ({ className }: { className: string }) => {
    const entities = [...document.querySelectorAll(`.${className}`)] as HTMLElement[];

    return (entities.length)
        ? entities
        : error({
            message: `HTML Entities with class ${className} does not exist`,
            where: searchEntitiesByClassName.name,
        });
};

export const getSettingId = ({ settingName }: { settingName: string }) => {
    return settingName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export const getSettingName = ({ settingId }: { settingId: string }) => {
    return settingId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};
//#endregion
