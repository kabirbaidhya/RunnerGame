;
(function () {

    var containerDim = [1200, 600];
    var game = new Phaser.Game(containerDim[0], containerDim[1]);
    var imageDim = [3000, 1500];
    var ratio = containerDim[0] / imageDim[0];

    /*var homeState = {
     preload: function () {

     },
     create: function () {
     var button1 = game.add.text(game.world.centerX, game.world.centerY, 'Play', {
     fill: '#fff'
     });
     button1.anchor.setTo(0.5, 0.5);
     button1.inputEnabled = true;

     button1.events.onInputDown.add(function () {
     game.state.start('playstate');
     }, this);

     },
     update: function () {
     }
     };*/

    var playState = {
        preload: function () {
            game.load.image('bg', 'assets/background.jpg');
            var ss = game.load.spritesheet('hero', 'assets/hero.png', 144, 144, 18);
            console.log(ss);
        },
        create: function () {
            this.bg = game.add.tileSprite(0, 0, imageDim[0], imageDim[1], 'bg');
            this.bg.autoScroll(-400, 0);
            this.bg.scale.setTo(ratio, ratio);

            var hero = game.add.sprite(200, 407, 'hero');
            console.log(hero);
            hero.animations.add('walk');
            hero.animations.play('walk', 5, true);
        },
        update: function () {

        }
    };
    game.state.add("playstate", playState);
    //game.state.add("homestate", homeState);
    game.state.start('playstate');

})();
