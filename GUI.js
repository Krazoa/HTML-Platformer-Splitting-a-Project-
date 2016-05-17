var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

function DrawScore()
{
    // displaying the score on HUD
    context.fillStyle = "#ffffff";
    context.font="20px Arial";
    var scoreText = "Score: " + score;
    context.fillText(scoreText, SCREEN_WIDTH - 170, 40);
    
}
function DrawLives()
{
    //Debug text life counter
    context.fillStyle = "#ffffff";
    context.font = "18px Arial";
    context.fillText("Lives: " + lives, 40, 30);
}
function DrawHPCounter()
{
    //displaying health bar on HUD
    context.fillStyle = "#ff0000"
    context.fillRect(30, 40, player_hp, 30);
}

var HpHud = function()
{
    this.image = document.createElement("img");
    this.image.src = "HUD.png";
    this.position = new Vector2();
    this.position.Set(7, 34);
}
HpHud.prototype.draw = function()
{
    context.save();
        context.drawImage(this.image, this.position.x, this.position.y);
    context.restore();
}
function DrawKills()
{
    context.fillStyle = "#ffffff";
    context.font = "18px Arial";
    context.fillText("X" + kills, SCREEN_WIDTH - 190, 30);
}
var KillCounter = function()
{
    this.image = document.createElement("img");
    this.image.src = "skull_bronze.png"; 
    this.position = new Vector2();
    this.position.Set(SCREEN_WIDTH - 290, 10);
    DrawKills();
}
KillCounter.prototype.update = function(deltaTime)
{
    // if(kills => 3)
    // {
    //    this.image.src = "skull_silver.png"; 
    // //    console.log("Skull set to silver");
    // }
    if(kills => 5)
    {
       this.image.src = "skull_gold.png"; 
    //    console.log("Skull set to gold");
    }
}
//displaying the number of kills on the HUD
KillCounter.prototype.draw = function()
{
    context.save();
        context.drawImage(this.image, this.position.x, this.position.y);
    context.restore();
}