//jellequery namespace (object), much library, very wow
//var ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
var jellequery = {

    ctx: document.getElementById("canvas").getContext("2d"),
    mouseDown: false,
    mouseCurrent: { x: 0, y: 0 },
    keysDown: {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false
    },
    canvas: document.getElementById("canvas"),
    //gets canvas, either by id or by the first tag,
    getCanvas: function (id) {
        var canvas;
        if (!id) {
            var canvas = document.getElementById("canvas");
        }
        if (!canvas) {//if canvas is falsy...
            canvas = document.getElementById("canvas");
        }
        return canvas;
    },
    setSizeCanvas: function (canvas) {
        if (canvas) {
            var WIDTH = 320;
            var HEIGHT = 480;
            var currentWidth = WIDTH;
            var currentHeight = HEIGHT;
            var RATIO = window.innerHeight / window.innerWidth;
            currentHeight = window.innerHeight;
            currentWidth = window.innerWidth;
            canvas.width = currentWidth;
            canvas.height = currentHeight;
            ua = navigator.userAgent.toLowerCase();
            android = ua.indexOf('android') > -1 ? true : false;
            ios = (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) ?
            true : false;
            var scale = 1;
            offset = { top: 0, left: 0 };
            if (android || ios) {
                document.body.style.height = (window.innerHeight + 50) + 'px';
            }
            canvas.style.width = currentWidth + 'px';
            canvas.style.height = currentHeight + 'px';
            //scale = currentWidth / WIDTH;
            offset.top = canvas.offsetTop;
            offset.left = canvas.offsetLeft;
            window.setTimeout(function () { window.scrollTo(0, 1); }, 1);

        } else {
            throw "setSizeCanvas requires a valid canvas as parameter";
        }
    },
    getTimer: function () {
        return window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
        })();
    },
    drawRectangle: function (x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    },
    drawBorderRectangle: function (x, y, color, width, height) {
        this.ctx.beginPath();
        this.ctx.lineWidth = "2";
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.stroke();
        this.ctx.closePath();
    },
    drawCircle: function (x, y, r, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    },
    drawImg: function (x, y, afbeelding, width, height) {
        var img = new Image(width, height);
        img.src = afbeelding;
        this.ctx.drawImage(img, x, y);
    },
    drawText: function (x, y, font) {
        this.ctx.font = font;
        this.ctx.fillText("Hello World", x, y);
    },
    enableKeyCapture: function () {

        document.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37:
                    jellequery.keysDown.left = true;
                    break;
                case 38:
                    jellequery.keysDown.up = true;
                    break;
                case 39:
                    jellequery.keysDown.right = true;
                    break;
                case 40:
                    jellequery.keysDown.down = true;
                    break;
            }
        });
        document.addEventListener("keyup", function (e) {
            switch (e.keyCode) {
                case 37:
                    jellequery.keysDown.left = false;
                    break;
                case 38:
                    jellequery.keysDown.up = false;
                    break;
                case 39:
                    jellequery.keysDown.right = false;
                    break;
                case 40:
                    jellequery.keysDown.down = false;
                    break;
            }
        });
    },
    enableMouseTracking: function () {
        this.canvas.addEventListener("mousedown", function (e) {
            e.preventDefault();
            jellequery.mouseDown = true;
        }, false);
        window.addEventListener("mouseup", function (e) {
            e.preventDefault();
            jellequery.mouseDown = false;
        }, false);
        this.canvas.addEventListener("touchstart", function (e) {
            e.preventDefault();
            jellequery.mouseDown = true;
        }, false);
        window.addEventListener("touchend", function (e) {
            e.preventDefault();
            jellequery.mouseDown = false;
        }, false);

        if (window.navigator.pointerEnabled) {
            // Pointer events are supported.
            this.canvas.addEventListener("pointermove", function (event) {
                jellequery.mouseCurrent = { x: event.pageX, y: event.pageY }
            }, false);
        }
        else {
            this.canvas.addEventListener("mousemove", function (event) {
                jellequery.mouseCurrent = { x: event.pageX, y: event.pageY }
            }, false);
        };
    },
    //hitTestPoint, returns boolean
    //img = image first object
    //x1 & y1 = coördinates first object
    //x2 & y2 coördinates second object
    //works 99,99% of the time,who needs a bugless function anyway?
    hitTestPoint: function (img, x1, y1, x2, y2) {
        var canTemp = document.createElement("canvas");
        canTemp.setAttribute("Width", this.canvas.getAttribute("Width"));
        canTemp.setAttribute("Height", this.canvas.getAttribute("Height"));
        var ctxTemp = canTemp.getContext('2d');
        ctxTemp.drawImage(img, x1, y1);
        this.imgData = ctxTemp.getImageData(x2, y2, 1, 1);
        if (this.imgData.data[3] == 255) {
            return true;
        } else {
            return false;
        }
    },
    giveRadsBetweenPoints: function (x1, y1, x2, y2) {//calculates the angle between 2 points in rads, useful for mouse drag and drop
        var rads = Math.abs((Math.atan((x1 - x2) / (y1 - y2))));
        if (x1 < x2 && y1 > y2) {
            //do absolutely nothing, y iz diz here?
        } else if (x1 < x2 && y1 < y2) {
            rads = Math.PI / 2 + (Math.PI / 2 - rads);
        }else if (x1 > x2 && y1 < y2) {
            rads += Math.PI;
        } else if (x1 > x2 && y1 > y2) {
            rads = Math.PI * (3 / 2) + (Math.PI / 2 - rads);
        } else if (x1 == x2 && y1 > y2) {
            return 0;
        } else if (x1 == x2 && y1 < y2) {
            return Math.PI;
        } else if (x1 < x2 && y1 == y2) {
            return Math.PI / 2;
        } else if (x1 > x2 && y1 == y2) {
            return Math.PI * (3 / 2);
        }

        return rads;
    },
    guid: function () {
        this.s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }
}