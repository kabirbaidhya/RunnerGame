;
(function () {
    var game = runner.game;

    runner.state.gameOver = {
        preload: function () {

        },
        create: function () {

            var gameOverText = game.add.text(game.world.centerX, 0.5 * game.world.centerY, 'Game Over', {
                fill: '#edc53f',
                font: 'bold 55px Arial'
            });
            gameOverText.anchor.setTo(0.5, 0.5);

            var mainMenuButton = game.add.text(game.world.centerX, game.world.centerY + 160, 'Main Menu', {
                fill: '#fff'
            });
            mainMenuButton.anchor.setTo(0.5, 0.5);

            var yourScoreText = game.add.text(game.world.centerX, game.world.centerY, 'Your Score: ' + runner.score.toString(), {
                fill: '#fff'
            });
            yourScoreText.anchor.setTo(0.5, 0.5);

            var music = game.add.audio('gameover');
            music.loop = false;
            music.play();
            mainMenuButton.inputEnabled = true;
            mainMenuButton.input.useHandCursor = true;
            mainMenuButton.events.onInputDown.add(function () {
                music.stop();
                runner.homeScreen();
            }, this);

        },
        update: function () {


        }
    };
})();
