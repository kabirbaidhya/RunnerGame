;
(function () {
    var game = runner.game;

    runner.state.preload = {
        preload: function () {
            game.load.image('loading', 'assets/loading.png');


            game.load.image('bg', 'assets/background.jpg');
            game.load.spritesheet('robot', 'assets/enemy2.png', 85.6, 128, 5);
            game.load.spritesheet('dog', 'assets/enemy3.png', 100, 58, 24);
            game.load.image('coin', 'assets/diamond.png');
            game.load.image('ufo', 'assets/ufo.png');
            game.load.spritesheet('mummy', 'assets/metalslug_mummy.png', 37, 45, 18);
            game.load.audio('playing', ['assets/play.mp3', 'assets/play.ogg']);
            game.load.image('ground', 'assets/transplatform.png');

            //game.load.image('bg', 'assets/score.jpg');
            game.load.audio('gameover', ['assets/winner.mp3', 'assets/winner.ogg']);

        },
        create: function () {
            var loadingText = this.add.text(this.world.centerX, this.world.centerY - 30, 'Loading', {
                font: '28px roboto_slabregular',
                fill: '#fff'
            });
            loadingText.anchor.setTo(0.5);

            this.loading = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
            this.loading.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.loading);
            this.loading.cropEnabled = false;
        },
        update: function () {
            runner.homeScreen();
        }
    };
})();
