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
    onActivityLose,
    onActivityStart,
    onActivityWin,
} from './event.activity';
import { onAudioPlay, onAudioStop } from './event.audio';
import { onDialogEnd, onDialogNext, onDialogStart } from './event.dialog';
import { onEnergyCreate, onEnergyDisplay, onEnergyUpdate } from './event.energy';
import { onError, onLoadingDisplay } from './event.global';
import {
    onInventoryCreate,
    onInventoryDisplay,
    onInventoryOptionDisplay,
    onInventoryOptionUpdate,
    onInventorySelectSlot,
    onInventoryToolActivate,
    onInventoryToolActiveDisplay,
    onInventoryToolsUpdate,
    onInventoryUpdate,
} from './event.inventory';
import {
    onLaunchMenuDisplay,
    onLaunchMenuUpdate,
    onSettingsMenuDisplay,
    onSettingsMenuDisplayEdit,
    onSettingsMenuUpdate,
} from './event.menu';
import { onQuestComplete, onQuestEnd, onQuestsDisplay, onQuestStart } from './event.quest';
import { onTileMapCreate, onTileMapTileCreate, onTileMapTileDestroy } from './event.tilemap';
import {
    checkAudioData,
    checkErrorData,
    checkTileData,
    onEntityCreate,
    onEntityDestroy,
    onEntityDisplay,
    onEntityPositionUpdate,
    onEntitySpriteCreate,
    onEntitySpriteUpdate,
} from './event.utils';

import { Component } from '@/engine/components/@component';
import { error } from '@/engine/services/error';
import { Event } from '@/engine/services/event';
import { EventTypes } from '@/engine/services/event';
import { run } from '@/render/main';

