import { Component } from '../../engine/components/@component';
import { Dialog } from '../../engine/components/dialog';
import { Inventory } from '../../engine/components/inventory';
import { Position } from '../../engine/components/position';
import { ActivityBugData, ActivityCraftData, ActivityFishData, Resource } from '../../engine/components/resource';
import { Sprite } from '../../engine/components/sprite';
import { Tile, TileMap } from '../../engine/components/tilemap';
import { Event, EventTypes, onInputKeyDown as engineOnInputKeyDown } from '../../engine/event';
import { error } from '../../engine/services/error';
import { createEntity, createSprite, destroyEntity, updatePosition } from '../templates/template';

import {
    onActivityBugEnd,
    onActivityBugStart,
    onActivityBugUpdate,
    onActivityCraftEnd,
    onActivityCraftPlayEnd,
    onActivityCraftPlayStart,
    onActivityCraftPlayUpdate,
    onActivityCraftSelectEnd,
    onActivityCraftSelectStart,
    onActivityCraftSelectUpdate,
    onActivityCraftStart,
    onActivityEnd,
    onActivityFishEnd,
    onActivityFishStart,
    onActivityFishUpdate,
    onActivityStart,
    onActivityWin,
} from './event.activity';
import { onDialogEnd, onDialogNext, onDialogStart } from './event.dialog';
import { onEntityInventoryCreate, onEntityInventoryDisplay, onEntityInventoryUpdate } from './event.inventory';
import { onTileMapCreate, onTileMapTileCreate } from './event.tilemap';

export const onInputKeyDown = (e: any) => engineOnInputKeyDown(e.key);

//#region HELPERS
export const checkPositionData = (data: any): data is Position => data;
export const checkSpriteData = (data: any): data is Sprite => data;
export const checkInventoryData = (data: any): data is Inventory => data;
export const checkTileMapData = (data: any): data is TileMap => data;
export const checkTileData = (data: any): data is Tile => data;
export const checkResourceData = (data: any): data is Resource => data;
export const checkActivityBugData = (data: any): data is ActivityBugData => data;
export const checkActivityFishData = (data: any): data is ActivityFishData => data;
export const checkActivityCraftData = (data: any): data is ActivityCraftData => data;
export const checkDialogData = (data: any): data is Dialog => data;
//#endregion

