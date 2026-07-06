// src/systems/TypingManager.js
export default class TypingManager {
    constructor(scene) {
        this.scene = scene;
        this.buffer = '';
        
        // Listen for keyboard input globally
        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Enter') {
                if (this.buffer.length > 0) {
                    this.scene.events.emit('SPELL_CAST_START', this.buffer);
                    this.buffer = ''; // Clear buffer
                }
            } else if (event.key === 'Backspace') {
                this.buffer = this.buffer.slice(0, -1);
            } else if (event.key.length === 1 && event.key !== ' ') { // Only add letters
                this.buffer += event.key;
            }
            this.scene.events.emit('TYPING_BUFFER_CHANGED', this.buffer);
        });
    }
}