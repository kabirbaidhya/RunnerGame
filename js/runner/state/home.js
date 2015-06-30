;
(function () {
    var imageDim = runner.config.bgImageDimension;
    var game = runner.game;

    runner.state.home = {
        preload: function () {
            game.load.image('bg', 'assets/main-menu.jpg');
            game.load.image('name', 'assets/game-name.png');
        },
        create: function () {
            // Initialize score to 0
            runner.score = 0;

            this.bg = game.add.tileSprite(0, 0, imageDim[0], imageDim[1], 'bg');
            game.add.sprite(game.world.width / 5, game.world.height / 4, 'name');

            var playButton = game.add.text(game.world.centerX, game.world.centerY, 'Play', {
                fill: '#fff'
            });
            playButton.anchor.setTo(0.5, 0.5);

            playButton.inputEnabled = true;
            playButton.events.onInputDown.add(function () {
                runner.playScreen();
            }, this);
        },
        update: function () {


        }
    };
})();
