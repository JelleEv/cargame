﻿(function () {
    var _ = jellequery;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    var pl = new plCar();
    var bulletHolder = new Array();
    var counter = 0;
    var shootCounter = 0;
    var enemyHolder = new Array();
    for (var i = 0; i < 100; i++) {
        var att = new attacker1();//tmp
        enemyHolder.push(att);
    }

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
        for (var i = 0; i < enemyHolder.length; i++) {
            enemyHolder[i].update();//tmp
            enemyHolder[i].render();//tmp
        }
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
        this.xPos = 0;
        this.yPos = 0;
        this.speed = 0;
        this.xySpeed = {
            x: 0,
            y: 0
        }
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
                this.xySpeed.x = Math.cos(this.angle) * this.speed;
                this.xySpeed.y = Math.sin(this.angle) * this.speed;
                this.xPos += this.xySpeed.x;
                this.yPos += this.xySpeed.y;
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
                bulletHolder.push(new bul(_.giveRadsBetweenPoints(canvas.clientWidth / 2, canvas.clientHeight / 2, _.mouseCurrent.x - canvas.offsetLeft, _.mouseCurrent.y - canvas.offsetTop), canvas.clientWidth / 2, canvas.clientHeight / 2))
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
            _.drawCircle(this.xPos, this.yPos, 1, "#0F0");
        }
    }
    function attacker1() {
        this.pos = new startCor();
        this.speed = 0;
        this.angle;
        this.MAXSPEED = 10 + Math.ceil(Math.random() * 5);
        this.update = function () {
            this.angle = _.giveRadsBetweenPoints(this.pos.x, this.pos.y, canvas.clientWidth / 2, canvas.clientHeight / 2);
            //this.pos.x -= pl.xySpeed.x;
            //this.pos.y -= pl.xySpeed.y;
        }
        this.render = function () {
            _.drawCircle(this.xPos, this.yPos, 9, "#F00");
        }
    }

    function startCor() {
        this.x = 0;
        this.y = 0;
        switch (Math.ceil(Math.random() * 4)) {
            case 1://he starts up 
                this.y = -100;
                this.x = Math.ceil(Math.random() * canvas.clientWidth);
                break;
            case 2://he starts right
                this.y = Math.ceil(Math.random() * canvas.clientHeight)
                this.x = canvas.clientWidth + 100;
                break;
            case 3://he starts down
                this.y = canvas.clientHeight + 100;
                this.x = Math.ceil(Math.random() * canvas.clientWidth);
                break;
            case 4://he starts left
                this.y = canvas.clientHeight - 100;
                this.x = Math.ceil(Math.random() * canvas.clientWidth);
                break;
        }
    }
})();