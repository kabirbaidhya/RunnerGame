;(function () {
	window.runner = {};
	runner.state = {};

	runner.play = function() {
		this.game.state.add('playstate', this.state.playS);
	    this.game.state.add('homestate', this.state.home);
        this.game.state.add("gameOverState", this.state.gameOver);
        this.game.state.start('homestate');
	};
})();
