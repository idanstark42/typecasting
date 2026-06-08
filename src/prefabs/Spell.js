export class Spell {
    /**
     * @param {Phaser.Scene} scene - The active Game scene execution context
     * @param {Phaser.GameObjects.Sprite} player - The Wizard player instance 
     */
    constructor(scene, player) {
        if (this.constructor === Spell) {
            throw new Error("Abstract class 'Spell' cannot be instantiated directly.");
        }
        
        this.scene = scene;
        this.player = player;
    }

    /**
     * Core mechanical behavioral logic (Overridden by individual spells)
     */
    cast() {
        throw new Error("Method 'cast()' must be implemented by subclass.");
    }

    /**
     * Core aesthetic/visual behaviors (Overridden by individual spells)
     */
    vfx() {
        throw new Error("Method 'vfx()' must be implemented by subclass.");
    }
}