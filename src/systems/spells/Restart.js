// src/spells/RestartSpell.js
import Spell from './Spell';
import LevelManager from '../LevelManager';

export default class RestartSpell extends Spell {
    constructor() {
        super({ isInstant: true });
    }

    cast(game, player) {
        // Find the spawn point again from the object layer
        const spawnPoint = LevelManager.findObjectByName(game.objectLayer, 'spawn');
        
        // Move the player back to start
        player.body.reset(spawnPoint.x, spawnPoint.y)
        
        console.log("✨ Spell Reset: Returning to start...");
    }
}