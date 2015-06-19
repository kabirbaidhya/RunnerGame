;(function () {
	runner.game = new Phaser.Game(
		runner.config.containerDimension[0], 
		runner.config.containerDimension[1]
	);
	
	runner.level = 1;
    runner.score = 0;
})();