import { Scene, Utils } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // 1. Inject the Cyber Font Styling into the document head dynamically
        if (!document.getElementById('cyber-menu-styles')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'cyber-menu-styles';
            styleSheet.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Cutive+Mono&display=swap');
                
                #animation-container {
                    width: 100vw;
                    height: 100vh;
                    font-family: 'Cutive Mono', monospace;
                    pointer-events: none;
                }
                .typing-word {
                    position: absolute;
                    color: #ffffff; /* Retro cyber green */
                    white-space: nowrap;
                    transition: opacity 1s ease-out;
                }
                /* Blinking command line cursor */
                .typing-word::after {
                    content: '_';
                    animation: menuBlink 0.4s infinite alternate;
                }
                @keyframes menuBlink {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(styleSheet);
        }
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // 2. Create the DOM container element
        const bgContainer = this.add.dom(0, 0).createFromHTML('<div id="animation-container"></div>');
        bgContainer.setOrigin(0, 0);

        // 3. Run your typing logic inside Phaser
        this.startTypingAnimation();

        // 4. Main Menu Text Elements
        this.add.text(centerX, centerY, 'click anywhere to start', {
            fontFamily: 'Special Elite', fontSize: 48, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });

        this.input.keyboard.on('keydown', () => {
            this.scene.start('Game');
        });
    }

    startTypingAnimation() {
        const container = document.getElementById('animation-container');
        
        // Pool of spells and abilities to randomly display in the background
        const wordList = [
            "missile", "lightning",
            "pull", "push", "teleport", "hover", "invisibility", "light", "darkness",
            "slowmotion", "wall", "shield", "freeze", "speed", "feather",
        ];

        // Phaser's Time Event loop handles spawning new words safely
        this.time.addEvent({
            delay: 500, // Create a new word every 500ms
            loop: true,
            callback: () => {
                if (!container) return;

                const word = Utils.Array.GetRandom(wordList);
                const wordElement = document.createElement('div');
                wordElement.classList.add('typing-word');
                
                // Random depth styling (Size + Opacity matched)
                const depthFactor = Math.random(); 
                const fontSize = 16 + (depthFactor * 24); // 16px to 40px
                const maxOpacity = 0.15 + (depthFactor * 0.45); // 0.15 to 0.60
                
                wordElement.style.fontSize = `${fontSize}px`;
                wordElement.style.opacity = maxOpacity;

                // Random position within the view screen (with padding)
                wordElement.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
                wordElement.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
                container.appendChild(wordElement);

                // Typewriter effect variables
                let currentLetterIndex = 0;
                const typingSpeed = 60 + Math.random() * 60; // Snappy typing

                const typeNextLetter = () => {
                    // Safety check if the scene switches while a word is half-typed
                    if (!document.getElementById('animation-container')) return;

                    if (currentLetterIndex <= word.length) {
                        wordElement.textContent = word.substring(0, currentLetterIndex);
                        currentLetterIndex++;
                        this.time.delayedCall(typingSpeed, typeNextLetter);
                    } else {
                        // Word is fully typed! Hold for a moment, then fade out and remove
                        this.time.delayedCall(1500, () => {
                            wordElement.style.opacity = '0';
                            
                            // Let CSS handle the 1-second fade out, then clear the element
                            this.time.delayedCall(1000, () => {
                                if (wordElement.parentNode === container) {
                                    container.removeChild(wordElement);
                                }
                            });
                        });
                    }
                };

                // Kick off the typing sequence for this word
                typeNextLetter();
            }
        });
    }
}