//#region EVENTS
export const event = <T extends keyof Component>(event: Event<T>) => {
    /* Activity */
    if (event.type === EventTypes.ACTIVITY_START) onActivityStart();
    else if (event.type === EventTypes.ACTIVITY_WIN) onActivityWin();
    else if (event.type === EventTypes.ACTIVITY_LOSE) onActivityLose();
    else if (event.type === EventTypes.ACTIVITY_END) onActivityEnd();
    else if (event.type === EventTypes.ACTIVITY_BUG_START) onActivityBugStart();
    else if (event.type === EventTypes.ACTIVITY_BUG_UPDATE) onActivityBugUpdate();
    else if (event.type === EventTypes.ACTIVITY_BUG_END) onActivityBugEnd();
    else if (event.type === EventTypes.ACTIVITY_FISH_START) onActivityFishStart();
    else if (event.type === EventTypes.ACTIVITY_FISH_UPDATE) onActivityFishUpdate();
    else if (event.type === EventTypes.ACTIVITY_FISH_END) onActivityFishEnd();
    else if (event.type === EventTypes.ACTIVITY_CRAFT_START) onActivityCraftStart();
    else if (event.type === EventTypes.ACTIVITY_CRAFT_SELECT_START) onActivityCraftSelectStart();
    else if (event.type === EventTypes.ACTIVITY_CRAFT_SELECT_UPDATE) onActivityCraftSelectUpdate();
    else if (event.type === EventTypes.ACTIVITY_CRAFT_SELECT_END) onActivityCraftSelectEnd();
    else if (event.type === EventTypes.ACTIVITY_CRAFT_PLAY_START) onActivityCraftPlayStart();
    else if (event.type === EventTypes.ACTIVITY_CRAFT_PLAY_UPDATE) onActivityCraftPlayUpdate();
    else if (event.type === EventTypes.ACTIVITY_CRAFT_PLAY_END) onActivityCraftPlayEnd();
    else if (event.type === EventTypes.ACTIVITY_CRAFT_END) onActivityCraftEnd();
    /* Audio */
    else if (event.type === EventTypes.AUDIO_PLAY && checkAudioData(event.data)) {
        onAudioPlay({ audioName: event.data.audioName, loop: event.data.loop, volume: event.data.volume });
    }
    else if (event.type === EventTypes.AUDIO_STOP && checkAudioData(event.data)) {
        onAudioStop({ audioName: event.data.audioName });
    }
    /* Dialog */
    else if (event.type === EventTypes.DIALOG_START && event.entityId) onDialogStart({ entityId: event.entityId });
    else if (event.type === EventTypes.DIALOG_UPDATE && event.entityId) onDialogNext({ entityId: event.entityId });
    else if (event.type === EventTypes.DIALOG_END && event.entityId) onDialogEnd({ entityId: event.entityId });
    /* Energy */
    else if (event.type === EventTypes.ENERGY_CREATE) onEnergyCreate();
    else if (event.type === EventTypes.ENERGY_DISPLAY) onEnergyDisplay();
    else if (event.type === EventTypes.ENERGY_UPDATE) onEnergyUpdate();
    /* Entity */
    else if (event.type === EventTypes.ENTITY_CREATE && event.entityId) onEntityCreate({ entityId: event.entityId });
    else if (event.type === EventTypes.ENTITY_DESTROY && event.entityId) onEntityDestroy({ entityId: event.entityId });
    else if (event.type === EventTypes.ENTITY_DISPLAY && event.entityId) onEntityDisplay({ entityId: event.entityId });
    else if (event.type === EventTypes.ENTITY_POSITION_UPDATE && event.entityId) {
        onEntityPositionUpdate({ entityId: event.entityId });
    }
    else if (event.type === EventTypes.ENTITY_SPRITE_CREATE && event.entityId) {
        onEntitySpriteCreate({ entityId: event.entityId });
    }
    else if (event.type === EventTypes.ENTITY_SPRITE_UPDATE && event.entityId) {
        onEntitySpriteUpdate({ entityId: event.entityId });
    }
    /* Inventory */
    else if (event.type === EventTypes.INVENTORY_CREATE) onInventoryCreate();
    else if (event.type === EventTypes.INVENTORY_DISPLAY) onInventoryDisplay();
    else if (event.type === EventTypes.INVENTORY_UPDATE) onInventoryUpdate();
    else if (event.type === EventTypes.INVENTORY_OPTION_DISPLAY) onInventoryOptionDisplay();
    else if (event.type === EventTypes.INVENTORY_OPTION_UPDATE) onInventoryOptionUpdate();
    else if (event.type === EventTypes.INVENTORY_SELECT_SLOT) onInventorySelectSlot();
    else if (event.type === EventTypes.INVENTORY_TOOL_ACTIVATE) onInventoryToolActivate();
    else if (event.type === EventTypes.INVENTORY_TOOL_ACTIVE_DISPLAY) onInventoryToolActiveDisplay();
    else if (event.type === EventTypes.INVENTORY_TOOL_UPDATE) onInventoryToolsUpdate();
    /* Main */
    else if (event.type === EventTypes.MAIN_RUN) run();
    else if (event.type === EventTypes.MAIN_LOADING_ON || event.type === EventTypes.MAIN_LOADING_OFF) {
        onLoadingDisplay({ display: event.type === EventTypes.MAIN_LOADING_ON });
    }
    else if (event.type === EventTypes.MAIN_ERROR && checkErrorData(event.data)) onError({ error: event.data });
    /* Menu */
    else if (event.type === EventTypes.MENU_LAUNCH_DISPLAY) onLaunchMenuDisplay();
    else if (event.type === EventTypes.MENU_LAUNCH_UPDATE) onLaunchMenuUpdate();
    else if (event.type === EventTypes.MENU_SETTINGS_DISPLAY) onSettingsMenuDisplay();
    else if (event.type === EventTypes.MENU_SETTINGS_UPDATE) onSettingsMenuUpdate();
    else if (event.type === EventTypes.MENU_SETTINGS_DISPLAY_EDIT) onSettingsMenuDisplayEdit();
    /* Quest */
    else if (event.type === EventTypes.QUEST_COMPLETE) onQuestComplete();
    else if (event.type === EventTypes.QUEST_DISPLAY) onQuestsDisplay();
    else if (event.type === EventTypes.QUEST_END) onQuestEnd();
    else if (event.type === EventTypes.QUEST_START) onQuestStart();
    /* Tilemap */
    else if (event.type === EventTypes.TILEMAP_CREATE) onTileMapCreate();
    else if (event.type === EventTypes.TILEMAP_TILE_CREATE && checkTileData(event.data)) {
        onTileMapTileCreate({ tile: event.data });
    }
    else if (event.type === EventTypes.TILEMAP_TILE_DESTROY && checkTileData(event.data)) {
        onTileMapTileDestroy({ tile: event.data });
    }
    else error({ message: `Unknown Event type: ${event.type}`, where: 'event' });
};
//#endregion
