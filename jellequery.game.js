(function () {
    var _ = jellequery;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var pl = new plCar();
    var bulletHolder = new Array();
    var counter = 0;
    var shootCounter = 0;
    _.enableKeyCapture();
    _.enableMouseTracking();
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function (callback) {
				    window.setTimeout(callback, 50);
				};
    })();
    (function animloop() {
        requestAnimFrame(animloop);
        update();
    })();
    function update() {
        counter++;
        shootCounter++;
        if (counter == Number.MAX_SAFE_INTEGER - 1)
            counter = 0;
        _.drawRectangle(0, 0, canvas.clientWidth, canvas.clientHeight, "black");
        pl.update();
        pl.render();
        for (i = 0; i < bulletHolder.length; i++) {
            bulletHolder[i].update();
            bulletHolder[i].render();
            if (bulletHolder[i].dead) {
                bulletHolder.splice(i, 1);
                i--;
            }
        }
        catchMouseEvents();
        _.drawCircle(canvas.clientWidth / 2, canvas.clientHeight / 2, 1, "rgb(0,255,0)");
    }
    function plCar() {
        this.xPos = 100;
        this.yPos = 100;
        this.speed = 0;
        this.angle = 0;
        this.ACCELERATION = 1.5;
        this.MAXSPEED = 14;
        this.TURNSPEED = .01;
        this.FRICTION = .5;
        this.id = _.guid();//unique id
        this.update = function () {
            if (counter % 2 == 0) {
                if (_.keysDown.up && this.speed <= this.MAXSPEED) {
                    this.speed += this.ACCELERATION;
                }
                if (_.keysDown.down && this.speed >= -this.MAXSPEED / 2) {
                    this.speed -= this.ACCELERATION;
                }
                if (this.speed > 0)
                    this.speed -= this.FRICTION;
                else if (this.speed < 0)
                    this.speed += this.FRICTION;
                if (this.speed < 1 && this.speed > -1)
                    this.speed = 0;

                if (_.keysDown.left) {
                    this.angle -= this.TURNSPEED * this.speed;
                }
                if (_.keysDown.right) {
                    this.angle += this.TURNSPEED * this.speed;
                }
                if (this.angle > Math.PI * 2)
                    this.angle = 0;
                else if (this.angle < 0)
                    this.angle = Math.PI * 2;
                this.xPos += Math.cos(this.angle) * this.speed;
                this.yPos += Math.sin(this.angle) * this.speed;
            }

        }
        this.render = function () {
            context.save();
            context.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);
            context.rotate(this.angle);
            _.drawImg(0 - 25, 0 - 15, "Images/dummy.png", 30, 50);
            context.restore();
        }
    }

    function enCar(car) {
        this.relX = pl.xPos - car.xPos + canvas.clientWidth / 2;
        this.relY = pl.yPos - car.yPos + canvas.clientHeight / 2;
        this.angle = car.angle;
        this.render = function () {
            if (pl.id != car.id && this.relX > 0 && this.relX < canvas.clientWidth && this.relY > 0 && this.relY < canvas.clientHeight) {
                context.save();
                context.translate(this.relX, this.relY);
                context.rotate(this.angle);
                _.drawImg(0 - 25, 0 - 15, "Images/dummy2.png", 30, 50);
                context.restore();
            }
        }
        this.update = function () {

        }
    }
    function catchMouseEvents() {

        if (_.mouseDown) {
            if (shootCounter > 7) {
                bulletHolder.push(new bul(_.giveRadsBetweenPoints(canvas.clientWidth / 2, canvas.clientHeight / 2, _.mouseCurrent.x - canvas.offsetLeft, _.mouseCurrent.y - canvas.offsetTop), pl.xPos, pl.yPos))
                shootCounter = 0;
            }
        }
    }
    function bul(angle, relX, relY) {
        this.livecounter = 80;
        this.dead = false;
        this.xPos = relX;
        this.yPos = relY;
        this.speed = 5;
        this.angle = angle - Math.PI / 2;
        this.update = function () {
            this.xPos += this.speed * Math.cos(this.angle);
            this.yPos += this.speed * Math.sin(this.angle);
            this.livecounter--;
            if (this.livecounter < 0)
                this.dead = true;
        }
        this.render = function () {
            _.drawCircle(this.xPos, this.yPos, 3, "#0F0");
        }

    }

})();