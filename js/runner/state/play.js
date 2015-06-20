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

            //game.load.spritesheet('skeleton', 'assets/enemy1.png', 305, 460, 8);
            game.load.spritesheet('robot', 'assets/enemy2.png', 85.6, 128, 5);
            game.load.spritesheet('dog', 'assets/enemy3.png', 100, 58, 24);
            game.load.image('coin', 'assets/coin.png');
            game.load.image('ufo', 'assets/ufo.png');
            game.load.spritesheet('fire', 'assets/fire.png', 55, 55, 16);
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
            this.physics.arcade.gravity.y = 1000;
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
            var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            space.onDown.add(this.shoot, this);

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
            game.time.events.loop(Phaser.Timer.SECOND * 2, this.scoreUpdate, this);
            this.makeCoins();
            this.makeEnemies();

            this.asteroids.startFalling();
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
                enemy = game.add.sprite(1175, 435, 'mummy');
                enemy.animations.add('run');
                enemy.scale.x = -1; // flip horizontally
                enemy.animations.play('run', 20, true);
            }
            else {

                enemy = game.add.sprite(1175, 412, 'ufo');
                this.physics.arcade.enable(enemy);
                enemy.body.allowGravity = false;
                console.log(enemy.angle);
                enemy.animations.add('fly');
                enemy.animations.play('fly');
                game.time.events.loop(Phaser.Timer.SECOND * 0.15, this.tiltUfo, this).timer.start();

            }
            game.physics.arcade.enable(enemy);

            this.enimies.add(enemy);

            //this.enimies.add(enemy);
            enemy.body.velocity.x = -400;
            //this.enimies.setAll('body.velocity.x',-200);
        },
        tiltUfo: function () {
            this.enimies.forEach(function (enemy) {
                var delta = 4;
                if (enemy.key === 'ufo') {
                    enemy.angle = (enemy.angle == delta ? -delta : delta);
                }
            });
            //console.log('tilt', this.enimies);
        },
        shoot: function () {
            this.fire = game.add.sprite(300, 420, 'fire');
            this.fire.animations.add('run');
            this.fire.animations.play('run');
            game.physics.arcade.enable(this.fire);
            this.fire.body.velocity.x = 300;
            this.fire.allowGravity = false;
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
            this.physics.arcade.collide(this.hero.object, this.platforms, null, null, this);
            this.physics.arcade.collide(this.enimies, this.platforms, null, null, this);
            //this.physics.arcade.collide(this.asteroids.group, this.platforms, null, null, this);


            this.physics.arcade.collide(this.enimies, this.hero.object, this.deathHandler, null, this);
            this.physics.arcade.collide(this.coin, this.hero.object, this.removeCoin, null, this);

            this.physics.arcade.collide(this.fire, this.enimies, this.removeEnemy, null, this);
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

            // do the running animation based on the speed
            this.hero.run(speed);

            var magnitude = 500;
            var delta = 300;

            if (speed === 'fast') {
                magnitude += delta;
                this.enimies.setAll('body.velocity.x', -700);
            } else if (speed === 'slow') {
                magnitude -= delta;
                this.enimies.setAll('body.velocity.x', -300);
            } else {
                if (this.enimies) {
                    this.enimies.setAll('body.velocity.x', -400);
                }
            }

            this.bg.autoScroll(-magnitude, 0);
        },
        deathHandler: function () {
            this.music.stop();
            game.state.start('gameOverState');
        }
    };
})();
