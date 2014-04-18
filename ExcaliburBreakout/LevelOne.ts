class LevelOne extends ex.Scene {
    constructor(engine: ex.Engine) {
        super();
        

        // Create bricks for level 1
        var colors: ex.Color[] = [ex.Color.Violet, ex.Color.Red, ex.Color.Orange, ex.Color.Yellow];
        var bricks: ex.Actor[] = [];
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
        score.textAlign = ex.TextAlign.Right;
        score.on('update', () => {
            score.text = "Score: " + points;
        });

        var serves = new ex.Label("Serves: " + balls, engine.getWidth() - 20, 50, "15px Consolas");
        serves.color = ex.Color.Chartreuse;
        serves.textAlign = ex.TextAlign.Right;
        serves.on('update', () => {
            serves.text = "Serves: " + balls;
        });
        this.addChild(score);
        this.addChild(serves);


        engine.on('mousemove', (e?: ex.MouseMove) => {
            paddle.x = e.x - paddle.getWidth() / 2;
        });

        engine.on('touchmove', (e?: ex.TouchMove) => {
            paddle.x = e.x - paddle.getWidth() / 2;
        });

        this.onActivate = function () {
            State.CurrentLevel = 1;
        }
    }
}