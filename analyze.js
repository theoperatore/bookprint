var cvs = require("./setup"),
    nlp = require("nlp_compromise");

var ctx = cvs.getContext('2d');

//var no = "Even the Catholic Church of the Middle Ages was tolerant by modern standards."

var center = { x: cvs.width/4, y: cvs.height/4 };
var anim;

//var A = O = 1 / Math.sqrt(2);
var A = 0.5;
var O = 50;
var angle = 60;
var thickness = 3;
var web = [];
var sidx = 0;
var sidxMax;
var widx = 0;
var widxMax; 
var sentences;
var prevX = center.x;
var prevY = center.y;

var percent = document.getElementById("percent-completed");

function handleFileSelect(e) {

    var files = e.target.files;
    var file = files[0];

    var reader = new FileReader();
    reader.addEventListener("load", function(f) {
            //var stringified = JSON.stringify(f.target.result);
            sentences = nlp.pos(f.target.result);
            sidxMax = sentences.length;

            ctx.moveTo(center.x, center.y);
            anim = requestAnimationFrame(update);
    }, false);

    reader.readAsText(file);
}

document.getElementById("file-input").addEventListener("change", handleFileSelect, false);

function calculateDelta(angle) {
    return (2*Math.PI*O) / Math.sqrt((A*A)*(1+(angle * angle)));
}

function calculateDX(angle) {
    return ((A*angle*Math.cos(angle)) / (2*Math.PI));
}

function calculateDY(angle) {
    return ((A*angle*Math.sin(angle)) / (2*Math.PI));   
}

function update() {
    anim = requestAnimationFrame(update);

    if (sidx < sidxMax) {

        percent.innerHTML = (sidx / sidxMax) + "%";

        var stroke = "#aaaaaa";

        var currSentence = sentences[sidx];
        widxMax = currSentence.tokens.length;

        if (widx < widxMax) {
            var part = currSentence.tokens[widx];

            if (part.pos.parent === "noun") {
                //web.push(["noun", x,y, "#00bfff"]);
                stroke = "#00bfff";
                thickness = 5;
                A = 2;
                O = 20;

            }
            else if (part.pos.parent === "verb") {
                //web.push(["verb", x,y, "#ffb05c"]);
                stroke="#ffb05c";
                thickness = 4;
                A = 4;
                O = 10;
            }
            else if (part.pos.parent === "adjective") {
                //web.push(["adjective", x,y, "#ff6bd0"]);
                stroke="#ff6bd0";
                thickness = 3;
                A = 6;
                O = 5;
            }
            else if (part.pos.parent === "adverb") {
                //web.push(["adverb", x,y, "#80ff66"]);   
                stroke="#80ff66";
                thickness = 2;
                A = 8;
                O = 5;
            }
            else if (part.pos.parent === "glue") {
                stroke="#6e00ff";
                thickness = 1;
                A = 10;
                O = 1;
            }

            var d = calculateDelta(angle);
            angle += d;

            var x = center.x + calculateDX(angle);
            var y = center.y + calculateDY(angle);

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.strokeStyle = stroke;
            ctx.lineWidth = thickness;
            ctx.lineTo(x,y);
            ctx.closePath();
            ctx.stroke();

            prevX = x;
            prevY = y;

            sidx++;
            widx++;
        }
        else {
            widx = 0;
        }

    }
    else {
        console.log("cancelling animation");
        cancelAnimationFrame(anim);
    }
}