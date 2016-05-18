var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var ANIM_CHUCK = 0;

var Splash = function()
{
    this.image = document.createElement("img");
    this.image.src = "SplashBase.png";//Change splash
    this.position = new Vector2();
    this.position.Set(0, 0);
}
Splash.prototype.draw = function()
{
    context.save();
        context.drawImage(this.image, this.position.x, this.position.y);
    context.restore();
}

var Chuck = function()
{
    this.position = new Vector2();
    this.position.Set(200, canvas.height/2 - 60);
    this.sprite = new Sprite("ChuckNorris.png");
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78]);
    this.sprite.setAnimationOffset(0, -25, -40);
}
Chuck.prototype.update = function(deltaTime)
{
    this.sprite.update(deltaTime);
    if(this.sprite.currentAnimation != ANIM_CHUCK)
    {
        this.sprite.setAnimation(ANIM_CHUCK);
    }
}
Chuck.prototype.draw = function()
{
    this.sprite.draw(context, this.position.x, this.position.y);
}