// Game Configurations
var Config = {
    GameWidth: 800,
    GameHeight: 600,
    PointInc: 200,
    ServeWaitTime: 1000,
    Font: "Consolas",
    BrickRows: 4,
    BrickCols: 7,
    BrickColors: [ex.Color.Violet, ex.Color.Red, ex.Color.Orange, ex.Color.Yellow],
    BrickPadding: 30,
    BrickAccel: 300,
    PaddleStartX: 300,
    PaddlePadding: 40,
    PaddleHeight: 20,
    PaddleWidth: 150,
    PaddleSpeed: 400,
    BallStartX: 200,
    BallStartY: 400,
    BallVector: new ex.Vector(200, 200),
    BallHeight: 20,
    BallWidth: 20,
    BallBorrow: .20
};

var State = {
    CurrentLevel: 1,
    LevelOneBricks: 0,
    LevelTwoBricks: 0
};

var Resources = {
    Bounce: new ex.Sound("./Sounds/bounce.wav"),
    Explode: new ex.Sound("./Sounds/break.wav"),
    Fail: new ex.Sound("./Sounds/fail.wav")
};

Resources.Bounce.setVolume(.2);
Resources.Explode.setVolume(.2);
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// Create ball
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(engine, bricks) {
        var _this = this;
        _super.call(this, Config.BallStartX, Config.BallStartY, Config.BallWidth, Config.BallHeight, ex.Color.Red);
        this.dx = Config.BallVector.x;
        this.dy = Config.BallVector.y;
        this.collisionType = 3 /* Elastic */;

        this.on('collision', function (e) {
            if (bricks.indexOf(e.other) > -1) {
                e.other.collisionType = 0 /* PreventCollision */;
                e.other.fade(0, 400);
                e.other.ay = Config.BrickAccel;
                points += Config.PointInc;
                if (State.CurrentLevel === 1) {
                    State.LevelOneBricks--;
                } else {
                    State.LevelTwoBricks--;
                }
                engine.camera.shake(7, 1, 400);
                Resources.Explode.play();
            } else {
                var borrow = e.other.dx * Config.BallBorrow;
                _this.dx += borrow;
                Resources.Bounce.play();
            }
        });

        this.on('exitviewport', function (e) {
            _this.dx = 0;
            _this.dy = 0;
            Resources.Fail.play();

            // you lose
            if (balls < 1) {
                console.log("you lose!");
                var youLose = new ex.Label("Game Over", engine.getWidth() / 2, engine.getHeight() / 2, "50px Consolas");
                youLose.textAlign = 2 /* Center */;
                youLose.color = ex.Color.Chartreuse;
                youLose.blink(1, 1000, 500).repeatForever();
                _this.scene.addChild(youLose);
            } else {
                balls--;
                var newBallTimer = new ex.Timer(function () {
                    _this.x = 200;
                    _this.y = 300;
                    _this.dx = 200;
                    _this.dy = 200;
                }, 1000, false);

                _this.scene.addTimer(newBallTimer);
            }
        });
    }
    Ball.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (State.CurrentLevel === 1) {
            if (this.x < 0) {
                this.x = 0;
                this.dx = -1 * this.dx;
                Resources.Bounce.play();
            }
            if (this.y < 0) {
                this.y = 0;
                this.dy = -1 * this.dy;
                Resources.Bounce.play();
            }

            if (this.x + this.getWidth() > engine.getWidth()) {
                this.x = engine.getWidth() - this.getWidth();
                this.dx = -1 * this.dx;
                Resources.Bounce.play();
            }
        }
    };
    return Ball;
})(ex.Actor);
var Paddle = (function (_super) {
    __extends(Paddle, _super);
    function Paddle(x, y, width, height, engine, direction, leftRightMode) {
        if (typeof leftRightMode === "undefined") { leftRightMode = true; }
        _super.call(this, x, y, width, height, ex.Color.Chartreuse);
        this.direction = direction;
        this.leftRightMode = leftRightMode;

        this.collisionType = 4 /* Fixed */;
    }
    Paddle.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (this.leftRightMode) {
            this.dx = 0;
            this.dy = 0;
            if (engine.isKeyPressed(37 /* Left */)) {
                this.dx = -Config.PaddleSpeed * this.direction;
            }
            if (engine.isKeyPressed(39 /* Right */)) {
                this.dx = Config.PaddleSpeed * this.direction;
            }

            if (this.x < 0) {
                this.x = 0;
            }

            if (this.x + this.getWidth() > engine.getWidth()) {
                this.x = engine.getWidth() - this.getWidth();
            }
        } else {
            this.dx = 0;
            this.dy = 0;
            if (engine.isKeyPressed(37 /* Left */)) {
                this.dy = -Config.PaddleSpeed * this.direction;
            }
            if (engine.isKeyPressed(39 /* Right */)) {
                this.dy = Config.PaddleSpeed * this.direction;
            }

            if (this.y < 0) {
                this.y = 0;
            }

            if (this.y + this.getHeight() > engine.getHeight()) {
                this.y = engine.getHeight() - this.getHeight();
            }
        }
    };
    return Paddle;
})(ex.Actor);
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick(x, y, width, height, color) {
        var _this = this;
        _super.call(this, x, y, width, height, color);

        this.collisionType = 4 /* Fixed */;
        this.on('exitviewport', function () {
            _this.kill();
        });
    }
    return Brick;
})(ex.Actor);
var LevelOne = (function (_super) {
    __extends(LevelOne, _super);
    function LevelOne(engine) {
        _super.call(this);

        // Create bricks for level 1
        var colors = [ex.Color.Violet, ex.Color.Red, ex.Color.Orange, ex.Color.Yellow];
        var bricks = [];
        var that = this;
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 4; j++) {
                (function () {
                    var tmp = new Brick(100 * i + 30, j * 50, 90, 30, colors[j].clone());
                    that.addChild(tmp);
                    bricks.push(tmp);
                })();
            }
        }

        State.LevelOneBricks = bricks.length;

        // Create the ball
        var ball = new Ball(engine, bricks);
        this.addChild(ball);

        // Create paddle
        var paddle = new Paddle(Config.PaddleStartX, engine.getHeight() - Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, 1);
        this.addChild(paddle);

        // Create scoring labels
        var score = new ex.Label("Score: 0", engine.getWidth() - 20, 30, "15px Consolas");
        score.color = ex.Color.Chartreuse;
        score.textAlign = 1 /* Right */;
        score.on('update', function () {
            score.text = "Score: " + points;
        });

        var serves = new ex.Label("Serves: " + balls, engine.getWidth() - 20, 50, "15px Consolas");
        serves.color = ex.Color.Chartreuse;
        serves.textAlign = 1 /* Right */;
        serves.on('update', function () {
            serves.text = "Serves: " + balls;
        });
        this.addChild(score);
        this.addChild(serves);

        engine.on('mousemove', function (e) {
            paddle.x = e.x - paddle.getWidth() / 2;
        });

        engine.on('touchmove', function (e) {
            paddle.x = e.x - paddle.getWidth() / 2;
        });

        this.onActivate = function () {
            State.CurrentLevel = 1;
        };
    }
    return LevelOne;
})(ex.Scene);
var NextLevel = (function (_super) {
    __extends(NextLevel, _super);
    function NextLevel(engine) {
        var _this = this;
        _super.call(this);

        // Wait 2 seconds before serving the ball for this level
        var startTimer = new ex.Timer(function () {
            _this.addChild(new Ball(engine, bricks));
        }, 2000, false);

        this.addTimer(startTimer);

        // Build all 4 paddles
        this.addChild(new Paddle(Config.PaddleStartX, engine.getHeight() - Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, 1));
        this.addChild(new Paddle(Config.PaddleStartX, Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, -1));
        this.addChild(new Paddle(Config.PaddlePadding, engine.getHeight() / 2 - Config.PaddleWidth / 2, Config.PaddleHeight, Config.PaddleWidth, engine, 1, false));
        this.addChild(new Paddle(engine.getWidth() - Config.PaddlePadding, engine.getHeight() / 2 - Config.PaddleWidth / 2, Config.PaddleHeight, Config.PaddleWidth, engine, -1, false));

        // Build all 4 paddles
        this.addChild(new Paddle(Config.PaddleStartX, engine.getHeight() - Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, -1));
        this.addChild(new Paddle(Config.PaddleStartX, Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, 1));
        this.addChild(new Paddle(Config.PaddlePadding, engine.getHeight() / 2 - Config.PaddleWidth / 2, Config.PaddleHeight, Config.PaddleWidth, engine, -1, false));
        this.addChild(new Paddle(engine.getWidth() - Config.PaddlePadding, engine.getHeight() / 2 - Config.PaddleWidth / 2, Config.PaddleHeight, Config.PaddleWidth, engine, 1, false));

        // Create bricks for level 1
        var colors = [ex.Color.Violet, ex.Color.Red, ex.Color.Orange, ex.Color.Yellow];
        var bricks = [];
        var that = this;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                (function () {
                    var tmp = new Brick(60 * i + 300, j * 60 + 200, 30, 30, colors[j % colors.length].clone());
                    that.addChild(tmp);
                    bricks.push(tmp);
                })();
            }
        }

        // Capture number of bricks for global state
        State.LevelTwoBricks += bricks.length;

        // Create scoring labels
        var score = new ex.Label("Score: 0", engine.getWidth() - 20, 30, "15px Consolas");
        score.color = ex.Color.Chartreuse;
        score.textAlign = 1 /* Right */;
        score.on('update', function () {
            score.text = "Score: " + points;
        });

        var serves = new ex.Label("Serves: " + balls, engine.getWidth() - 20, 50, "15px Consolas");
        serves.color = ex.Color.Chartreuse;
        serves.textAlign = 1 /* Right */;
        serves.on('update', function () {
            serves.text = "Serves: " + balls;
        });
        this.addChild(score);
        this.addChild(serves);

        this.onActivate = function () {
            State.CurrentLevel = 2;
        };
    }
    return NextLevel;
})(ex.Scene);
/**
* Whether or not an element has a CSS class present
* @param element The DOM element to check
* @param cls The CSS class to check for
* @returns True if the class exists and false if not
*/
function hasClass(element, cls) {
    return element.classList.contains(cls);
}

