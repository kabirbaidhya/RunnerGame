;
(function () {
    runner.entities.AsteroidGroup = function () {

        var physics;
        var game = runner.game;
        var colliders = [];
        var rnd = game.rnd;

        game.load.spritesheet('asteroids', 'assets/asteroids.png', 64, 64);

        var fallAsteroid = function () {

            // starting position of the asteroid
            var pos = {
                x: rnd.integerInRange(0, game.world.width - 64),
                y: -100
            };

            var sprite = rnd.integerInRange(1, 16);
            var asteroid = this.group.create(pos.x, pos.y, 'asteroids', sprite);
            var scaleFactor = rnd.integerInRange(5, 10) * 0.1;

            asteroid.scale.setTo(scaleFactor, scaleFactor);
            // direction of asteroid
            var dx = +1;
            if (pos.x > (game.world.width / 2)) {
                dx = -1;
            }

            // horizontal velocity of the asteroid
            asteroid.body.velocity.x = dx * rnd.integerInRange(1, 9) * 100;

            asteroid.collideWorldBounds = true;
            // just to make the collisions look closer
            asteroid.body.height = asteroid.body.height * .8;
            asteroid.body.width = asteroid.body.height * .8;
        };

        function collision(asteroid) {
            //asteroid.destroy();
        }

        this.setPhysics = function (physicsObject) {
            physics = physicsObject;
        };

        this.create = function () {
            this.group = game.add.physicsGroup();
        };


        this.startFalling = function () {

            var asteroidGenerator = game.time.events.loop(Phaser.Timer.SECOND * rnd.integerInRange(3, 8), fallAsteroid, this);
            asteroidGenerator.timer.start();
        };

        this.checkCollision = function () {

            var group = this.group;
            colliders.forEach(function (collider) {
                group.forEachAlive(function (asteroid) {
                    physics.arcade.collide(asteroid, collider, collision);
                });
            });
        };

        this.addCollider = function (object) {
            colliders.push(object);
        };
    };
})();
