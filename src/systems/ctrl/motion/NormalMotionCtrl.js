import MotionCtrlBase from './MotionCtrlBase';
import { Input } from 'phaser'

export default class NormalMotionCtrl extends MotionCtrlBase {
    constructor(character) {
        super(character);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.space = this.scene.input.keyboard.addKey('SPACE');
        
        this.jumpCount = 0;
        this.maxJumps = 2; // Double jump
    }

    update() {
        const { character, cursors, space } = this;

        if (character.locked) {
            character.body.setVelocityX(0); // Stop movement
            return; 
        }

        // Reset jump count when on floor
        if (character.body.blocked.down) {
            this.jumpCount = 0;
        }

        // Horizontal Movement
        if (cursors.left.isDown) {
            character.body.setVelocityX(-200);
            character.flipX = true;
            character.changeAnimation('walk');
        } else if (cursors.right.isDown) {
            character.body.setVelocityX(200);
            character.flipX = false;
            character.changeAnimation('walk');
        } else {
            character.body.setVelocityX(0);
            character.changeAnimation('idle');
        }

        // Jumping (using Phaser's JustDown to avoid holding space)
        if (Input.Keyboard.JustDown(this.space) && this.jumpCount < this.maxJumps) {
            character.body.setVelocityY(-300);
            this.jumpCount++;
        }
    }
}