var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

function DrawScore()
{
    // displaying the score on HUD
    context.fillStyle = "#ffffff";
    context.font="20px Arial";
    var scoreText = "Score: " + score;
    context.fillText(scoreText, SCREEN_WIDTH - 170, 100);
    
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

var KillCounter = function()
{
    this.x = screen_width/2;
    this.y = screen_height/2;
    this.height = 48;
    this.width = 48;
    this.image.src = "skull_gold";
}
//displaying the number of kills on the HUD
KillCounter.prototype.draw = function()
{
    context.save();
        // context.translate(this.position.x, this.position.y);
        context.drawImage(this.image, this.x, this.y);
    context.restore();
}