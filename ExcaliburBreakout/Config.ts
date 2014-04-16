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
    BallBorrow: .20 // take 20% the momentum of the paddle
} 