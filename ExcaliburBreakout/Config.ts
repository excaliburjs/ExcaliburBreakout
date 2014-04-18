
// Game Configurations
var Config = {

    GameWidth: 800,
    GameHeight: 600,
    PointInc: 200,
    ServeWaitTime: 1000, //in milliseconds
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
    BallBorrow: .20 // take 20% the momentum of the paddle
} 

var State = {
    CurrentLevel: 1,
    LevelOneBricks:0,
    LevelTwoBricks:0
}


var Resources = {
    Bounce: new ex.Sound("./Sounds/bounce.wav"),
    Explode: new ex.Sound("./Sounds/break.wav"),
    Fail: new ex.Sound("./Sounds/fail.wav")
}

Resources.Bounce.setVolume(.2);
Resources.Explode.setVolume(.2);