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
import { onAudioPlay, onAudioStop } from './event.audio';
import { onDialogEnd, onDialogNext, onDialogStart } from './event.dialog';
import { onEnergyCreate, onEnergyDisplay, onEnergyUpdate } from './event.energy';
import {
    onInventoryCreate,
    onInventoryDisplay,
    onInventoryToolActivate,
    onInventoryToolActiveDisplay,
    onInventoryToolsUpdate,
    onInventoryUpdate,
} from './event.inventory';
import { onLoadingDisplay, onSettingsMenuDisplay, onSettingsMenuDisplayEdit, onSettingsMenuUpdate } from './event.menu';
import { onTileMapCreate, onTileMapTileCreate, onTileMapTileDestroy } from './event.tilemap';
import { onEntityCreate, onEntityDestroy, onEntityPositionUpdate, onEntitySpriteCreate } from './event.utils';

import { Component } from '@/engine/components/@component';
import { Dialog } from '@/engine/components/dialog';
import { Energy } from '@/engine/components/energy';
import { Inventory } from '@/engine/components/inventory';
import { AudioData, Manager } from '@/engine/components/manager';
import { Position } from '@/engine/components/position';
import { Resource, ActivityBugData, ActivityFishData, ActivityCraftData } from '@/engine/components/resource';
import { Sprite } from '@/engine/components/sprite';
import { TileMap, Tile } from '@/engine/components/tilemap';
import { onInputKeyDown as engineOnInputKeyDown, Event } from '@/engine/event';
import { EventTypes } from '@/engine/event';
import { error } from '@/engine/services/error';

//#region HELPERS
export const onInputKeyDown = (e: any) => engineOnInputKeyDown(e.key);

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
export const checkManagerData = (data: any): data is Manager => data;
export const checkAudioData = (data: any): data is AudioData => data;
export const checkEnergyData = (data: any): data is Energy => data;
//#endregion

//#region EVENTS
export const event = <T extends keyof Component>(event: Event<T>) => {
    /* Activity */
    if (event.type === EventTypes.ACTIVITY_START) {
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
    /* Audio */
    else if (event.type === EventTypes.AUDIO_PLAY && checkAudioData(event.data)) {
        onAudioPlay({ audioName: event.data.audioName, loop: event.data.loop, volume: event.data.volume });
    }
    else if (event.type === EventTypes.AUDIO_STOP && checkAudioData(event.data)) {
        onAudioStop({ audioName: event.data.audioName });
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
    /* Energy */
    else if (event.type === EventTypes.ENERGY_CREATE && checkEnergyData(event.data)) {
        onEnergyCreate({ energy: event.data, entityId: event.entityId });
    }
    else if (event.type === EventTypes.ENERGY_DISPLAY) {
        onEnergyDisplay({ entityId: event.entityId });
    }
    else if (event.type === EventTypes.ENERGY_UPDATE && checkEnergyData(event.data)) {
        onEnergyUpdate({ energy: event.data, entityId: event.entityId });
    }
    /* Entity */
    else if (event.type === EventTypes.ENTITY_CREATE) {
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
        onInventoryCreate({
            entityId: event.entityId,
            inventory: event.data,
        });
    }
    else if (event.type === EventTypes.INVENTORY_DISPLAY) {
        onInventoryDisplay({ entityId: event.entityId });
    }
    else if (event.type === EventTypes.INVENTORY_UPDATE && checkInventoryData(event.data)) {
        onInventoryUpdate({
            entityId: event.entityId,
            inventory: event.data,
        });
    }
    else if (event.type === EventTypes.INVENTORY_TOOL_ACTIVATE && checkInventoryData(event.data)) {
        onInventoryToolActivate({
            entityId: event.entityId,
            inventory: event.data,
        });
    }
    else if (event.type === EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY) {
        onInventoryToolActiveDisplay({ entityId: event.entityId });
    }
    else if (event.type === EventTypes.INVENTORY_TOOL_UPDATE && checkInventoryData(event.data)) {
        onInventoryToolsUpdate({
            entityId: event.entityId,
            inventory: event.data,
        });
    }
    /* Menu */
    else if (event.type === EventTypes.MENU_LOADING_ON || event.type === EventTypes.MENU_LOADING_OFF) {
        onLoadingDisplay({ display: event.type === EventTypes.MENU_LOADING_ON });
    }
    else if (event.type === EventTypes.MENU_SETTINGS_DISPLAY) {
        onSettingsMenuDisplay();
    }
    else if (event.type === EventTypes.MENU_SETTINGS_UPDATE && checkManagerData(event.data)) {
        onSettingsMenuUpdate({ manager: event.data });
    }
    else if (event.type === EventTypes.MENU_SETTINGS_DISPLAY_EDIT) {
        onSettingsMenuDisplayEdit();
    }
    /* Tilemap */
    else if (event.type === EventTypes.TILEMAP_CREATE && checkTileMapData(event.data)) {
        onTileMapCreate({
            tileMap: event.data,
            tileMapEntityId: event.entityId,
        });
    }
    else if (event.type === EventTypes.TILEMAP_TILE_CREATE && checkTileData(event.data)) {
        onTileMapTileCreate({
            tile: event.data,
            tileMapEntityId: event.entityId,
        });
    }
    else if (event.type === EventTypes.TILEMAP_TILE_DESTROY && checkTileData(event.data)) {
        onTileMapTileDestroy({
            tile: event.data,
            tileMapEntityId: event.entityId,
        });
    }
    else error({ message: `Unknown Event type: ${event.type}`, where: 'event' });
};
//#endregion
