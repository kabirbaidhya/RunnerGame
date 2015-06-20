;
(function () {
    runner.entities.AsteroidGroup = function () {

        var physics;
        var game = runner.game;

        var colliders = [];
        game.load.spritesheet('asteroids', 'assets/asteroids.png', 64, 64, 1);

        this.setPhysics = function (physicsObject) {
            physics = physicsObject;
        };

        this.create = function () {
            this.group = game.add.physicsGroup();
        };

        this.startFalling = function () {

            var asteroid = this.group.create(100, -100, 'asteroids', 1);

            asteroid.body.velocity.y = 1000;
            asteroid.collideWorldBounds = true;
            //this.group.setAll('collideWorldBounds', true);

            // just to make the collisions look closer
            asteroid.body.height = 50;
            asteroid.body.width = 50;
        };

        this.checkCollision = function () {

            function collision(asteroid) {
                //console.log('collided', c);
                asteroid.destroy();
            }

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
