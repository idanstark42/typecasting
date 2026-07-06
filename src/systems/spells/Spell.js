// src/spells/Spell.js
export default class Spell {
    constructor(flags = {}) {
        this.flags = {
            isInstant: false,
            needsTarget: false,
            ...flags // Allows for future expansion
        };
    }

    // Abstract method to be overridden by child classes
    cast(game, player) {
        throw new Error("Cast method must be implemented by child spell!");
    }
}