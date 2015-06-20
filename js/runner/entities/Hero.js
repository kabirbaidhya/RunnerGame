;
(function () {
    runner.entities.Hero = function () {
        var game = runner.game;
        var position = runner.config.hero.position;
        var scaleFactor = runner.config.hero.scaleFactor;

        // load assets
        game.load.spritesheet('hero', 'assets/hero.png', 144, 144, 18);

        // create object
        this.create = function () {
            this.object = game.add.sprite(position[0], position[1], 'hero');
            this.object.scale.setTo(scaleFactor, scaleFactor);

            game.physics.arcade.enable(this.object);
            this.object.body.collideWorldBounds = true;

            this.object.animations.add('run', [12, 13, 14, 15, 16, 17], 6.5, true, true);
            this.object.animations.add('run-slow', [12, 13, 14, 15, 16, 17], 5, true, true);
            this.object.animations.add('run-fast', [12, 13, 14, 15, 16, 17], 10, true, true);
            this.object.animations.add('jump', [8, 9, 10, 11, 12], 4, true, true);
            // just to make the collision look closer
            this.object.body.width = 60;
        };

        this.playAnimation = function (name, frameRate, loop, killOnComplete) {
            this.object.animations.play(name, frameRate, loop, killOnComplete);
        };

        this.run = function (speed) {
            var animation = 'run' + ((speed === 'fast' || speed === 'slow') ? '-' + speed : '');
            this.playAnimation(animation);
        };

        this.isOnGround = function (ground) {
            return this.object.bottom === ground.top;
        };
        this.jump = function () {
            this.object.body.velocity.y = -500;
        };

    };
})();
