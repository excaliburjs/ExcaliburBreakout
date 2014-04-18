
class Brick extends ex.Actor {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);

        this.collisionType = ex.CollisionType.Fixed;
        this.on('exitviewport', () => {
            this.kill();
        });
    }

}