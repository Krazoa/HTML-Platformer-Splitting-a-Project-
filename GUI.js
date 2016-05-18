var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

function DrawScore()
{
    // displaying the score on HUD
    context.fillStyle = "#ffffff";
    context.font="30px Arial";
    var scoreText = "Score: " + score;
    context.fillText(scoreText, SCREEN_WIDTH - 270, 75);
    
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
var ScoreHud = function()
{
    this.image = document.createElement("img");
    this.image.src = "HUDScore.png";
    this.position = new Vector2();
    this.position.Set(SCREEN_WIDTH - 380, 34);
}
ScoreHud.prototype.draw = function()
{
    context.save();
        context.drawImage(this.image, this.position.x, this.position.y);
    context.restore();
}
var KillCounter = function()
{
    this.image = document.createElement("img");
    this.image.src = "skull_bronze.png"; 
    this.position = new Vector2();
    this.position.Set(SCREEN_WIDTH - 340, 41);
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

var Background = function()
{
    this.image = document.createElement("img");
    this.image.src = "background.png"; 
    this.position = new Vector2();
    this.position.Set(0, 0);
}
Background.prototype.draw = function()
{
    context.save();
        context.drawImage(this.image, this.position.x, this.position.y);
    context.restore();
}

var Treeline = function()
{
    this.image = document.createElement("img");
    this.image.src = "treeline.png"; 
    this.position = new Vector2();
    this.position.Set(0, 0);
    
}
Treeline.prototype.draw = function()
{
    context.save();
        var screenX = this.position.x - worldOffsetX;
        context.drawImage(this.image, screenX, this.position.y);
    context.restore();
}


var lifeIcon = function()
{
    this.image = document.createElement("img");
    this.image.src = "life.png";
    this.iconXoffset = 0;
    this.iconYoffset = 0;
    this.iconXrepeating = 30;
    this.iconSizeX = 30;
    this.iconSizeY = 30;
}
lifeIcon.prototype.update = function(deltaTime)
{
    for(var i=0; i < lives; i++)
    {
        context.drawImage(this.image, 70 + (50 * i), 78);
        if(player.isAlive == false)
        {
           life.splice(i, 1);
        }
    }
}
lifeIcon.prototype.draw = function()
{
    
}