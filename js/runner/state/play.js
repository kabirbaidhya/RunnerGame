;
(function () {
    var imageDim = runner.config.bgImageDimension;
    var bgRatio = runner.config.getRatio();
    var game = runner.game;
    var heroPos = runner.config.hero.position;
    var heroScale = runner.config.hero.scaleFactor;

    runner.state.play = {
        hero: null,
        preload: function () {
            game.load.image('bg', 'assets/background.jpg');
            game.load.spritesheet('hero', 'assets/hero.png', 144, 144, 18);
            game.load.spritesheet('skeleton', 'assets/enemy1.png', 305, 460, 8);
            game.load.spritesheet('robot', 'assets/enemy2.png', 85.6, 128, 5);
            game.load.spritesheet('dog', 'assets/enemy3.png', 100, 58, 24);
            game.load.image('coin', 'assets/coin.png');
            game.load.spritesheet('fire', 'assets/fire.png', 55, 55, 16);

            //  Firefox doesn't support mp3 files, so use ogg
            game.load.audio('playing', ['assets/play.mp3', 'assets/play.ogg']);
            game.load.image('ground', 'assets/transplatform.png');
        },
        create: function () {
            this.game.renderer.renderSession.roundPixels = true;
            game.physics.startSystem(Phaser.Physics.ARCADE);
            this.physics.arcade.skipQuadTree = false;
            this.physics.arcade.gravity.y = 750;
            this.bg = game.add.tileSprite(0, 0, imageDim[0], imageDim[1], 'bg');

            // Level text display
            var levelText = game.add.text(900, 35, 'Level:', {
                fill: '#fff'
            });

            // Score text display
            var scoreText = game.add.text(1050, 35, 'Score:', {
                fill: '#fff'
            });
            levelText.anchor.setTo(0.5, 0.5);
            scoreText.anchor.setTo(0.5, 0.5);
            this.currentScore = game.add.text(1111, 37, runner.score.toString(), {
                fill: '#fff'
            });
            this.currentLevel = game.add.text(961, 37, runner.level.toString(), {
                fill: '#fff'
            });

            this.currentScore.anchor.setTo(0.5, 0.5);
            this.currentLevel.anchor.setTo(0.5, 0.5);

            this.bg.scale.setTo(bgRatio, bgRatio);
            //this.hero.body.gravity.y = 1000;
            var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            space.onDown.add(this.shoot, this);

            this.platforms = game.add.physicsGroup();
            this.ground = this.platforms.create(0, game.world.height - 50, 'ground');
            this.ground.width = game.world.width;

            this.platforms.setAll('body.allowGravity', false);
            this.platforms.setAll('body.immovable', true);
            //this.platforms.setAll('body.velocity.x', 100);

            this.hero = game.add.sprite(heroPos[0], heroPos[1], 'hero');
            this.hero.scale.setTo(heroScale, heroScale);
            game.physics.arcade.enable(this.hero);
            this.hero.body.collideWorldBounds = true;
            //this.hero.body.allowGravity = false;

            this.hero.animations.add('run', [12, 13, 14, 15, 16, 17], 7, true, true);
            this.hero.animations.add('run-slow', [12, 13, 14, 15, 16, 17], 5, true, true);
            this.hero.animations.add('run-fast', [12, 13, 14, 15, 16, 17], 9, true, true);

            this.music = game.add.audio('playing');
            this.music.loop = true;
            this.music.play();
            //this.hero.animations.play('run');
            this.run();

            this.hero.jump = function () {
                this.body.velocity.y = -500;
            };

            this.cursors = this.input.keyboard.createCursorKeys();
            game.time.events.loop(Phaser.Timer.SECOND * 2, this.scoreUpdate, this);
            //this.makeCoins();
            //this.makeEnemies();
        },
        makeCoins: function () {
            this.coinGenerator = game.time.events.loop(Phaser.Timer.SECOND * game.rnd.integerInRange(3, 8), this.makeCoin, this);
            this.coinGenerator.timer.start();
            this.points = game.add.group();
        },
        makeCoin: function () {
            this.coin = game.add.sprite(1175, game.rnd.integerInRange(game.world.height / 2 + 60, game.world.height - 80), 'coin');
            this.coin.scale.setTo(0.2, 0.2);
            game.physics.arcade.enable(this.coin);
            this.points.add(this.coin);
            this.coin.body.velocity.x = -200;
            this.coin.body.allowGravity = false;
        },
        makeEnemies: function () {
            this.enemiesGenerator = game.time.events.loop(Phaser.Timer.SECOND * 2, this.makeEnemy, this);
            this.enemiesGenerator.timer.start();
            this.enimies = game.add.group();
        },
        makeEnemy: function () {
            var enemyType = game.rnd.integerInRange(1, 3);
            var enemy;
            if (enemyType == 1) {
                enemy = game.add.sprite(1175, 495, 'dog');
                enemy.animations.add('run', [1, 2, 9, 10, 17, 18], 8, true, true);
                enemy.animations.play('run');
            }
            else if (enemyType == 2) {
                enemy = game.add.sprite(1175, 435, 'skeleton');
                enemy.scale.setTo(0.3, 0.3);
                enemy.animations.add('run', [0, 1, 2, 3], 4, true, true);
                enemy.animations.play('run');
            }
            else {
                enemy = game.add.sprite(1175, 420, 'robot');
                enemy.animations.add('run', [0, 1, 2, 3, 4], 8, true, true);
                enemy.animations.play('run', 44, true);
            }
            game.physics.arcade.enable(enemy);

            this.enimies.add(enemy);

            //this.enimies.add(enemy);
            enemy.body.velocity.x = -200;
            //this.enimies.setAll('body.velocity.x',-200);
        },

        shoot: function () {
            this.fire = game.add.sprite(300, 420, 'fire');
            this.fire.animations.add('run');
            this.fire.animations.play('run');
            game.physics.arcade.enable(this.fire);
            this.fire.body.velocity.x = 300;
            this.fire.allowGravity = false;
        },
        jump: function () {
            var jumps = game.add.tween(this.hero);
            jumps.to({y: this.hero.height - 60}, 6000, Phaser.Easing.Bounce.In);
            jumps.onComplete.add(jumps, this);
            jumps.start();
            //this.enimies.setAll('body.velocity.x',-200);
        },
        scoreUpdate: function () {
            runner.score += 5 * runner.level;
            if (runner.score > 200) {
                runner.level += 1;
                this.currentLevel.setText(runner.level.toString());
            }
            this.currentScore.setText(runner.score.toString());
        },
        update: function () {
            // hold the hero and the enemies
            this.physics.arcade.collide(this.hero, this.platforms, null, null, this);
            this.physics.arcade.collide(this.enimies, this.platforms, null, null, this);
            // this.physics.arcade.collide(this.enimies, this.hero, this.deathHandler, null, this);

            this.physics.arcade.collide(this.coin, this.hero, this.removeCoin, null, this);
            this.physics.arcade.collide(this.fire, this.enimies, this.removeEnemy, null, this);
            // only if the hero is on top of the group
            var onTheGround = (this.hero.bottom === this.ground.top);

            if (this.cursors.up.isDown && onTheGround) {
                this.hero.jump();
            }

            if (this.cursors.left.isDown) {
                this.run('slow');
            } else if (this.cursors.right.isDown) {
                this.run('fast');
            } else {
                this.run('normal');
            }

        },
        removeEnemy: function () {
            this.enimies.destroy();
            this.fire.destroy();
        },
        removeCoin: function () {
            this.coin.destroy();
            runner.score += 20;
            this.scoreUpdate();

        },
        run: function (speed) {
            var magnitude = 500;
            var delta = 300;

            if (speed === 'fast') {
                magnitude += delta;
                this.hero.animations.play('run-fast');
                this.enimies.setAll('body.velocity.x', -500);
            } else if (speed === 'slow') {
                magnitude -= delta;
                this.hero.animations.play('run-slow');
                this.enimies.setAll('body.velocity.x', -100);
            } else {
                this.hero.animations.play('run');
                if (this.enimies) {
                    this.enimies.setAll('body.velocity.x', -200);
                }
            }

            this.bg.autoScroll(-magnitude, 0);
        },
        deathHandler: function () {
            this.music.stop();
            game.state.start('homestate');
        }
    };
})();
