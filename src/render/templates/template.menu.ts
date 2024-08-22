import { createEntity, getEntity } from './template';

//#region CONSTANTS
//#endregion

//#region TEMPLATES
export const createLoading = () => {
    const entityLoading = createEntity({
        entityId: 'Loading',
        htmlClass: 'loading',
    });

    createEntity({
        entityId: 'LoadingLoader',
        htmlAbsolute: false,
        htmlClass: 'loader',
        htmlParent: entityLoading,
    });
};

export const displayLoading = ({ display }: { display: boolean }) => {
    const entityLoading = getEntity({ entityId: 'Loading' });

    if (display) {
        entityLoading.style.display = 'flex';
    }
    else {
        setTimeout(() => {
            entityLoading.style.display = 'none';
        }, 100);
    }
};
//#endregion
