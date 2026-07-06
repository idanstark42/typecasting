// src/systems/MotionCtrl.js
export default class MotionCtrlBase {
    constructor(character) {
        this.character = character;
        this.scene = character.scene;
    }

    update() {
        // To be implemented by subclasses
    }
}