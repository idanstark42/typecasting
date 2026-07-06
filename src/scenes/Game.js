import { Scene } from 'phaser';
import LevelManager from '../systems/LevelManager';
import TypingManager from '../systems/TypingManager';
import Character from '../prefabs/Character';
import Spellbook from '../systems/spells/Spellbook'

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

        // Initialize the level using our Manager
        // Note: 'tileset' is the name of the tileset inside the Tiled editor
        const { map, groundLayer, objectLayer } = LevelManager.loadLevel(
            this, 'map', 'tileset', 'tileset_img'
        );

        this.map = map
        this.groundLayer = groundLayer
        this.objectLayer = objectLayer

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const spawnPoint = LevelManager.findObjectByName(objectLayer, 'spawn');
        this.player = new Character(this, spawnPoint.x, spawnPoint.y);
        this.player.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, groundLayer);

        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Create the UI text box
        this.spellText = this.add.text(20, 20, '', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#00000088',
            padding: { x: 10, y: 5 }
        });
        this.spellText.setScrollFactor(0); // This locks the text to the screen!
        this.spellText.setVisible(false);

        // Listen to the typing manager
        this.events.on('TYPING_BUFFER_CHANGED', (buffer) => {
            if (buffer.length > 0) {
                this.spellText.setText(buffer);
                this.spellText.setVisible(true); // Show when typing
            } else {
                this.spellText.setVisible(false); // Hide when empty
            }
        });

        this.events.on('SPELL_CAST_START', (spellName) => {
            this.spellText.setText(''); // Clear box on success
            this.currentSpell = Spellbook.spells[spellName.toLowerCase()];
    
            if (this.currentSpell) {
                this.player.changeAnimation('cast');
            } else {
                console.log("Spell unknown!");
            }            
            // Trigger character action
        });

        this.events.on('SPELL_CAST_END', () => {
            if (this.currentSpell) {
                this.currentSpell.cast(this, this.player);
            }
        })
    }

    update() {
        this.bg.update();
    }
}