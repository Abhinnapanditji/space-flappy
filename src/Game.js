import { Boot } from './scenes/Boot.js'
import { GameOverScene } from './scenes/GameOverScene.js';
import { Preloader } from './scenes/Preloader.js'
import { StartMenuScene } from './scenes/StartMenuScene.js'
import { SpaceFlappyScene } from './scenes/SpaceFlappyScene.js'

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        GameOverScene,
        Preloader,
        StartMenuScene, 
        SpaceFlappyScene
        ]
};

const game = new Phaser.Game(config);