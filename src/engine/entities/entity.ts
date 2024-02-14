import { Component } from "../components/component";

export type Entity = {
    [K in keyof Component]: Component[K] | undefined;
};

export const TILEMAP_ENTITY_ID = 'TileMap';
export const PLAYER_ENTITY_ID = 'Player';
