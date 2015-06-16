;(function () {
	runner.state.home = {
        preload: function () {

        },
        create: function () {
            var button1 = runner.game.add.text(runner.game.world.centerX, runner.game.world.centerY, 'Play', {
                fill: '#fff'
            });
            button1.anchor.setTo(0.5, 0.5);
            button1.inputEnabled = true;
            button1.events.onInputDown.add(function () {
                runner.game.state.start('playstate');
            }, this);
        },
        update: function () {


        }
    };
})();