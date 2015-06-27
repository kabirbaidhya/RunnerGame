;
(function () {
    var game = runner.game;

    runner.state.gameOver = {
        preload: function () {
            game.load.audio('gameover', ['assets/winner.mp3', 'assets/winner.ogg']);
        },
        create: function () {
            var gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', {
                fill: '#fff'
            });
            gameOverText.anchor.setTo(0.5, 0.5);
            var mainMenuButton = game.add.text(game.world.centerX, game.world.centerY + 160, 'Main Menu', {
                fill: '#fff'
            });
            mainMenuButton.anchor.setTo(0.5, 0.5);
            var yourScoreText = game.add.text(game.world.centerX, game.world.centerY - 60, 'Your Score:', {
                fill: '#fff'
            });
            yourScoreText.anchor.setTo(0.5, 0.5);
            var yourScore = game.add.text(game.world.centerX + 100, game.world.centerY - 60, runner.score.toString(), {
                fill: '#fff'
            });
            yourScore.anchor.setTo(0.5, 0.5);

            var music = game.add.audio('gameover');
            music.loop = true;
            music.play();
            mainMenuButton.inputEnabled = true;
            mainMenuButton.events.onInputDown.add(function () {
                music.stop();
                runner.homeScreen();
            }, this);

        },
        update: function () {


        }
    };
})();
