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
var game = new ex.Engine(1066, 540, 'game');

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
game.on('update', () => {

    if (State.LevelOneBricks <= 0 && State.CurrentLevel === 1) {
        State.CurrentLevel = 2;
        game.goToScene('nextLevel');
    }

    if ((State.LevelOneBricks + State.LevelTwoBricks) <= 0 && !gameWon) {

        gameWon = true;
        var youWin = new ex.Label("Winner!", game.getWidth() / 2, game.getHeight() / 2, "50px Consolas");
        youWin.textAlign = ex.TextAlign.Center;
        youWin.color = ex.Color.Chartreuse;
        youWin.blink(1, 1000, 500).repeatForever();
        game.addChild(youWin);
    }
});



game.start(new ex.Loader([
    Resources.Bounce,
    Resources.Explode,
    Resources.Fail]));

