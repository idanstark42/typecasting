import { Scene } from 'phaser';

export class GameUI extends Scene {
    constructor() {
        super('GameUI');
    }

    create() {
        // 1. Reference the core game scene to establish communication channels
        this.gameScene = this.scene.get('Game');

        // 2. Build the UI structural containers (Retro Terminal theme)
        this.createTerminalConsole();

        // 3. Attach decoupled event hooks to the main game scene
        this.gameScene.events.on('TYPING_BUFFER_CHANGED', this.updateCommandLine, this);
        this.gameScene.events.on('SPELL_CAST_SUCCESS', this.handleFlashSuccess, this);
        this.gameScene.events.on('SPELL_CAST_FAILURE', this.handleFlashError, this);
        this.gameScene.events.on('PLAYER_HEALTH_CHANGED', this.updateHealthUI, this);

        // Tear down listeners cleanly if the UI resets
        this.events.on('shutdown', () => {
            if (this.gameScene) {
                this.gameScene.events.off('TYPING_BUFFER_CHANGED', this.updateCommandLine, this);
                this.gameScene.events.off('SPELL_CAST_SUCCESS', this.handleFlashSuccess, this);
                this.gameScene.events.off('SPELL_CAST_FAILURE', this.handleFlashError, this);
                this.gameScene.events.off('PLAYER_HEALTH_CHANGED', this.updateHealthUI, this);
            }
        });
    }

    createTerminalConsole() {
        // Draw an absolute background tray block for the typing prompt at the bottom window
        const trayY = 700;
        const graphics = this.add.graphics();
        graphics.fillStyle(0x0a0a0a, 0.85); // Transparent dark console background
        graphics.fillRect(0, trayY, 1024, 68);
        graphics.lineStyle(2, 0x00ff00, 0.5); // Terminal green border lane
        graphics.strokeLineShape(new Phaser.Geom.Line(0, trayY, 1024, trayY));

        // Static Prompt Symbol Text
        this.add.text(20, trayY + 20, "wizard@typecasting:~$", {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            color: '#00ff00'
        });

        // The dynamic code command line text entity
        this.commandLineText = this.add.text(310, trayY + 20, "", {
            fontFamily: 'Courier New, monospace',
            fontSize: '22px',
            color: '#ffffff'
        });

        // Health Display metrics at top left window corner
        this.healthText = this.add.text(20, 20, "SYS_HEALTH: 100%", {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#00ff00',
            backgroundColor: '#000000'
        });
    }

    updateCommandLine(bufferString) {
        // Appends a simulated terminal cursor block element at the end of the input string
        this.commandLineText.setText(bufferString + "█");
        this.commandLineText.setColor('#ffffff');
    }

    handleFlashSuccess(spellName) {
        this.commandLineText.setColor('#00ff00'); // Turn green on compile success
        
        // Brief decorative console text pop tween
        this.tweens.add({
            targets: this.commandLineText,
            alpha: 0.5,
            yoyo: true,
            duration: 75,
            repeat: 1
        });
    }

    handleFlashError(invalidString) {
        this.commandLineText.setColor('#ff0000'); // Turn red on compilation syntax error
        this.commandLineText.setText(`[SYNTAX_ERR]: "${invalidString}"`);

        this.cameras.main.shake(100, 0.005);
    }

    updateHealthUI(currentHealth) {
        this.healthText.setText(`SYS_HEALTH: ${currentHealth}%`);
        
        if (currentHealth <= 30) {
            this.healthText.setColor('#ff0000'); // Red alert warning threshold
        } else {
            this.healthText.setColor('#00ff00');
        }
    }
}