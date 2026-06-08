import { Physics } from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture - The preloaded asset texture key (e.g., 'virus_trojan')
     */
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // 1. Inject this custom game object directly into the scene hierarchy and physics simulation layers
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 2. Set default physics properties
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(600); // Standard gravity so viruses don't float off platforms

        // 3. Custom systemic variables
        this.health = 20;
        this.moveSpeed = 80;
        this.damageValue = 10;
        this.isDead = false;

        // Establish an internal state machine placeholder for tracking AI paths
        this.aiTimer = 0;
    }

    /**
     * Automatically handles tracking mechanisms and updates. Called by Scene.update() loops
     * @param {number} time 
     * @param {number} delta 
     */
    update(time, delta) {
        if (this.isDead || !this.body) return;

        // Simple AI Tracking Routine: Hunt the Player
        const player = this.scene.player;
        if (!player) return;

        // Find distance on the horizontal axis
        const distanceX = player.x - this.x;

        // Basic AI: If player is nearby, walk towards them
        if (Math.abs(distanceX) < 400) {
            if (distanceX > 0) {
                this.body.setVelocityX(this.moveSpeed);
                this.setFlipX(false); // Facing right
            } else {
                this.body.setVelocityX(-this.moveSpeed);
                this.setFlipX(true);  // Facing left
            }
        } else {
            // Passive wandering behavior if the player is far away
            this.wander(time);
        }
    }

    /**
     * Custom horizontal wandering sequence when out of target range
     */
    wander(time) {
        if (time > this.aiTimer) {
            // Change walking vector directions randomly every 2-3 seconds
            const randomDirection = Math.random() > 0.5 ? 1 : -1;
            this.body.setVelocityX(this.moveSpeed * 0.5 * randomDirection);
            this.setFlipX(randomDirection < 0);
            
            this.aiTimer = time + Phaser.Math.Between(2000, 3000);
        }
    }

    /**
     * Processes damage modifiers incoming from successful compiled syntax spells
     * @param {number} amount 
     */
    takeDamage(amount) {
        if (this.isDead) return;

        this.health -= amount;

        // Visual feedback: Flash red briefly when hit by code
        this.setTint(0xff0000);
        this.scene.time.delayedCall(150, () => {
            if (this.active) this.clearTint();
        });

        if (this.health <= 0) {
            this.die();
        }
    }

    /**
     * Clean removal of entities from physics layers and rendering instances
     */
    die() {
        this.isDead = true;
        this.body.setVelocity(0, 0);
        
        // Simple pixel destruction animation sequence
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleY: 0,
            duration: 300,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}