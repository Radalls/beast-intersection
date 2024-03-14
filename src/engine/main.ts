import { setState } from './state';
import { getCycle, runCycle } from './cycle';
import { createEntityNpc, createEntityPlayer, createEntityResourceBug, createEntityResourceFish, createEntityResourcePickUp, createEntityTileMap } from './services/entity';

export const main = () => {
    setState('isGameRunning', true);

    setInterval(() => {
        runCycle();
    }, getCycle('deltaTime') * 1000);

    createEntityTileMap();
    createEntityPlayer({ spritePath: 'player.png' });

    createEntityResourcePickUp({
        entityId: 'ResourceWood1',
        spritePath: 'resource_wood1.png',
        positionX: 1,
        positionY: 1,
        resourceIsTemporary: true,
        resoureceItemName: 'Wood1',
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

    createEntityNpc({
        entityId: 'Npc1',
        spritePath: 'npc.png',
        positionX: 8,
        positionY: 1,
    });
};
