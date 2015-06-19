;
(function () {
    runner.config = {
        containerDimension: [1200, 600],
        bgImageDimension: [3000, 1500],
        hero: {
            position: [200, 236],
            scaleFactor: 0.8
        },
        getRatio: function () {
            return (this.containerDimension[0] / this.bgImageDimension[0]);
        }
    };
})();
