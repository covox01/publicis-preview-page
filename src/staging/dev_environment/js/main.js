document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById('container');
    var tooltip = document.getElementById('tooltip');
    var toolTip_Export = document.getElementById('toolTip_Export');
    var vline = document.getElementById('vline')
    var hline = document.getElementById('hline')
    var play = document.getElementById('play');
    var pause = document.getElementById('pause');
    var onex = document.getElementById('onex');
    var twox = document.getElementById('twox');
    var threex = document.getElementById('threex');
    var restart = document.getElementById('restart');
    var toolTip_button = document.getElementById('toolTip_button');
    var iframe = document.getElementById('iframe');
    var toolTip_class = document.querySelectorAll('.toolTip_class');

    var mouse = {};

    window.onmousemove = function (e) {
        var x = e.clientX - 2;
        var y = e.clientY - 3;
        tooltip.style.top = (y + 22) + 'px';
        tooltip.style.left = (x + 25) + 'px';
        tooltip.innerHTML = `x: ${x-bannerframe.offsetLeft}<br /> y: ${y-bannerframe.offsetTop}`;
        mouse.x = x-bannerframe.offsetLeft;
        mouse.y = y-bannerframe.offsetTop;
        vline.style.left = x;
        hline.style.top = y;
    };

    container.addEventListener("click", container_XY);
    function container_XY (e) {
        var x = e.clientX - 2;
        var y = e.clientY - 3;
        toolTip_Export.innerHTML += "x:" + mouse.x + ", " + "y:" + mouse.y + "<br>";
    } 

    toolTip_button.addEventListener("onmousemove", toolTip_buttonOver);
    function toolTip_buttonOver (e) {
        container.removeEventListener("click", container_XY);
    };

    toolTip_Export.addEventListener("mouseover", toolTip_ExportOver);
    function toolTip_ExportOver (e) {
        container.removeEventListener("click", container_XY);
    };

    toolTip_Export.addEventListener("mouseout", toolTip_ExportOut);
    function toolTip_ExportOut (e) {
        container.addEventListener("click", container_XY);
    };

    gsap.set(".toolTip_class, #toolTip_Export", {autoAlpha:0});
    toolTip_button.onclick = function() {
        toolTip_toggle = false;
        var x = toolTip_class;
        container.removeEventListener("click", container_XY);
        for (var index = 0; index < toolTip_class.length; index++) {
            var x = toolTip_class[index];
            if (x.style.visibility === "hidden") {
                //on
                gsap.set(x, {autoAlpha:1});
                gsap.set("#toolTip_Export", {autoAlpha:1});
                gsap.delayedCall(0.5, function () {
                    toolTip_button.removeEventListener("onmousemove", container_XY);
                    container.addEventListener("click", container_XY);
                });
            } else {
                //off						
                gsap.set(x, {autoAlpha:0});
                gsap.set("#toolTip_Export", {autoAlpha:0});
                gsap.delayedCall(0.5, function () {
                    toolTip_button.addEventListener("onmousemove", container_XY);
                    container.removeEventListener("click", container_XY);
                });
                toolTip_Export.innerHTML = "";
            }	
        }
    } 

    restart.onclick = function (e) {
        iframe.contentWindow.location.reload();
    }

    play.onclick = function (e) {
        iframe.contentWindow.postMessage('play', '*')
    }
    pause.onclick = function (e) {
        iframe.contentWindow.postMessage('pause', '*')
    }
    onex.onclick = function (e) {
        iframe.contentWindow.postMessage('onex', '*')
    }
    twox.onclick = function (e) {
        iframe.contentWindow.postMessage('twox', '*')
    }
    threex.onclick = function (e) {
        iframe.contentWindow.postMessage('threex', '*')
    }
});