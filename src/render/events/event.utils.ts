import { Tile } from '@/engine/components/tilemap';
import { getComponent } from '@/engine/entities';
import { ErrorData } from '@/engine/services/error';
import { onInputKeyDown as engineOnInputKeyDown } from '@/engine/services/event';
import { AudioData } from '@/render/audio';
import { createElement, destroyElement, updatePosition, createSprite, getElement } from '@/render/templates';

//#region UTILS
export const onEntityCreate = ({ entityId }: { entityId: string }) => createElement({ entityId });

export const onEntityDestroy = ({ entityId }: { entityId: string }) => destroyElement({ elementId: entityId });

export const onEntityDisplay = ({ entityId }: { entityId: string }) => {
    const state = getComponent({ componentId: 'State', entityId });

    const element = getElement({ elementId: entityId });

    element.style.display = (state._active) ? 'block' : 'none';
};

export const onEntityPositionUpdate = ({ entityId }: { entityId: string }) => updatePosition({ elementId: entityId });

export const onEntitySpriteCreate = ({ entityId }: { entityId: string }) => createSprite({ elementId: entityId });

export const onInputKeyDown = (e: any) => engineOnInputKeyDown(e.key);

export const checkAudioData = (data: any): data is AudioData => data;

export const checkTileData = (data: any): data is Tile => data;

export const checkErrorData = (data: any): data is ErrorData => data;
//#endregion
