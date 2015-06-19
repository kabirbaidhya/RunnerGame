;(function () {
	runner.config = {
		containerDimension: [1200, 600],
		bgImageDimension: [3000, 1500],
		getRatio: function() {
			return (this.containerDimension[0]/ this.bgImageDimension[0]);
		}
	};
})();
