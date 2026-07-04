import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameUI } from './scenes/GameUI'; // Added our dynamic overlay hud
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game, Scale } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Individual prefab entities govern their own localized gravity vectors
            debug: false       // Set to true if you need to visually debug collision boundaries
        }
    },
    // GameUI is added alongside the others so it can be controlled natively by the Director
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameUI,
        GameOver
    ],
    dom: {
        createContainer: true
    }
};

const StartGame = () => {
    return new Game({ ...config });
}

document.addEventListener('DOMContentLoaded', () => {
    const game = StartGame();
});