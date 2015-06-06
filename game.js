;
(function () {

    var game = new Phaser.Game(900, 500);

    var timer = 0;

    var homeState = {
        preload: function () {

        },
        create: function () {
            var button1 = game.add.text(game.world.centerX, game.world.centerY, 'Play', {
                fill: '#fff'
            });
            button1.anchor.setTo(0.5, 0.5);
            button1.inputEnabled = true;

            button1.events.onInputDown.add(function () {
                game.state.start('playstate');
            }, this);

        },
        update: function () {
        }
    };

    var playState = {
        timer: 0,
        preload: function () {
            game.load.image('bird', 'assets/bird1.png');
            game.load.image('bg', 'assets/gamebg.jpg');
            game.load.spritesheet('pipes', 'assets/pipes.png', 54, 320);
        },
        create: function () {
            this.bg = game.add.tileSprite(0, 0, 900, 512, 'bg').autoScroll(-100, 0);

            this.bird = game.add.sprite(game.world.centerX, game.world.centerY, 'bird');
            this.bird.anchor.setTo(0.5, 0.5);
            this.bird.scale.setTo(0.6, 0.6);

            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.enable(this.bird);
            this.bird.body.gravity.y = 800;

            var spcBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spcBar.onDown.add(this.jump, this);

            this.makePipes();

            this.timerText = game.add.text(game.world.centerX, game.world.top, 'Timer: ' + this.timer, {
                fill: '#fff'
            });
        },
        update: function () {
            this.timer++;
            this.bird.angle += 1.5;
            this.timerText.text = this.timer;

            game.physics.arcade.collide(this.bird, this.pipes, this.deathHandler, null, this);
            if (!this.bird.inWorld) {
                this.deathHandler();
            }

            console.log(this.pipes);
        },
        jump: function () {
            this.bird.body.velocity.y = -300;

            game.add.tween(this.bird).to({angle: -40}, 100).start();
        },

        makePipe: function () {
            var pipeY = game.rnd.integerInRange(-100, 100);
            var pipeX = game.width;

            var pipe1 = game.add.sprite(pipeX, 0, 'pipes', 0);
            var pipe2 = game.add.sprite(pipeX, 440, 'pipes', 1);

            game.physics.arcade.enable(pipe1);
            game.physics.arcade.enable(pipe2);

            this.pipes.add(pipe1);
            this.pipes.add(pipe2);

            this.pipes.setAll('body.velocity.x', -200);
        },
        makePipes: function () {
            this.pipeGenerator = game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.makePipe, this);
            this.pipeGenerator.timer.start();

            this.pipes = game.add.group();
        },
        deathHandler: function () {
            this.timer = 0;
            game.state.start('homestate');
        }
    };
    game.state.add("playstate", playState);
    game.state.add("homestate", homeState);
    game.state.start('homestate');

})();
