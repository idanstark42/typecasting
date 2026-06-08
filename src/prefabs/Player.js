import { Physics } from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene - The active Game scene context
     * @param {number} x - Spawn point X
     * @param {number} y - Spawn point Y
     * @param {string} texture - Asset key for the wizard sprite
     */
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // 1. Add to scene rendering and physics arrays
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 2. Set up physics box properties
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(1000); // Decent gravity for snappy platforming
        this.body.setSize(32, 48);   // Tweak according to your sprite sizing

        // 3. Movement and Gameplay variables
        this.baseSpeed = 200;
        this.typingSpeedMultiplier = 0.35; // Drops to 35% speed while coding
        this.jumpForce = -420;
        
        this.health = 100;
        this.maxHealth = 100;
        this.isInvulnerable = false;
        this.isDead = false;

        // 4. Input mappings for core platformer actions (WASD/Arrows)
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    /**
     * Core loop processing movement vectors. Called by Game.js scene update loop
     */
    update() {
        if (this.isDead || !this.body) return;

        this.handleMovement();
    }

    /**
     * Processes physics inputs and factors in typing penalties
     */
    handleMovement() {
        // Dynamic speed calculation: check if typing buffer contains letters
        let currentSpeed = this.baseSpeed;
        const isTyping = this.scene.typingManager && this.scene.typingManager.currentBuffer.length > 0;

        if (isTyping) {
            currentSpeed = this.baseSpeed * this.typingSpeedMultiplier;
        }

        // Horizontal Left/Right Movement Vector
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.body.setVelocityX(-currentSpeed);
            this.setFlipX(true); // Face Left
            if (this.body.onFloor()) this.playAnims('run', true);
        } 
        else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.body.setVelocityX(currentSpeed);
            this.setFlipX(false); // Face Right
            if (this.body.onFloor()) this.playAnims('run', true);
        } 
        else {
            this.body.setVelocityX(0);
            if (this.body.onFloor()) this.playAnims('idle', true);
        }

        // Vertical Jump Vector (Allow jumping only when contacting stable solid floor structures)
        const canJump = this.body.onFloor() || this.body.blocked.down;
        if ((this.cursors.up.isDown || this.wasd.up.isDown) && canJump) {
            this.body.setVelocityY(this.jumpForce);
            this.playAnims('jump', true);
        }

        // Airborn visual state override
        if (!this.body.onFloor() && this.body.velocity.y > 0) {
            this.playAnims('fall', true);
        }
    }

    /**
     * Helper to safely execute animation sets if they exist in cache
     */
    playAnims(key, ignoreIfPlaying = true) {
        if (this.anims && this.anims.exists(key)) {
            this.anims.play(key, ignoreIfPlaying);
        }
    }

    /**
     * Applies damage to the wizard from virus collisions
     * @param {number} amount 
     */
    takeDamage(amount) {
        if (this.isDead || this.isInvulnerable) return;

        this.health = Math.max(0, this.health - amount);
        
        // Dispatch global state updates for HUD scene
        this.scene.events.emit('PLAYER_HEALTH_CHANGED', this.health);

        // Turn on brief hurt frames/flashing visuals
        this.setInvulnerable(500); // 500ms recovery time frame
        
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.alpha = 1;
            }
        });

        if (this.health <= 0) {
            this.die();
        }
    }

    /**
     * Activates short-term invulnerability buffers (used for shield spells or hurt frames)
     * @param {number} durationMs 
     */
    setInvulnerable(durationMs) {
        this.isInvulnerable = true;
        
        // If a pre-existing timer is running, clear it out first to avoid leaks
        if (this.invulnTimer) this.invulnTimer.remove();

        this.invulnTimer = this.scene.time.delayedCall(durationMs, () => {
            this.isInvulnerable = false;
        });
    }

    /**
     * Handles game termination sequence cleanly
     */
    die() {
        this.isDead = true;
        this.body.setVelocity(0, 0);
        this.playAnims('die', true);
        
        this.scene.events.emit('PLAYER_DIED');
    }
}