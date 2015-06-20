;
(function () {
    runner.entities.AsteroidGroup = function () {

        var game = runner.game;

        game.load.spritesheet('asteroids', 'assets/asteroids.png', 64, 64, 1);

        this.create = function () {
            this.group = game.add.physicsGroup();
            var asteroid = this.group.create(100, -100, 'asteroids', 1);
            asteroid.body.velocity.y = 1000;
            this.group.setAll('collideWorldBounds', true);
        }
    };
})();
