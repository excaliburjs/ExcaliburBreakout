
class Paddle extends ex.Actor {
    constructor(x, y, width, height, engine: ex.Engine, public direction:number, public leftRightMode: boolean = true) {
        super(x, y, width, height, ex.Color.Chartreuse);

        this.collisionType = ex.CollisionType.Fixed;

        engine.on('mousemove', (e?: ex.MouseMove) => {
            if (leftRightMode) {
                this.x = e.x - this.getWidth() / 2;
            } else {
                this.y = e.y - this.getHeight() / 2;
            }

        });

        engine.on('touchmove', (e?: ex.TouchMove) => {
            if (leftRightMode) {
                var pos = e.y * (engine.getWidth() / engine.getHeight());
                this.x = pos;
            } else {
                var pos = e.x * (engine.getHeight() / engine.getWidth());
                this.y = pos;
            }

        });
    }

    public update(engine: ex.Engine, delta: number) {
        super.update(engine, delta);
        if (this.leftRightMode) {
            this.dx = 0;
            this.dy = 0;
            if (engine.isKeyPressed(ex.InputKey.Left)) {
                this.dx = -Config.PaddleSpeed;// * this.direction;
            }
            if (engine.isKeyPressed(ex.InputKey.Right)) {
                this.dx = Config.PaddleSpeed;// * this.direction;
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
            if (engine.isKeyPressed(ex.InputKey.Up)) {
                this.dy = -Config.PaddleSpeed;// * this.direction;
            }
            if (engine.isKeyPressed(ex.InputKey.Down)) {
                this.dy = Config.PaddleSpeed;// * this.direction;
            }

            if (this.y < 0) {
                this.y = 0;
            }

            if (this.y + this.getHeight() > engine.getHeight()) {
                this.y = engine.getHeight() - this.getHeight();
            }
        }
    }
}
