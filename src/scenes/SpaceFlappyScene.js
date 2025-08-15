const DIFFICULTY = {
    easy: {
        delay: 1200,
        velocity: -300,
        scoreIncrement: 1
    },
    normal: {
        delay: 550,
        velocity: -750,
        scoreIncrement: 0.5 * 1
    },
    hard: {
        delay: 150,
        velocity: -1500,
        scoreIncrement: 0.75 * 3 - 2
    }
};

export class SpaceFlappyScene extends Phaser.Scene {
    constructor() {
        super('SpaceFlappyScene');
        this.score = 0;
        this.bestScore = 0;
        this.settings = null;
    }

    init(data) {
        const difficulty = data.difficulty || 'normal';
        this.settings = DIFFICULTY[difficulty];
    }

    preload() {
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.image('asteroid', 'assets/asteroid.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64 });
        this.load.audio('flap', 'assets/flap.mp3');
        this.load.audio('score', 'assets/score.mp3');
        this.load.audio('crash', 'assets/crash.mp3');
    }

    create() {
        const key = 'starfield';
        const size = 512;
        if (!this.textures.exists(key)) {
            const tex = this.textures.createCanvas(key, size, size);
            const ctx = tex.getContext();
            ctx.fillStyle = '#0b0d1a';
            ctx.fillRect(0, 0, size, size);

            const star = (x, y, r, a = 1) => {
                ctx.globalAlpha = a;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.globalAlpha = 1;
            };

            for (let i = 0; i < 300; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const r = Math.random() * 1.5 + 0.5;
                const a = 0.7 + Math.random() * 0.3;
                star(x, y, r, a);
            }
            tex.refresh();
        }

        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, key).setOrigin(0, 0);

        // Scores
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
        this.bestScoreText = this.add.text(16, 50, 'Best: ' + this.bestScore, { fontSize: '24px', fill: '#ff0' });

        // Spaceship
        this.spaceship = this.physics.add.sprite(100, this.scale.height / 2, 'spaceship');
        this.spaceship.setGravityY(900);
        this.spaceship.setCollideWorldBounds(true);
        const shipW = this.spaceship.width;
        const shipH = this.spaceship.height;
        this.spaceship.body.setSize(shipW * 0.33, shipH * 0.15, true);
        this.gameOverFlag = false;

        // Asteroids
        this.asteroids = this.physics.add.group();
        this.physics.add.overlap(this.spaceship, this.asteroids, this.hitAsteroid, null, this);
        
        this.time.addEvent({
            delay: this.settings.delay,
            callback: this.spawnAsteroids,
            callbackScope: this,
            loop: true
        });

        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown-SPACE', this.flap, this);
        this.coyoteTimer = 0;

        // Explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }),
            frameRate: 20,
            hideOnComplete: true
        });

        // Load sounds
        this.flapSound = this.sound.add('flap');
        this.scoreSound = this.sound.add('score');
        this.crashSound = this.sound.add('crash');
    }

    update(time, delta) {
        if (this.gameOverFlag) return;
        this.coyoteTimer += delta;

        this.background.tilePositionX += 1;

        this.asteroids.getChildren().forEach(ast => {
            if (!ast.scored && ast.x + ast.width < this.spaceship.x) {
                ast.scored = true;
                if (ast.isTop) this.increaseScore();
            }
            if (ast.x < -ast.width) {
                ast.destroy();
            }
        });
        if (this.spaceship.y <= 0 || this.spaceship.y >= this.scale.height) {
            this.gameOver();
        }
    }

    flap() {
        if (!this.gameOverFlag && this.coyoteTimer > 50) { 
            this.spaceship.setVelocityY(-320);
            this.flapSound.play();
            this.coyoteTimer = 0;
        }
    }

    spawnAsteroids() {
        const gap = 150;
        const topY = Phaser.Math.Between(-100, 200);

        let topAst = this.asteroids.create(this.scale.width, topY, 'asteroid').setOrigin(0, 1);
        let bottomAst = this.asteroids.create(this.scale.width, topY + gap + 300, 'asteroid').setOrigin(0, 0);

        topAst.isTop = true;
        bottomAst.isTop = false;

        [topAst, bottomAst].forEach(ast => {
            ast.setVelocityX(this.settings.velocity);
            ast.scored = false;
        });
        
        const r = Math.min(topAst.width, topAst.height) * 0.35;
        topAst.body.setCircle(r, topAst.width / 2 - r, topAst.height / 2 - r);
        bottomAst.body.setCircle(r, bottomAst.width / 2 - r, bottomAst.height / 2 - r);
    }

    increaseScore() {
        this.score += this.settings.scoreIncrement;
        this.scoreText.setText('Score: ' + this.score);
        this.scoreSound.play();
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
            this.bestScoreText.setText('Best: ' + this.bestScore);
        }
    }

    hitAsteroid() {
        if (this.gameOverFlag) return;
        this.crashSound.play();
        this.gameOver();
    }

    gameOver() {
        this.gameOverFlag = true;
        this.physics.pause();
        this.time.removeAllEvents();
        this.input.keyboard.removeAllListeners();
        this.input.off('pointerdown');

        this.spaceship.anims.play('explode');
        this.spaceship.once('animationcomplete', () => {
             this.scene.start('GameOverScene', { score: this.score, bestScore: this.bestScore });
        });
    }
}