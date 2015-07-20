// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var score;
// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("backgroundImg", "../assets/flappydoge.jpg");
    game.load.audio("score", "../assets/point.ogg");
}

function spaceHandler() {
    game.sound.play("score");
    console.log("played");
}

function create() {game.stage.setBackgroundColor("#9999FF");
    game.add.text(20,20, "RAGE SIMULATOR", {font: "30px Comic Sans MS", fill: "#FFFFD9"});
    game.input
        .onDown
        .add(clickHandler);
    // set the background colour of the scene
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    alert(score)
}

/*
 * Initialises the game. This function is only called once.
 */
function clickHandler(event){
    alert("click!");
    game.add.sprite(500, 100, "playerImg");
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

}



