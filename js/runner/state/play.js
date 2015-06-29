;
(function () {
    var imageDim = runner.config.bgImageDimension;
    var bgRatio = runner.config.getRatio();
    var game = runner.game;
    var Hero = runner.entities.Hero;
    var AsteroidGroup = runner.entities.AsteroidGroup;

    runner.state.play = {
        preload: function () {
            game.load.image('bg', 'assets/background.jpg');
            game.load.spritesheet('robot', 'assets/enemy2.png', 85.6, 128, 5);
            game.load.spritesheet('dog', 'assets/enemy3.png', 100, 58, 24);
            game.load.image('coin', 'assets/diamond.png');
            game.load.image('ufo', 'assets/ufo.png');
            game.load.spritesheet('mummy', 'assets/metalslug_mummy.png', 37, 45, 18);

            this.hero = new Hero();
            this.asteroids = new AsteroidGroup();

            //  Firefox doesn't support mp3 files, so use ogg
            game.load.audio('playing', ['assets/play.mp3', 'assets/play.ogg']);
            game.load.image('ground', 'assets/transplatform.png');
        },
        create: function () {
            this.game.renderer.renderSession.roundPixels = true;
            game.physics.startSystem(Phaser.Physics.ARCADE);
            this.physics.arcade.skipQuadTree = false;
            this.physics.arcade.gravity.y = 400;
            this.bg = game.add.tileSprite(0, 0, imageDim[0], imageDim[1], 'bg');

            // Score text display
            var scoreText = game.add.text(1050, 35, 'Score:', {
                fill: '#fff'
            });
            scoreText.anchor.setTo(0.5, 0.5);
            this.currentScore = game.add.text(1111, 37, runner.score.toString(), {
                fill: '#fff'
            });

            this.currentScore.anchor.setTo(0.5, 0.5);

            this.bg.scale.setTo(bgRatio, bgRatio);

            this.platforms = game.add.physicsGroup();

            this.ground = this.platforms.create(0, game.world.height - 50, 'ground');
            this.ground.width = game.world.width;

            this.platforms.setAll('body.allowGravity', false);
            this.platforms.setAll('body.immovable', true);

            this.hero.create();
            this.asteroids.create();
            this.asteroids.addCollider(this.platforms);

            this.music = game.add.audio('playing');
            this.music.loop = true;
            this.music.play();
            this.run();

            this.cursors = this.input.keyboard.createCursorKeys();
            game.time.events.loop(Phaser.Timer.SECOND * 1, this.scoreUpdate, this);

            this.coins = this.add.physicsGroup();
            this.coins.setAll('body.allowGravity', false);

            this.makeCoins();
            this.makeEnemies();

            this.asteroids.startFalling();
        },
        makeCoins: function () {
            this.coinGenerator = game.time.events.loop(Phaser.Timer.SECOND * game.rnd.integerInRange(2, 8), this.makeCoin, this);
            this.coinGenerator.timer.start();
            this.points = game.add.group();
        },
        makeCoin: function () {
            var coin = game.add.sprite(1175, game.rnd.integerInRange(game.world.height / 2 + 60, game.world.height - 80), 'coin');

            game.physics.arcade.enable(coin);
            this.points.add(coin);
            coin.body.velocity.x = -200;
            coin.body.allowGravity = false;

            // console.log('make coin');
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
                enemy = game.add.sprite(game.world.width, 495, 'dog');
                enemy.animations.add('run', [1, 2, 9, 10, 17, 18], 8, true, true);
                enemy.animations.play('run');
            }
            else if (enemyType == 2) {
                enemy = game.add.sprite(game.world.width, 460, 'mummy');
                enemy.scale.setTo(1.2, 1.2);
                enemy.animations.add('run');
                enemy.scale.x = -1; // flip horizontally
                enemy.animations.play('run', 20, true);
            }
            else {
                var ufoHeights = [390, 412, 460];
                var i = game.rnd.integerInRange(0, 2);
                enemy = game.add.sprite(game.world.width, ufoHeights[i], 'ufo');
                this.physics.arcade.enable(enemy);
                enemy.body.allowGravity = false;

                enemy.animations.add('fly');
                enemy.animations.play('fly');
                game.time.events.loop(Phaser.Timer.SECOND * 0.15, this.tiltUfo, this).timer.start();
            }
            game.physics.arcade.enable(enemy);
            this.enimies.add(enemy);
            enemy.body.velocity.x = -400;
        },
        tiltUfo: function () {
            this.enimies.forEach(function (enemy) {
                var delta = 4;
                if (enemy.key === 'ufo') {
                    enemy.angle = (enemy.angle == delta ? -delta : delta);
                }
            });
        },
        scoreUpdate: function () {
            runner.score += 1 * runner.level;
            if (runner.score % 200 === 0) {
                runner.level += 1;
            }
            this.currentScore.setText(runner.score.toString());
        },
        update: function () {
            // hold the hero and the enemies
            this.physics.arcade.collide(this.hero.object, this.platforms, null, null, this);
            this.physics.arcade.collide(this.hero.object, this.asteroids.group, this.deathHandler, null, this);
            this.physics.arcade.collide(this.enimies, this.platforms, null, null, this);

            //this.physics.arcade.collide(this.asteroids.group, this.platforms, null, null, this);
            this.physics.arcade.collide(this.enimies, this.hero.object, this.deathHandler, null, this);

            this.asteroids.setPhysics(this.physics);
            this.asteroids.checkCollision();

            // only if the hero is on top of the group
            if (this.cursors.up.isDown && this.hero.isOnGround(this.ground)) {
                this.hero.jump();
            }

            if (this.cursors.left.isDown) {
                this.run('slow');
            } else if (this.cursors.right.isDown) {
                this.run('fast');
            } else if (!this.hero.isOnGround(this.ground)) {
                this.hero.playAnimation('jump');
            } else {
                this.run('normal');
            }
        },
        consumeCoin: function (fff, fffg) {
            console.log('consume', fff, fffg);
            coin.destroy();
            runner.score += 20;
            this.scoreUpdate();
        },
        run: function (speed) {

            // do the running animation based on the speed
            this.hero.run(speed);

            var magnitude = 500;
            var delta = 300;

            if (speed === 'fast') {
                magnitude += delta;
                this.enimies.setAll('body.velocity.x', -700);

                this.asteroids.changeSpeed(-delta);
            } else if (speed === 'slow') {
                magnitude -= delta;
                this.enimies.setAll('body.velocity.x', -300);

                this.asteroids.changeSpeed(delta);
            } else {
                if (this.enimies) {
                    this.enimies.setAll('body.velocity.x', -400);
                }
                this.asteroids.changeSpeed(0);
            }

            this.bg.autoScroll(-magnitude, 0);
        },
        deathHandler: function () {
            this.music.stop();
            runner.gameOverScreen();
        }
    };
})();
