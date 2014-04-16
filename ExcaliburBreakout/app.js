var Config = {
    GameWidth: 800,
    GameHeight: 600,
    BrickRows: 4,
    BrickCols: 7,
    BrickColors: [ex.Color.Violet, ex.Color.Red, ex.Color.Orange, ex.Color.Yellow],
    PaddleHeight: 20,
    PaddleWidth: 100,
    PaddleSpeed: 400,
    BallHeight: 20,
    BallWidth: 20,
    BallBorrow: .20
};
/// <reference path="scripts/excalibur-0.2.2.d.ts" />
/// <reference path="Config.ts" />
// Create the game container
var game = new ex.Engine(800, 600);

// Variables to keep track of the score and the number of serves left
var points = 0;
var balls = 3;
var gameWon = false;

// Load sound resources
var bounce = new ex.Sound("./Sounds/bounce.wav");
var explode = new ex.Sound("./Sounds/break.wav");
var fail = new ex.Sound("./Sounds/fail.wav");
var loader = new ex.Loader([bounce, explode, fail]);

// Create bricks
var colors = [ex.Color.Violet, ex.Color.Red, ex.Color.Orange, ex.Color.Yellow];
var bricks = [];
for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 4; j++) {
        (function () {
            var tmp = new ex.Actor(100 * i + 30, j * 50, 90, 30, colors[j]);
            tmp.collisionType = 4 /* Fixed */;
            tmp.on('exitviewport', function () {
                tmp.kill();
            });
            game.addChild(tmp);
            bricks.push(tmp);
        })();
    }
}

var numbricks = bricks.length;

// Create ball
var ball = new ex.Actor(100, 400, 20, 20, ex.Color.Red);
ball.dx = 200;
ball.dy = 200;
ball.collisionType = 3 /* Elastic */;
ball.on('update', function (e) {
    if (ball.x < 0) {
        ball.x = 0;
        ball.dx = -1 * ball.dx;
        bounce.play();
    }
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy = -1 * ball.dy;
        bounce.play();
    }
    if (ball.x + ball.getWidth() > game.getWidth()) {
        ball.x = game.getWidth() - ball.getWidth();
        ball.dx = -1 * ball.dx;
        bounce.play();
    }
});
ball.on('collision', function (e) {
    if (bricks.indexOf(e.other) > -1) {
        e.other.collisionType = 0 /* PreventCollision */;
        e.other.ay = 300;
        points += 200;
        numbricks--;
        game.camera.shake(7, 1, 400);
        explode.play();
    } else {
        var borrow = e.other.dx * 0.2;
        ball.dx += borrow;
        bounce.play();
    }
});
ball.on('exitviewport', function (e) {
    ball.dx = 0;
    ball.dy = 0;
    fail.play();

    // you lose
    if (balls < 1) {
        console.log("you lose!");
        var youLose = new ex.Label("Game Over", game.getWidth() / 2, game.getHeight() / 2, "50px Consolas");
        youLose.textAlign = 2 /* Center */;
        youLose.color = ex.Color.Chartreuse;
        youLose.blink(1, 1000, 500).repeatForever();
        game.addChild(youLose);
    } else {
        balls--;
        var newBallTimer = new ex.Timer(function () {
            ball.x = 200;
            ball.y = 300;
            ball.dx = 200;
            ball.dy = 200;
        }, 1000, false);
        game.addTimer(newBallTimer);
    }
});
game.addChild(ball);

// Create paddle
var paddle = new ex.Actor(300, game.getHeight() - 40, 200, 20, ex.Color.Chartreuse);
paddle.collisionType = 4 /* Fixed */;
game.addChild(paddle);
paddle.on('keydown', function (e) {
    if (e.key == 37 /* Left */) {
        paddle.dx = -Config.PaddleSpeed;
    }

    if (e.key == 39 /* Right */) {
        paddle.dx = Config.PaddleSpeed;
    }
});

paddle.on('keyup', function (e) {
    if (e.key == 37 /* Left */ && paddle.dx < 0) {
        paddle.dx = 0;
    }

    if (e.key == 39 /* Right */ && paddle.dx > 0) {
        paddle.dx = 0;
    }
});

paddle.on('update', function (e) {
    if (paddle.x < 0) {
        paddle.x = 0;
    }

    if (paddle.x + paddle.getWidth() > game.getWidth()) {
        paddle.x = game.getWidth() - paddle.getWidth();
    }
});

// Create scoring labels
var score = new ex.Label("Score: 0", game.getWidth() - 20, 30, "15px Consolas");
score.color = ex.Color.Chartreuse;
score.textAlign = 1 /* Right */;
score.on('update', function () {
    score.text = "Score: " + points;
});

var serves = new ex.Label("Serves: " + balls, game.getWidth() - 20, 50, "15px Consolas");
serves.color = ex.Color.Chartreuse;
serves.textAlign = 1 /* Right */;
serves.on('update', function () {
    serves.text = "Serves: " + balls;
});

game.addChild(score);
game.addChild(serves);
game.camera = new ex.BaseCamera(game);

game.on('update', function () {
    if (numbricks <= 0 && !gameWon) {
        gameWon = true;
        var youWin = new ex.Label("Winner!", game.getWidth() / 2, game.getHeight() / 2, "50px Consolas");
        youWin.textAlign = 2 /* Center */;
        youWin.color = ex.Color.Chartreuse;
        youWin.blink(1, 1000, 500).repeatForever();
        ball.dx = 0;
        ball.dy = 0;
        game.addChild(youWin);
    }
});

game.start(loader);
//# sourceMappingURL=app.js.map
