import { setState } from './state';
import { getCycle, runCycle } from './cycle';
import { createEntityNpc, createEntityPlayer, createEntityResourceBug, createEntityResourceCraft, createEntityResourceFish, createEntityResourcePickUp, createEntityTileMap } from './services/entity';

export const main = () => {
    setState('isGameRunning', true);

    setInterval(() => {
        runCycle();
    }, getCycle('deltaTime') * 1000);

    createEntityTileMap();
    createEntityPlayer({ spritePath: 'player.png' });

    createEntityNpc({
        entityId: 'Npc1',
        spritePath: 'npc.png',
        positionX: 8,
        positionY: 3,
    });

    createEntityResourceBug({
        entityId: 'ResourceBug1',
        spritePath: 'resource_bug1.png',
        positionX: 1,
        positionY: 3,
        resourceIsTemporary: true,
        resourceActivityBugMaxHp: 3,
        resourceActivityBugMaxNbErrors: 3,
        resourceActivityBugSymbolInterval: 2,
        resoureceItemName: 'Bug1',
    });

    createEntityResourceFish({
        entityId: 'ResourceFish1',
        spritePath: 'resource_fish1.png',
        positionX: 3,
        positionY: 3,
        resourceIsTemporary: true,
        resourceActivityFishDamage: 3,
        resourceActivityFishMaxHp: 100,
        resourceActivityFishFrenzyDuration: 3,
        resourceActivityFishFrenzyInterval: 9,
        resourceActivityFishRodDamage: 2,
        resourceActivityFishRodMaxTension: 100,
        resoureceItemName: 'Fish1',
    });

    createEntityResourcePickUp({
        entityId: 'ResourceWood1a',
        spritePath: 'resource_wood1.png',
        positionX: 1,
        positionY: 1,
        resourceIsTemporary: true,
        resoureceItemName: 'Wood1',
    });

    createEntityResourcePickUp({
        entityId: 'ResourceWood1b',
        spritePath: 'resource_wood1.png',
        positionX: 2,
        positionY: 1,
        resourceIsTemporary: true,
        resoureceItemName: 'Wood1',
    });

    createEntityResourcePickUp({
        entityId: 'ResourceWood1c',
        spritePath: 'resource_wood1.png',
        positionX: 3,
        positionY: 1,
        resourceIsTemporary: true,
        resoureceItemName: 'Wood1',
    });

    createEntityResourcePickUp({
        entityId: 'ResourceRock1a',
        spritePath: 'resource_rock1.png',
        positionX: 5,
        positionY: 1,
        resourceIsTemporary: true,
        resoureceItemName: 'Rock1',
    });

    createEntityResourcePickUp({
        entityId: 'ResourceRock1b',
        spritePath: 'resource_rock1.png',
        positionX: 6,
        positionY: 1,
        resourceIsTemporary: true,
        resoureceItemName: 'Rock1',
    });

    createEntityResourceCraft({
        entityId: 'ResourceCraft',
        spritePath: 'resource_craft.png',
        positionX: 8,
        positionY: 1,
        resourceMaxNbErrors: 3,
    });
};
