import { SpellDictionary } from './SpellDictionary';

export class TypingManager {
    /**
     * @param {Phaser.Scene} scene - The running Game scene context
     */
    constructor(scene) {
        this.scene = scene;
        this.currentBuffer = "";
        this.isActive = true;

        // Create a dedicated keyboard event listener
        // Using 'keydown' capturing ensures we intercept keys cleanly
        this.keydownListener = (event) => {
            this.handleKeystroke(event);
        };

        window.addEventListener('keydown', this.keydownListener);

        // Clean up our window-level listener when the scene shuts down or destroys
        this.scene.events.once('shutdown', () => this.destroy());
        this.scene.events.once('destroy', () => this.destroy());
    }

    /**
     * Processes every key pressed globally while this manager is active.
     * @param {KeyboardEvent} event 
     */
    handleKeystroke(event) {
        if (!this.isActive) return;

        const key = event.key;
        console.log(key);
        // 1. Prevent standard browser actions for gaming keys (like Space scrolling down the page)
        if (key === ' ' || key === 'Backspace' || key === 'Enter') {
            event.preventDefault();
        }

        // 2. Handle text correction (Backspace)
        if (key === 'Backspace') {
            if (this.currentBuffer.length > 0) {
                this.currentBuffer = this.currentBuffer.slice(0, -1);
                this.emitBufferUpdate();
            }
            return;
        }

        // 3. Handle spell execution submission (Enter)
        if (key === 'Enter') {
            this.evaluateSpell();
            return;
        }

        // 4. Capture valid typing characters. 
        // We accept standard alphanumeric characters, spacebar, and special code chars like (; , . [ ] _ -)
        if (key.length === 1 && /^[a-zA-Z0-9 ;,._\-\[\]]$/.test(key)) {
            this.currentBuffer += key.toLowerCase();
            this.emitBufferUpdate();
        }
    }

    /**
     * Validates the current buffer against our compiled Spell Classes.
     */
    evaluateSpell() {
        const cleanedWord = this.currentBuffer.trim();

        // Skip execution if player just mashes Enter on an empty buffer
        if (cleanedWord === "") return;

        if (SpellDictionary[cleanedWord]) {
            const SpellClass = SpellDictionary[cleanedWord];
            const player = this.scene.player; 

            // Double check player has resources (mana, compute cycles, etc.) if applicable
            // For now, let's instantiate the spell and execute its logic loops
            try {
                const activeSpell = new SpellClass(this.scene, player);
                activeSpell.cast();
                activeSpell.vfx();
                
                this.scene.events.emit('SPELL_CAST_SUCCESS', cleanedWord);
            } catch (error) {
                console.error(`Runtime error executing spell payload: ${error}`);
                this.scene.events.emit('SPELL_CAST_FAILURE', cleanedWord);
            }
        } else {
            // Emit explicit failure event for UI feedback (e.g., text flashes red)
            this.scene.events.emit('SPELL_CAST_FAILURE', cleanedWord);
        }

        // Wipe the input buffer clear after every submission sequence
        this.currentBuffer = "";
        this.emitBufferUpdate();
    }

    /**
     * Resets the current typing string without triggering any effects.
     */
    clearBuffer() {
        this.currentBuffer = "";
        this.emitBufferUpdate();
    }

    /**
     * Dispatches global UI/Scene data changes
     */
    emitBufferUpdate() {
        this.scene.events.emit('TYPING_BUFFER_CHANGED', this.currentBuffer);
    }

    /**
     * Safely safely detach listeners to protect against memory leaks
     */
    destroy() {
        window.removeEventListener('keydown', this.keydownListener);
    }
}