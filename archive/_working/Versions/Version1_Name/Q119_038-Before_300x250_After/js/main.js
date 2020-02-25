function init() {
	console.log("Banner Initiated")
	gsap.set([ "#viewport", "#border", "#background", "#logo" ], { alpha: 1 })
	frameOne();
}

function frameOne() {
	gsap.set("#text1", { alpha: 1})
	gsap.from("#text1", { alpha: 0, x: 250, duration:0.3})
	
	var frameDelay = 3.5;
	gsap.to(["#text1"], {alpha: 0, x: 250, duration:0.5, delay:frameDelay - 0.2});
	gsap.delayedCall(frameDelay, frameTwo);
}

function frameTwo() {
	gsap.fromTo("#text2", { alpha: 0, x: 250 }, { alpha: 1, x: 0, duration: 0.3})
	
	var frameDelay = 3.5;
	gsap.delayedCall(frameDelay, frameThree);
}

function frame () {
	var frameDelay = Number;

	gsap.delayedCall(frameDelay, frame );
}

function frameThree() {
	gsap.fromTo("#blue", { alpha: 0 }, { duration:0.3, alpha: 1 })
	gsap.fromTo(["#text3", "#cta", "#legal"], { alpha: 0 }, {duration:0.7, alpha: 1, delay: 0.7, onComplete: addEventListeners, stagger: 0.3})
}

function addEventListeners() {
	// clickable.addEventListener('mouseover', mouseover)
}

function mouseover() {
    // clickable.removeEventListener('mouseover', mouseover)
    // gsap.to(["#cta"], {duration: 0.3, yoyo:true, scale:1.1, repeat:1, rotation:0.01, force3D:false, transformOrigin:"150px 150px",
    // 	onComplete:
    //     function () {
    //         clickable.addEventListener('mouseover', mouseover)
    //     }
    // });
}