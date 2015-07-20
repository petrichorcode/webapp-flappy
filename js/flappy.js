// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

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


}

/*
 * Initialises the game. This function is only called once.
 */
function create() {game.stage.setBackgroundColor("#9999FF");
    game.add.text(20,20, "RAGE SIMULATOR", {font: "30px Comic Sans MS", fill: "#FFFFD9"});

    // set the background colour of the scene
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

}
function clickHandler(event) {
    alert("click")
}