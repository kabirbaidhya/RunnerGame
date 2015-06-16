;
(function () {
    var containerDim = [1200, 600];
    var game = new Phaser.Game(containerDim[0], containerDim[1]);
    var imageDim = [3000, 1500];
    var ratio = containerDim[0] / imageDim[0];
    var level = 1;
    var score = 0;
    var homeState = {
        preload: function () {
            game.load.audio('mainmenu', ['assets/main-menu.mp3', 'assets/main-menu.ogg']);
        },
        create: function () {
            var button1 = game.add.text(game.world.centerX, game.world.centerY, 'Play', {
                fill: '#fff'
            });
            button1.anchor.setTo(0.5, 0.5);
            var music = game.add.audio('mainmenu');
            music.play();
            button1.inputEnabled = true;
            button1.events.onInputDown.add(function () {
                game.state.start('playstate');
                music.stop();
            }, this);

        },
        update: function () {


        }
    };
    var gameOverState = {
        preload: function () {
            game.load.audio('gameover', ['assets/winner.mp3', 'assets/winner.ogg']);
        },
        create: function () {
            var gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', {
                fill: '#fff'});
            gameOverText.anchor.setTo(0.5, 0.5);
            var mainMenuButton = game.add.text(game.world.centerX, game.world.centerY + 160,'Main Menu', {
                fill: '#fff'});
            mainMenuButton.anchor.setTo(0.5, 0.5);
            var yourScoreText = game.add.text(game.world.centerX, game.world.centerY - 60, 'Your Score:', {
                fill: '#fff'
            });
            yourScoreText.anchor.setTo(0.5, 0.5);
            var yourScore = game.add.text(game.world.centerX + 100, game.world.centerY - 60, score.toString(), {
                fill: '#fff'
            });
            yourScore.anchor.setTo(0.5, 0.5);

            var music = game.add.audio('gameover');
            music.play();
            mainMenuButton.inputEnabled = true;
            mainMenuButton.events.onInputDown.add(function () {
                music.stop();
                game.state.start('homestate');
            }, this);

        },
        update: function () {


        }
    };

    var playState = {
        preload: function () {
            game.load.image('bg', 'assets/background.jpg');
            game.load.spritesheet('hero', 'assets/hero.png', 144, 144, 18);
            game.load.spritesheet('skeleton', 'assets/enemy1.png', 230, 460, 8);
            game.load.spritesheet('robot', 'assets/enemy2.png', 85.6, 128, 5);
            game.load.spritesheet('dog', 'assets/enemy3.png', 100, 58, 24);
            //  Firefox doesn't support mp3 files, so use ogg
            game.load.audio('playing', ['assets/play.mp3', 'assets/play.ogg']);
        },
        create: function () {
            this.bg = game.add.tileSprite(0, 0, imageDim[0], imageDim[1], 'bg');
            var levelText = game.add.text(900, 35, 'Level:', {
                fill: '#fff'
            });
            var scoreText = game.add.text(1050, 35, 'Score:', {
                fill: '#fff'
            });
            levelText.anchor.setTo(0.5, 0.5);
            scoreText.anchor.setTo(0.5, 0.5);
            this.currentScore = game.add.text(1111, 37, score.toString(), {
                fill: '#fff'
            });
            this.currentLevel = game.add.text(961, 37, level.toString(), {
                fill: '#fff'
            });

            this.currentScore.anchor.setTo(0.5, 0.5);
            this.currentLevel.anchor.setTo(0.5, 0.5);
            this.bg.autoScroll(-400, 0);
            this.bg.scale.setTo(ratio, ratio);
            //this.hero.body.gravity.y = 1000;
            //var upArrow = game.input.keyboard.addKey(Phaser.Keyboard.UP);
            //upArrow.onDown.add(this.jump, this);

            this.hero = game.add.sprite(200, 407, 'hero');
            this.hero.animations.add('run', [12, 13, 14, 15, 16, 17], 6, true, true);
            this.music = game.add.audio('playing');

            this.music.play();

            this.hero.animations.play('run');
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.enable(this.hero);
            game.time.events.loop(Phaser.Timer.SECOND * 2, this.scoreUpdate, this);
            this.makeEnemies();
        },
        makeEnemies: function () {
            this.enemiesGenerator = game.time.events.loop(Phaser.Timer.SECOND * 7, this.makeEnemy, this);
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
        jump: function () {
            var jumps = game.add.tween(this.hero);
            jumps.to({y: this.hero.height - 60}, 6000, Phaser.Easing.Bounce.In);
            jumps.onComplete.add(jumps, this);
            jumps.start();


        },
        scoreUpdate: function(){
            score += 5 * level;
            if(score > 200)
            {
                level += 1;
                this.currentLevel.setText(level.toString());
            }
            this.currentScore.setText(score.toString());
        },
        update: function() {

            this.game.physics.arcade.collide(this.hero, this.enimies, this.deathHandler, null, this);
        },
        deathHandler: function () {
            this.music.stop();
            game.state.start('gameOverState');
        }
    };
    game.state.add("playstate", playState);
    game.state.add("homestate", homeState);
    game.state.add("gameOverState", gameOverState);
    game.state.start('homestate');
})();
