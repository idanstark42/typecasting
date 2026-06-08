import { Scene } from 'phaser';
import { TypingManager } from '../systems/TypingManager';

export class Game extends Scene {
    constructor () {
        super('Game');
    }

    create() {
        // 1. (Placeholder) Initialize your player wizard prefab
        this.player = { x: 512, y: 384, flipX: false, isInvulnerable: false }; 

        // 2. Initialize the typing manager system
        this.typingManager = new TypingManager(this);

        // 3. Listen to events to verify it's working
        this.events.on('TYPING_BUFFER_CHANGED', (buffer) => {
            console.log("Current syntax input: ", buffer);
        });

        this.events.on('SPELL_CAST_SUCCESS', (spellName) => {
            console.log(`✨ Compilation successful! Executing spell: ${spellName}`);
        });

        this.events.on('SPELL_CAST_FAILURE', (failedWord) => {
            console.log(`❌ Syntax Error: "${failedWord}" is not recognized.`);
        });
    }
}