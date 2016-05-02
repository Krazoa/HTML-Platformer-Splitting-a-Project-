function DrawScore()
{
    //displaying the score
    context.fillStyle = "#ff0000";
    context.font="20px Arial";
    var scoreText = "Score: " + score;
    context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
}
function DrawLifeCounter()
{
    // for(var i=0; i<lives; i++)
    // {
    //     context.drawImage(heartImage, 20 + ((heartImage.width+2)*i), 10);
    // }
}