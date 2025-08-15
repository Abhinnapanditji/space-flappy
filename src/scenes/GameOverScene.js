export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.score = data.score || 0;
        this.bestScore = data.bestScore || 0;
    }

    create() {
        this.add.text(this.scale.width / 2, 150, 'GAME OVER', {
            fontSize: '64px', fill: '#ff0000'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 250, `Your ship has been destroyed!💥`, {
            fontSize: '28px', fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 350, `Score: ${this.score}`, {
            fontSize: '24px', fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 400, `Best: ${this.bestScore}`, {
            fontSize: '24px', fill: '#ff0'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 500, 'Click or Press SPACE to Restart', {
            fontSize: '20px', fill: '#aaa'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => this.scene.start('StartMenu'));
        this.input.keyboard.on('keydown-SPACE', () => this.scene.start('StartMenu'));
    }
}
