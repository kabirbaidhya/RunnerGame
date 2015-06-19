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
            game.load.spritesheet('skeleton', 'assets/enemy1.png', 230, 460, 8);
            game.load.spritesheet('robot', 'assets/enemy2.png', 85.6, 128, 5);
            game.load.spritesheet('dog', 'assets/enemy3.png', 100, 58, 24);

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

            this.run();

            this.bg.scale.setTo(bgRatio, bgRatio);


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

            this.hero.animations.add('run', [12, 13, 14, 15, 16, 17], 8, true, true);
            this.hero.animations.play('run');
            this.hero.jump = function () {
                this.body.velocity.y = -500;
            };

            this.cursors = this.input.keyboard.createCursorKeys();

            game.time.events.loop(Phaser.Timer.SECOND * 2, this.scoreUpdate, this);
            this.makeEnemies();
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
                enemy.animations.add('run', [1, 2, 9, 10, 17, 18], 6, true, true);
                enemy.animations.play('run');

            }
            /*    else if(enemyType == 2)
             {
             enemy = game.add.sprite(1175, 435, 'robot');

             enemy.scale.setTo(0.3, 0.3);
             enemy.animations.add('run', [0, 1, 2, 3], 4, true, true);
             enemy.animations.play('run');

             }*/
            else {
                enemy = game.add.sprite(1175, 420, 'robot');
                enemy.animations.add('run', [0, 1, 2, 3, 4], 5, true, true);
                enemy.animations.play('run', 44, true);

            }
            game.physics.arcade.enable(enemy);

            this.enimies.add(enemy);

            //this.enimies.add(enemy);
            enemy.body.velocity.x = -200;

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

        run: function (speed) {
            var magnitude = 500;
            var delta = 300;

            if (speed === 'fast') {
                magnitude += delta;
            } else if (speed === 'slow') {
                magnitude -= delta;
            }

            this.bg.autoScroll(-magnitude, 0);
        },
        deathHandler: function () {
            game.state.start('homestate');
        }
    };
})();
