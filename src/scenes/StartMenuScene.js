export class StartMenuScene extends Phaser.Scene {
    constructor() {
        super('StartMenu');
    }

    preload() {
        this.load.image('spaceship', 'assets/spaceship.png');
    }

  create() {
    this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

    this.add.text(this.scale.width / 2, 125, 'SPACE FLAPPY', {
        fontSize: '64px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(this.scale.width / 2, 200, 'Protect Your Ship from Asteroids!! (Beware of the Hidden ones)', {
        fontSize: '30px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(this.scale.width / 2, 250, `Best Score: ${this.bestScore}`, {
        fontSize: '28px',
        fill: '#ff0',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    let ship = this.add.sprite(this.scale.width / 2, 350, 'spaceship').setScale(1.5);
    this.tweens.add({
        targets: ship,
        y: '+=20',
        duration: 1500,
        yoyo: true,
        repeat: -1
    });

    this.add.text(this.scale.width / 2, 450, 'Choose a Difficulty to Start', {
        fontSize: '22px',
        fill: '#aaa',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    let buttonY = 550;
    let spacing = 200;

    const easyButton = this.add.text(this.scale.width / 2 - spacing, buttonY, 'Easy', {
        fontSize: '48px',
        fill: '#00ff00'
    }).setOrigin(0.5);

    const normalButton = this.add.text(this.scale.width / 2, buttonY, 'Normal', {
        fontSize: '48px',
        fill: '#ffff00'
    }).setOrigin(0.5);

    const hardButton = this.add.text(this.scale.width / 2 + spacing, buttonY, 'Hard', {
        fontSize: '48px',
        fill: '#ff0000'
    }).setOrigin(0.5);

    [easyButton, normalButton, hardButton].forEach((button, index) => {
        button.setInteractive({ useHandCursor: true });
        button.on('pointerover', () => {
            button.setStyle({ fill: '#ffffff' });
        });
        button.on('pointerout', () => {
            if (index === 0) button.setStyle({ fill: '#00ff00' });
            if (index === 1) button.setStyle({ fill: '#ffff00' });
            if (index === 2) button.setStyle({ fill: '#ff0000' });
        });
    });

    easyButton.on('pointerdown', () => {
        this.scene.start('SpaceFlappyScene', { difficulty: 'easy' });
    });
    normalButton.on('pointerdown', () => {
        this.scene.start('SpaceFlappyScene', { difficulty: 'normal' });
    });
    hardButton.on('pointerdown', () => {
        this.scene.start('SpaceFlappyScene', { difficulty: 'hard' });
    });
}

}
