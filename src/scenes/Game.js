import { Scene } from 'phaser';
import { LevelManager } from '../systems/LevelManager';
import { TypingManager } from '../systems/TypingManager';

import MultiImageBackground from '../prefabs/multi-image-background';

export class Game extends Scene {
    constructor () {
        super('Game');
        this.bg = new MultiImageBackground(this, ['background/1', 'background/2', 'background/3', 'background/4', 'background/5'], 0.5);
    }
    
    preload() {
        this.bg.preload();

        // Load the tileset image
        this.load.image('tileset_img', 'assets/Tileset.png');
        
        // Load the tilemap JSON
        this.load.tilemapTiledJSON('map', 'assets/levels/level1.json');
    }

    create() {
        this.bg.create();
        
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

        // Initialize the level using our Manager
        // Note: 'tileset' is the name of the tileset inside the Tiled editor
        const { map, groundLayer } = LevelManager.loadLevel(
            this, 'map', 'tileset', 'tileset_img'
        );

        // Example: Add a player and enable physics collision
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.physics.add.collider(this.player, groundLayer);
    }

    update() {
        this.bg.update();
    }
}