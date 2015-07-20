// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var score = 0;
var labelScore;
var player;
var pipes = [];


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
    game.load.audio("score", "../assets/dogbarksound.mp3");
    game.load.image("playerImg", "../assets/flappy_frog.png");
    game.load.image("pipe","../assets/pipe_yellow.png");

}


function spaceHandler() {
    game.sound.play("score"); 
    console.log("played");
}

function create() {
    game.stage.setBackgroundColor("#9999FF");
    game.add.text(20, 20, "RAGE SIMULATOR", {font: "30px Comic Sans MS", fill: "#FFFFD9"});

    // set the background colour of the scene
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    //alert(score);
    labelScore = game.add.text(20, 20, "0");



    game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(100, 200, "playerImg")
    game.physics.arcade.enable(player);
    player.body.velocity.x = 100;
    player.body.velocity.y = 10;
    player.body.gravity.y = 800;





    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(moveDown)
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    /*for(var count=0; count<8; count+=1) {
     game.add.sprite(20, 50 * count, "pipe");
     game.add.sprite(150, 50 * count, "pipe");
     }*/

    /* for (var count=2; count<10; count+=2) {
     game.add.sprite(count * 50, 200, "pipe");*/


    var newx = 0;
    for(var x = 0; x < 10; x++){
        if (newx < 300) {
        var gap = game.rnd.integerInRange(50, 150);
        var spacing = x * (gap + 50);
        generatePipes(spacing);
        //generatePipes(x * (gap + 50));
        // get x = rightmost coordinate (letfmost coordinate +50)
        newx = newx + spacing;
            game.add.text(newx, 100, "Arial 30px")
        }


    }


    //generatePipes(200);




}

function playerJump() {
    player.body.velocity.y = -200;  1
}



/*
 * Initialises the game. This function is only called once.
 */

function generatePipes(x) {
    // calculate a random position for the gap
    var gap = game.rnd.integerInRange(1 ,5);

    // generate the pipes, except where the gap should be
    for (var count=0; count<8; count++) {
        if (count != gap && count != gap+1) {
            addPipeBlock(x, count*50);
        }
    }
    //calculate another random position for the gap
    //gap = game.rnd.integerInRange(1 ,5);
    //for (var count=0; count<8; count++) {
    //    if (count != gap && count != gap+1) {
    //        addPipeBlock(50, count*50);
    //
    //    }
    //}
    //for (var count=0; count<8; count++) {
    //    if (count != gap && count != gap+1) {
    //        addPipeBlock(200, count*50);
    //
    //    }
    //}

}




function addPipeBlock(x, y) {
    // create a new pipe block
    var block = game.add.sprite(x,y,"pipe");
    // insert it in the 'pipes' array
    pipes.push(block);
}
function clickHandler(event){
    alert("click!");
    game.add.sprite(500, 100, "playerImg");
}

function moveRight() {
    player.x++;

}

function moveLeft() {
    player.x = player.x - 1
}

function moveUp() {
    player.y = player.y - 1
}

function moveDown() {
    player.y = player.y + 1
}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

}
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}


