/**
 * Created by v3494 on 21/07/2015.
 */
// the functions associated with preload, create and update.
var actions = {preload: preload, create: create, update: update};
// the Game object used by the phaser.io library
// declares properties of the game as constants (global variables) for easier modification (i.e increasing difficulty,
// rescaling etc)
var width = 790;
var height = 400;
var game = new Phaser.Game(width, height, Phaser.AUTO, "gameBox", actions);
// Global score variable initialised to 0.
var score = 0;
// Global variable to hold the text displaying the score.
var labelScore;
// Global player variable declared but not initialised.
var player;
// Global pipes variable initialised to the empty array.
var pipes = [];
// the interval (in seconds) at which new pipe columns are spawned
var gameSpeed = 200;
var gameGravity = 1000;
var jumpPower = 200;
var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
var pipeInterval = 1.75;
var pipeEndHeight = 25;
var pipeEndExtraWidth = 10;
var splashDisplay = [];
var invs = [];

//Global variables (arrays) to store bonuses
var balloons = [];
var weights = [];


/* On submitting name to form, modifies webpage with "Thank you, want to try again fullName" greeting and removal
// of form element */
$("#greeting-form").on("submit", function (event_details) {
    var greeting = "Thank you - want to play again ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + " " + name + "?";
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    //event_details.preventDefault();
});
// Loads all resources for the game and gives them names.

function preload() {
    game.load.image("backgroundImg", "../assets/backgroundnyancat.png");
    game.load.audio("score", "../assets/dogbarksound.mp3");
    game.load.image("playerImg", "../assets/dogesprite1.png");
    game.load.image("pipe", "../assets/pipenyan.png");
    game.load.image("balloons", "../assets/balloons.png");
    game.load.image("weight", "../assets/weight.png");
    game.load.image("pipeEnd", "../assets/toppipenyan.png");
    game.load.image("gravity flip", "../assets/invertsprite.jpg");
}

// Initialises the game. This function is only called once.

function create() {
    // set background colour
    game.stage.setBackgroundColor("#9999FF");
    // add background image
    game.add.sprite(0, 0, "backgroundImg");

    game.add.text(70, 20,  "RAGE SIMULATOR", {font: "30px Comic Sans MS", fill: "#FFFFD9",
        stroke: "#000000", strokeThickness: 3});
    // add score text
    labelScore = game.add.text(70, 65, "0",
        {font: "30px Arial", fill: "#FFFFFF", stroke: "#000000", strokeThickness: 3 });
    // initialise the player and associate it with playerImg
    player = game.add.sprite(80, 200, "playerImg");
    player.anchor.setTo(0.5, 0.5);
    // enable physics for the player sprite
    game.physics.arcade.enable(player);

    splashDisplay = game.add.text(70,100, "Press ENTER to start, SPACEBAR to jump",
        {font: "30px Comic Sans MS", fill: "#FFFFFF", align: "left",
            stroke: "#000000", strokeThickness: 3});

    // Start the ARCADE physics engine.
    // ARCADE is the most basic physics engine in Phaser.
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
}

function addGravityFlip (){
    var gravityFlipSprite = game.add.sprite(790, game.rnd.integerInRange(0, 350), "gravity flip");
    invs.push(gravityFlipSprite);
    game.physics.arcade.enable(gravityFlipSprite);
    gravityFlipSprite.body.velocity.x = game.rnd.integerInRange(-50, -500);
}

function start (){    // set the background colour of the scene
    splashDisplay.destroy();

    // anchors gravity of player at its centre
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // set the player's gravity
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
    // time loop for game to update
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate);
    invertPowerUpInterval = 3

    game.time.events.loop(invertPowerUpInterval * Phaser.Timer.SECOND, addGravityFlip);

    player.body.gravity.y = gameGravity;
    // associate spacebar with jump function

    //Random Scaling:

    //  Pick a random number between -2 and 6
    //var rand = game.rnd.realInRange(-2, 6);

    //  Set the scale of the sprite to the random value
    ////sprite.scale.setTo(-1, -1);
    //var ax = -30
    //var by = -30
    //sprite.scale.setTo(ax ,by)
    ////game.sprite.scale.x = -100
    ////game.sprite.scale.y = -100
    //
    ////  You can also scale sprites like this:
    ////  sprite.scale.x = value;
    ////  sprite.scale.y = value;
}

// This function updates the scene. It is called for every new frame.}

function update() {
    // Call gameOver function when player overlaps with any pipe or moves outside vertical screen boundary

    game.physics.arcade
        .overlap(player,
        pipes,
        gameOver);
    if(player.body.y < 0 || player.body.y > 400){
        gameOver();
    }
    game.physics.arcade
        .overlap(player,
        invs,
    invsPowerUp);

    function invsPowerUp (){
        gameGravity = gameGravity * -1;
        player.body.gravity.y = gameGravity
        jumpPower = jumpPower * -1;
    }
    // rotates sprite according to velocity angle (arctangent)
    player.rotation += gameSpeed;
    player.rotation = Math.atan(player.body.velocity.y / -300);

    checkBonus(balloons, -50);
    checkBonus(weights, +50);

    //Factorise the two bonus functions into a single "checkBonus" function

    //Keeps track of bonuses by stepping backwards through the weights array
    //for(var i=weights.length - 1; i >= 0; i--){
    //    //Note use of operator "--" to count backwards through the array
    //    game.physics.arcade.overlap(player,weights[i], function(){
    //
    //        changeGravity(+50);
    //        weights[i].destroy();
    //        weights.splice(i,1);
    //    });
    //
    ////Keeps track of bonuses by stepping backwards through the balloons array
    //for(var i=balloons.length - 1; i >= 0; i--){
    //    //Note use of operator "--" to count backwards through the array
    //    game.physics.arcade.overlap(player,balloons[i], function(){
    //
    //        changeGravity(-50);
    //        balloons[i].destroy();
    //        balloons.splice(i,1);
    //    });
    //
    //}
}



