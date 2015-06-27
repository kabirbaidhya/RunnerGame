;
(function () {
    var imageDim = runner.config.bgImageDimension;
    var bgRatio = runner.config.getRatio();
    var game = runner.game;

    runner.state.home = {
        preload: function () {
            game.load.image('bg', 'assets/background.jpg');
            game.load.audio('mainmenu', ['assets/main-menu.mp3', 'assets/main-menu.ogg']);
        },
        create: function () {
            // Initialize score to 0
            runner.score = 0;

            this.bg = game.add.tileSprite(0, 0, imageDim[0], imageDim[1], 'bg');
            this.bg.scale.setTo(bgRatio, bgRatio);
            var button1 = runner.game.add.text(runner.game.world.centerX, runner.game.world.centerY, 'Play', {
                fill: '#fff'
            });
            button1.anchor.setTo(0.5, 0.5);
            var music = runner.game.add.audio('mainmenu');
            music.loop = true;
            music.play();
            button1.inputEnabled = true;
            button1.events.onInputDown.add(function () {
                runner.playScreen();
                music.stop();
            }, this);
        },
        update: function () {


        }
    };
})();
