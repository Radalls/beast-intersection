import { Component } from '@/engine/components/@component';

export type Entity = {
    [K in keyof Component]: Component[K] | undefined;
};

export enum EntityTypes {
    NPC = 'Npc',
    PLAYER = 'Player',
    RESOURCE_BUG = 'ResourceBug',
    RESOURCE_CRAFT = 'ResourceCraft',
    RESOURCE_FISH = 'ResourceFish',
    RESOURCE_ITEM = 'ResourceItem'
}
