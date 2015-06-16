;(function() {
    var imageDim = runner.config.bgImageDimension;
    var bgRatio = runner.config.getRatio();
    var game = runner.game;
    
	runner.state.play = {
        preload: function () {
            game.load.image('bg', 'assets/background.jpg');
            game.load.spritesheet('hero', 'assets/hero.png', 144, 144, 18);
            game.load.spritesheet('skeleton', 'assets/enemy1.png', 230, 460, 8);
            game.load.spritesheet('robot', 'assets/enemy2.png', 85.6, 128, 5);
            game.load.spritesheet('dog', 'assets/enemy3.png', 100, 58, 24);
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
            this.currentScore = game.add.text(1111, 37, runner.score.toString(), {
                fill: '#fff'
            });
            this.currentLevel = game.add.text(961, 37, runner.level.toString(), {
                fill: '#fff'
            });

            this.currentScore.anchor.setTo(0.5, 0.5);
            this.currentLevel.anchor.setTo(0.5, 0.5);
            this.bg.autoScroll(-500, 0);
            this.bg.scale.setTo(bgRatio, bgRatio);
            //this.hero.body.gravity.y = 1000;
            //var upArrow = game.input.keyboard.addKey(Phaser.Keyboard.UP);
            //upArrow.onDown.add(this.jump, this);

            this.hero = game.add.sprite(200, 407, 'hero');
            this.hero.animations.add('run', [12, 13, 14, 15, 16, 17], 8, true, true);
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
            runner.score += 5 * runner.level;
            if(runner.score > 200)
            {
                runner.level += 1;
                this.currentLevel.setText(runner.level.toString());
            }
            this.currentScore.setText(runner.score.toString());
        },
        update: function() {

           // this.game.physics.arcade.collide(this.hero, this.enimies, this.deathHandler, null, this);
        },
        deathHandler: function () {
            game.state.start('homestate');
        }
    };
})();