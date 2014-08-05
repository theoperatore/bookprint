//
// Sets up the page with the canvas and style
//
var style = document.createElement('style');

style.type = 'text/css';
style.appendChild(document.createTextNode("html,body {width: 100%; height: 100%} * { margin: 0; padding: 0 }"));
document.head.appendChild(style);

var cvs = document.createElement("canvas"),
    ctx = cvs.getContext('2d');
document.body.appendChild(cvs);

var width  = window.innerWidth;
var height = window.innerHeight;

var dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio    ||
          ctx.msBackingStorePixelRatio     ||
          ctx.oBackingStorePixelRatio      ||
          ctx.backingStorePixelRatio       ||
          1;
var ratio = dpr / bsr;

if (dpr !== bsr) {

    cvs.width  = width * ratio;
    cvs.height = height * ratio;

    cvs.style.width  = (width) + "px";
    cvs.style.height = (height) + "px";

    cvs.getContext('2d').scale(ratio,ratio);
}

//cvs.width = width;
//cvs.height = height;

module.exports = cvs;