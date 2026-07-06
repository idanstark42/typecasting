import { GameObjects } from 'phaser';
import NormalMotionCtrl from '../systems/ctrl/motion/NormalMotionCtrl'

const ANIMATIONS = {
    'idle': { filename: 'Idle', frames: 8, repeat: true, frameRate: 6 },
    'walk': { filename: 'Walk', frames: 7, repeat: true, frameRate: 12 },
    'run': { filename: 'Run', frames: 8, repeat: true, frameRate: 12 },
    'attack': { filename: 'Attack_1', frames: 7, repeat: false, frameRate: 12 },
    'hurt': { filename: 'Hurt', frames: 4, repeat: false, frameRate: 12 },
    'die': { filename: 'Dead', frames: 4, repeat: false, frameRate: 12 },
};

const WIDTH = 30
const HEIGHT = 70
const SPRITE_SIZE = 128

export class Character extends GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'wizard-idle'); // Matches the key from preload
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setOrigin(0.5, 1);
        this.setScale(0.75);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(WIDTH, HEIGHT);
        const offsetX = (SPRITE_SIZE - WIDTH) / 2;
        const offsetY = (SPRITE_SIZE - HEIGHT); // Puts the hitbox at the bottom (feet)
        this.body.setOffset(offsetX, offsetY);

        this.createAnimations(scene);
        this.play('idle');

        this.motionCtrl = new NormalMotionCtrl(this);
    }

    static preload(scene) {
        Object.keys(ANIMATIONS).forEach(animation => {
            scene.load.spritesheet(`wizard-${animation}`, `assets/wizard/${ANIMATIONS[animation].filename}.png`, {
                frameWidth: SPRITE_SIZE,
                frameHeight: SPRITE_SIZE
            });
        });
    }

    createAnimations(scene) {
        Object.keys(ANIMATIONS).forEach(animation => {
            scene.anims.create({
                key: animation,
                frames: scene.anims.generateFrameNumbers(`wizard-${animation}`, { start: 0, end: ANIMATIONS[animation].frames }),
                frameRate: ANIMATIONS[animation].frameRate,
                repeat: ANIMATIONS[animation].repeat ? -1 : 0
            });
        });

        // Specific override for attack to return to idle
        this.on('animationcomplete', (anim) => {
            if (anim.key === 'attack') {
                this.play('idle');
            }
        });
    }

    changeAnimation(key) {
        if (this.anims.currentAnim?.key !== key) {
            this.play(key);
        }
    }

    // Add a method to swap controllers (for spells!)
    setMotionCtrl(newCtrlClass) {
        this.motionCtrl = new newCtrlClass(this);
    }

    preUpdate(time, delta) {
        // Phaser calls this automatically every frame
        super.preUpdate(time, delta);
        
        // Delegate movement to the current controller
        if (this.motionCtrl) {
            this.motionCtrl.update();
        }
    }
}