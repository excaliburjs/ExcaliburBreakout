

class NextLevel extends ex.Scene {
    constructor(engine: ex.Engine) {
        super();
                       
        // Wait 2 seconds before serving the ball for this level
        var startTimer = new ex.Timer(() => {
            this.addChild(new Ball(engine, bricks));
        }, 2000, false);

        this.addTimer(startTimer);

        // Build all 4 paddles
        this.addChild(new Paddle(Config.PaddleStartX, engine.getHeight() - Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, 1));
        this.addChild(new Paddle(Config.PaddleStartX, Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, -1));
        this.addChild(new Paddle(Config.PaddlePadding, engine.getHeight()/2 - Config.PaddleWidth/2, Config.PaddleHeight, Config.PaddleWidth, engine, 1, false));
        this.addChild(new Paddle(engine.getWidth() - Config.PaddlePadding, engine.getHeight() / 2 - Config.PaddleWidth / 2, Config.PaddleHeight, Config.PaddleWidth, engine, -1, false));

        // Build all 4 paddles
        this.addChild(new Paddle(Config.PaddleStartX, engine.getHeight() - Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, -1));
        this.addChild(new Paddle(Config.PaddleStartX, Config.PaddlePadding, Config.PaddleWidth, Config.PaddleHeight, engine, 1));
        this.addChild(new Paddle(Config.PaddlePadding, engine.getHeight() / 2 - Config.PaddleWidth / 2, Config.PaddleHeight, Config.PaddleWidth, engine, -1, false));
        this.addChild(new Paddle(engine.getWidth() - Config.PaddlePadding, engine.getHeight() / 2 - Config.PaddleWidth / 2, Config.PaddleHeight, Config.PaddleWidth, engine, 1, false));

        // Create bricks for level 1
        var colors: ex.Color[] = [ex.Color.Violet, ex.Color.Red, ex.Color.Orange, ex.Color.Yellow];
        var bricks: ex.Actor[] = [];
        var that = this;
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 2; j++) {
                (function () {
                    var tmp = new Brick(60 * i + 200, j * 60+200, 30, 30, colors[j % colors.length].clone());
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

        this.onActivate = function () {
            State.CurrentLevel = 2;
        }

    }

    
}