/**
* Replaces a CSS class on an element
* @param element The DOM element to manipulate
* @param search The CSS class to find
* @param replace The CSS class to replace with
*/
function replaceClass(element, search, replace) {
    if (hasClass(element, search)) {
        this.removeClass(element, search);
        this.addClass(element, replace);
    }
}

/**
* Adds a CSS class to a DOM element
* @param element The DOM element to manipulate
* @param cls The CSS class to add
*/
function addClass(element, cls) {
    element.classList.add(cls);
}

/**
* Removes a CSS class to a DOM element
* @param element The DOM element to manipulate
* @param cls The CSS class to remove
*/
function removeClass(element, cls) {
    element.classList.remove(cls);
}

function setVolume(val) {
    Resources.Bounce.setVolume(val);
    Resources.Explode.setVolume(val);
    Resources.Fail.setVolume(val);
}
/// <reference path="scripts/excalibur-0.2.5-pre.d.ts" />
/// <reference path="Config.ts" />
/// <reference path="ball.ts" />
/// <reference path="paddle.ts" />
/// <reference path="brick.ts" />
/// <reference path="levelone.ts" />
/// <reference path="nextlevel.ts" />
/// <reference path="util.ts" />
document.getElementById("sound").addEventListener('click', function () {
    if (hasClass(this, 'fa-volume-up')) {
        replaceClass(this, 'fa-volume-up', 'fa-volume-off');
        setVolume(0);
    } else {
        replaceClass(this, 'fa-volume-off', 'fa-volume-up');
        setVolume(.5);
    }
});

// Create the game container
var game = new ex.Engine(800, 600, 'game');

// Create the camera
game.camera = new ex.BaseCamera(game);

// Variables to keep track of the score and the number of serves left
var points = 0;
var balls = 3;
var gameWon = false;

var levelOne = new LevelOne(game);
game.addScene('levelOne', levelOne);

var nextLevel = new NextLevel(game);
game.addScene('nextLevel', nextLevel);

game.goToScene('levelOne');

// Winning and next level conditions
game.on('update', function () {
    if (State.LevelOneBricks <= 0 && State.CurrentLevel === 1) {
        State.CurrentLevel = 2;
        game.goToScene('nextLevel');
    }

    if ((State.LevelOneBricks + State.LevelTwoBricks) <= 0 && !gameWon) {
        gameWon = true;
        var youWin = new ex.Label("Winner!", game.getWidth() / 2, game.getHeight() / 2, "50px Consolas");
        youWin.textAlign = 2 /* Center */;
        youWin.color = ex.Color.Chartreuse;
        youWin.blink(1, 1000, 500).repeatForever();
        game.addChild(youWin);
    }
});

game.start(new ex.Loader([
    Resources.Bounce,
    Resources.Explode,
    Resources.Fail]));
//# sourceMappingURL=app.js.map
