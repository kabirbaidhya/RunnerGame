;
(function () {
    window.runner = {};

    // Constants
    runner.STATE_PLAY = 'play-state';
    runner.STATE_HOME = 'home-state';
    runner.STATE_GAME_OVER = 'game-over-state';

    //
    runner.state = {};
    runner.entities = {};
    runner.score = 0;
    runner.level = 1;

    // Start the game ( Home Screen )
    runner.homeScreen = function () {
        this.game.state.add(runner.STATE_HOME, this.state.home);
        this.game.state.add(runner.STATE_PLAY, this.state.play);
        this.game.state.add(runner.STATE_GAME_OVER, this.state.gameOver);

        // start state
        this.game.state.start(runner.STATE_HOME);
    };

    // Play state
    runner.playScreen = function () {
        this.game.state.start(runner.STATE_PLAY);
    };

    // Game over state
    runner.gameOverScreen = function () {
        this.game.state.start(runner.STATE_GAME_OVER);
    };
})();
