import { Scene } from 'phaser';
import { LevelManager } from '../systems/LevelManager';
import { TypingManager } from '../systems/TypingManager';
import { Character } from '../prefabs/Character';

import MultiImageBackground from '../prefabs/multi-image-background';

export class Game extends Scene {
    constructor () {
        super('Game');
        this.backgroundSpeed = 0; // Base speed for the background parallax effect
        this.bg = new MultiImageBackground(this, ['background/1', 'background/2', 'background/3', 'background/4', 'background/5'], this.backgroundSpeed);
    }
    
    preload() {
        this.bg.preload();
        this.load.image('tileset_img', 'assets/Tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/levels/level1.json');
        Character.preload(this)
    }

    create() {
        this.bg.create();
        this.typingManager = new TypingManager(this);

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
        const { map, groundLayer, objectLayer } = LevelManager.loadLevel(
            this, 'map', 'tileset', 'tileset_img'
        );

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const spawnPoint = LevelManager.findObjectByName(objectLayer, 'spawn');
        this.player = new Character(this, spawnPoint.x, spawnPoint.y);
        this.player.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, groundLayer);

        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        this.bg.update();
    }
}