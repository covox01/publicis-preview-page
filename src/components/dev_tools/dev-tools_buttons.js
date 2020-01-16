window.addEventListener('message', function (e) {
	if (e.data === 'play') {
		TweenMax.resumeAll();
		console.log('play')
	}
	if (e.data === 'pause') {
		TweenMax.pauseAll();
		console.log('pause')
	}
	if (e.data === 'onex') {
		TweenMax.globalTimeScale(1);
		console.log('onex')
	}
	if (e.data === 'twox') {
		TweenMax.globalTimeScale(2);
		console.log('twox')
	}
	if (e.data === 'threex') {
		TweenMax.globalTimeScale(3);
		console.log('threex')
	}
});