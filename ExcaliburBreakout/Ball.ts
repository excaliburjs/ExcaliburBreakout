
// Create ball 
class Ball extends ex.Actor {
    constructor(engine: ex.Engine, bricks: ex.Actor[]) {
        super(Config.BallStartX, Config.BallStartY, Config.BallWidth, Config.BallHeight, ex.Color.Red);
        this.dx = Config.BallVector.x;
        this.dy = Config.BallVector.y;
        this.collisionType = ex.CollisionType.Elastic;

        this.on('collision', (e: ex.CollisionEvent) => {
            if (bricks.indexOf(e.other) > -1) {
                e.other.collisionType = ex.CollisionType.PreventCollision;
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
                this.dx += borrow;
                Resources.Bounce.play();
            }
        });

        this.on('exitviewport', (e: ex.ExitViewPortEvent) => {
            this.dx = 0;
            this.dy = 0;
            Resources.Fail.play();
            // you lose
            if (balls < 1) {
                console.log("you lose!");
                var youLose = new ex.Label("Game Over", engine.getWidth() / 2, engine.getHeight() / 2, "50px Consolas");
                youLose.textAlign = ex.TextAlign.Center;
                youLose.color = ex.Color.Chartreuse;
                youLose.blink(1, 1000, 500).repeatForever();
                this.scene.addChild(youLose);

            } else {
                balls--;
                var newBallTimer = new ex.Timer(() => {
                    this.x = 200;
                    this.y = 300;
                    this.dx = 200;
                    this.dy = 200;
                }, 1000, false);

                this.scene.addTimer(newBallTimer);
            }
        });
    }

    public update(engine, delta) {
        super.update(engine, delta);
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
    }
}
