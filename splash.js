var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var Splash = function()
{
    this.image = document.createElement("img");
    this.image.src = "hero.png";//Change splash
    this.position = new Vector2();
    this.position.Set(0, 0);
}