function checkBonus(bonusArray, bonusEffect){
    // Delete entries backwards from array
        for(var i=bonusArray.length - 1; i>=0; i--) {
            game.physics.arcade.overlap(player, bonusArray[i], function () {
                changeGravity(bonusEffect)
               // apply effect
                bonusArray[i].destroy();
                // destroy sprite
                bonusArray[i].splice(i, 1);
            });
        }
}

//function checkBonus(bonusArray, bonusEffect) {
//    // Step backwards in the array to avoid index errors from splice
//    for (var i = bonusArray.length - 1; i >= 0; i--) {
//        game.physics.arcade.overlap(player, bonusArray[i], function () {
//            // destroy sprite
//            bonusArray[i].destroy();
//            // remove element from array
//            bonusArray.splice(i, 1);
//            // apply the bonus effect
//            changeGravity(bonusEffect);
//        });
//    }
//}

// Adds a pipe part to the pipes array

function addPipeBlock(x, y) {
    // make a new pipe block
    var block = game.add.sprite(x, y, "pipe");
    // insert it in the pipe array
    pipes.push(block);
    // enable physics engine for the block
    game.physics.arcade.enable(block);
    // set the block's horizontal velocity to a negative value
    // (negative x value for velocity means movement will be towards left)
    block.body.velocity.x = -gameSpeed;
}
function addPipeEnd(x, y) {
    var block = game.add.sprite(x, y, "pipeEnd");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -gameSpeed;
}

function generate() {
    var diceRoll = game.rnd.integerInRange (1,10)
    // uses comparison operator "==" to check if two integer values are equal in an if-then-else construction
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    }
        else {
        generatePipe();
    }
}

function generatePipe() {
//    // Generate  random integer between 1 and 5. This is the location of the
//    // start point of the gap.
//    var gapStart = game.rnd.integerInRange(1, 5);
//    // Loop 8 times (8 is the height of the canvas).
//    for (var count = 0; count < 8; count++) {
//        // If the value of count is not equal to the gap start point
//        // or end point, add the pipe image.
//        if(count != gapStart && count != gapStart+1){
//            addPipeBlock(750, count * 50);
//        }
//    }
//    // Increment the score each time a new pipe is generated.
//    changeScore();
//}

/// Modify generatePipe to take the constants (global variables) gapMargin, gapStart and gapSize as arguments
/// rather than integer arguments

    //Use gapMargin to assign minimum height for gap to start at
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    //call addPipeEnd function
    addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + 25 - pipeEndHeight);
//);
//    //Use for loop to generate pipe blocks until reaches end of canvas
    for (var bottomOfBlock = gapStart; bottomOfBlock > 0; bottomOfBlock -= blockHeight) {
        // Start loop upwards from gapStart until top of canvas (y=0)
        // bottomOfBlock is the coordinate of the bottom of the block, subtract blockHeight to get the top
        addPipeBlock(width, bottomOfBlock - blockHeight);
    }
    // Second for loop from lower end of Gap to the bottom on canvas (y=height)
    for (var bottomOfBlock = gapStart + gapSize; bottomOfBlock < height; bottomOfBlock += blockHeight) {
        addPipeBlock(width, bottomOfBlock)
    }
    changeScore()

};

function generateBalloons() {
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
}
function generateWeight() {
    var bonus = game.add.sprite(width, 0, "weight");
    weights.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -gameSpeed;
    bonus.body.velocity.y = game.rnd.integerInRange(60, 100);
}

//changes Gravity and updates player's gravity
function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}


function playerJump() {
    // the more negative the value the higher it jumps
    player.body.velocity.y = -jumpPower;
    //
    //player.sprite.x
//    var rand = game.rnd.realInRange(1,3);
//    //player.scale.setTo(-3);
//
//    if(rand==-1){
//        generateBalloons();
//    } else if(rand==2){
//        generateWeight();
//}
////
}


// Function to change the score
function changeScore() {
    //increments global score variable by 1
    score++;
    // updates the score label
    labelScore.setText(score.toString());
}

function gameOver() {
    // stop the game (update() function no longer called)
    game.destroy();
    $("#greeting").show();
    $("#score").val(score.toString());
}


$.get("/score", function (scores) {
    console.log("Data: ", scores);
    /* sort method orders the array. However since the array is an object, we use the difference command
     * to define the sort by score*/
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    /* takes in array object ordered by score and appends to leaderboard on webpage*/
    for (var i = 0; i < 3; i++) {
        $("#scoreBoard").append(
            "<li class='score"+ i + "'>" +
                   scores[i].name + ": " + scores[i].score +
                      "</li>");
    }

    gameGravity = 200;
});



