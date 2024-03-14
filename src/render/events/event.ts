import { Event } from '../../engine/event';
import { Position } from "../../engine/components/position";
import { Sprite } from "../../engine/components/sprite";
import { Tile, TileMap } from "../../engine/components/tilemap";
import { EventTypes, onInputKeyDown as engineOnInputKeyDown } from "../../engine/event";
import { ActivityBugData, ActivityFishData, Resource } from '../../engine/components/resource';
import { createEntity, destroyEntity, updatePosition, createSprite } from '../templates/template';
import { onActivityStart, onActivityWin, onActivityEnd, onActivityBugStart, onActivityBugUpdate, onActivityBugEnd, onActivityFishStart, onActivityFishUpdate, onActivityFishEnd } from './event.activity';
import { onEntityInventoryCreate, onEntityInventoryDisplay, onEntityInventoryUpdate } from './event.inventory';
import { onTileMapCreate, onTileMapTileCreate } from './event.tilemap';
import { error } from '../../engine/services/error';
import { Component } from '../../engine/components/@component';
import { Inventory } from '../../engine/components/inventory';
import { Dialog } from '../../engine/components/dialog';
import { onDialogStart, onDialogNext, onDialogEnd } from './event.dialog';

export const onInputKeyDown = (e: any) => { engineOnInputKeyDown(e.key); };

//#region HELPERS
const checkPositionData = (data: any): data is Position => data
const checkSpriteData = (data: any): data is Sprite => data
const checkInventoryData = (data: any): data is Inventory => data
const checkTileMapData = (data: any): data is TileMap => data
const checkTileData = (data: any): data is Tile => data
const checkResourceData = (data: any): data is Resource => data
const checkActivityBugData = (data: any): data is ActivityBugData => data
const checkActivityFishData = (data: any): data is ActivityFishData => data
const checkDialogData = (data: any): data is Dialog => data
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
                tilemapEntityId: event.entityId,
                tilemap: event.data,
            });
        }
        else if (event.type === EventTypes.TILEMAP_TILE_CREATE && checkTileData(event.data)) {
            onTileMapTileCreate({
                tilemapEntityId: event.entityId,
                tile: event.data,
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
                activityEntityId: event.entityId,
                activityBugData: event.data,
            });
        }
        else if (event.type === EventTypes.ACTIVITY_BUG_UPDATE && checkActivityBugData(event.data)) {
            onActivityBugUpdate({
                activityEntityId: event.entityId,
                activityBugData: event.data,
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
        /* Dialog */
        else if (event.type === EventTypes.DIALOG_START && checkDialogData(event.data)) {
            onDialogStart({
                entityId: event.entityId,
                dialog: event.data,
            });
        }
        else if (event.type === EventTypes.DIALOG_UPDATE && checkDialogData(event.data)) {
            onDialogNext({
                entityId: event.entityId,
                dialog: event.data,
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