//#region EVENTS
export const event = <T extends keyof Component>(event: Event<T>) => {
    try {
        /* Entity */
        if (event.type === EventTypes.ENTITY_CREATE) {
            onEntityCreate({ entityId: event.entityId });
        }
        else if (event.type === EventTypes.ENTITY_DESTROY) {
            onEntityDestroy({ entityId: event.entityId });
        }
        else if (event.type === EventTypes.ENTITY_POSITION_UPDATE && checkPositionData(event.data)) {
            onEntityPositionUpdate({
                entityId: event.entityId,
                position: event.data,
            });
        }
        else if (event.type === EventTypes.ENTITY_SPRITE_CREATE && checkSpriteData(event.data)) {
            onEntitySpriteCreate({
                entityId: event.entityId,
                sprite: event.data,
            });
        }
        /* Inventory */
        else if (event.type === EventTypes.INVENTORY_CREATE && checkInventoryData(event.data)) {
            onEntityInventoryCreate({
                entityId: event.entityId,
                inventory: event.data,
            });
        }
        else if (event.type === EventTypes.INVENTORY_DISPLAY) {
            onEntityInventoryDisplay({ entityId: event.entityId });
        }
        else if (event.type === EventTypes.INVENTORY_UPDATE && checkInventoryData(event.data)) {
            onEntityInventoryUpdate({
                entityId: event.entityId,
                inventory: event.data,
            });
        }
        /* Tilemap */
        else if (event.type === EventTypes.TILEMAP_CREATE && checkTileMapData(event.data)) {
            onTileMapCreate({
                tilemap: event.data,
                tilemapEntityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.TILEMAP_TILE_CREATE && checkTileData(event.data)) {
            onTileMapTileCreate({
                tile: event.data,
                tilemapEntityId: event.entityId,
            });
        }
        /* Activity */
        else if (event.type === EventTypes.ACTIVITY_START) {
            onActivityStart({ activityEntityId: event.entityId });
        }
        else if (event.type === EventTypes.ACTIVITY_WIN && checkResourceData(event.data)) {
            onActivityWin({
                activityEntityId: event.entityId,
                resource: event.data,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_END) {
            onActivityEnd({ activityEntityId: event.entityId });
        }
        else if (event.type === EventTypes.ACTIVITY_BUG_START && checkActivityBugData(event.data)) {
            onActivityBugStart({
                activityBugData: event.data,
                activityEntityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_BUG_UPDATE && checkActivityBugData(event.data)) {
            onActivityBugUpdate({
                activityBugData: event.data,
                activityEntityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_BUG_END) {
            onActivityBugEnd({ activityEntityId: event.entityId });
        }
        else if (event.type === EventTypes.ACTIVITY_FISH_START && checkActivityFishData(event.data)) {
            onActivityFishStart({
                activityEntityId: event.entityId,
                activityFishData: event.data,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_FISH_UPDATE && checkActivityFishData(event.data)) {
            onActivityFishUpdate({
                activityEntityId: event.entityId,
                activityFishData: event.data,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_FISH_END) {
            onActivityFishEnd({ activityEntityId: event.entityId });
        }
        else if (event.type === EventTypes.ACTIVITY_CRAFT_START) {
            onActivityCraftStart({ activityEntityId: event.entityId });
        }
        else if (event.type === EventTypes.ACTIVITY_CRAFT_SELECT_START && checkActivityCraftData(event.data)) {
            onActivityCraftSelectStart({
                activityCraftData: event.data,
                activityEntityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_CRAFT_SELECT_UPDATE && checkActivityCraftData(event.data)) {
            onActivityCraftSelectUpdate({
                activityCraftData: event.data,
                activityEntityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_CRAFT_SELECT_END) {
            onActivityCraftSelectEnd({ activityEntityId: event.entityId });
        }
        else if (event.type === EventTypes.ACTIVITY_CRAFT_PLAY_START && checkActivityCraftData(event.data)) {
            onActivityCraftPlayStart({
                activityCraftData: event.data,
                activityEntityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_CRAFT_PLAY_UPDATE && checkActivityCraftData(event.data)) {
            onActivityCraftPlayUpdate({
                activityCraftData: event.data,
                activityEntityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_CRAFT_PLAY_END) {
            onActivityCraftPlayEnd({ activityEntityId: event.entityId });
        }
        else if (event.type === EventTypes.ACTIVITY_CRAFT_END) {
            onActivityCraftEnd({ activityEntityId: event.entityId });
        }
        /* Dialog */
        else if (event.type === EventTypes.DIALOG_START && checkDialogData(event.data)) {
            onDialogStart({
                dialog: event.data,
                entityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.DIALOG_UPDATE && checkDialogData(event.data)) {
            onDialogNext({
                dialog: event.data,
                entityId: event.entityId,
            });
        }
        else if (event.type === EventTypes.DIALOG_END) {
            onDialogEnd({ entityId: event.entityId });
        }
        else error({ message: `Unknown Event type: ${event.type}`, where: 'event' });
    }
    catch (e) {
        console.error(e);
    }
};

const onEntityCreate = ({ entityId }: { entityId: string }) => createEntity({ entityId });

const onEntityDestroy = ({ entityId }: { entityId: string }) => destroyEntity({ entityId });

const onEntityPositionUpdate = ({ entityId, position }: {
    entityId: string,
    position: Position,
}) => updatePosition({ entityId, position });

const onEntitySpriteCreate = ({ entityId, sprite }: {
    entityId: string,
    sprite: Sprite,
}) => createSprite({ entityId, sprite });
//#endregion
