export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.image('asteroid', 'assets/asteroid.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64 });

        this.load.audio('flap', 'assets/sounds/flap.mp3');
        this.load.audio('score', 'assets/sounds/score.mp3');
        this.load.audio('crash', 'assets/sounds/crash.mp3');
    }

    create() {
        this.scene.start('StartMenu');
    }

}
