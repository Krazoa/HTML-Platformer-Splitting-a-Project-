var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

//creating a new function to return the player
var Player = function()
{
    this.image = document.createElement("img");
    this.x = canvas.width/2;
    this.y = canvas.height/2;
    
    
    
    this.position = new Vector2(this.x, this.y);
    this.position.set = (9*TILE, 9*TILE);
    
    this.width = 159;
    this.height = 163;
    
    // this.angularVelocity = 0;
    // this.rotation = 0;
    this.offset = new Vector2();
    this.offset.set = (-55,-87);
    
    this.velocity = new Vector2();
    
    this.falling = true;
    this.jumping = false;
    
    this.image.src = "hero.png";
};

Player.prototype.update = function(deltaTime)
{
    
    var left = false;
    var right = false;
    var jump = false;
    
    //check keypresses
    if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
    {
        left = true;
    }
    if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
    {
        right = true;
    }
    if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
    {
        jump = true;
    }
    
    var wasleft = this.velocity.x < 0;
    var wasright = this.velocity.x > 0;
    var falling = this.falling
    var ddx = 0;    //player's accelerations
    var ddy = GRAVITY;
    
    if(left)
        ddx = ddx - ACCEL;      //player velocity increases as they go towards the left according to the player acceleration value
    else if (wasleft)
        ddx = ddx + FRICTION;   //player velocity decreases as they stop moving towards the left according to the friction value
    
    if(right)
        ddx = ddx + ACCEL;      //player velocity increases as they go towards the right according to the player acceleration value
    else if (wasright)
        ddx = ddx - FRICTION;   //player velocity decreases as they stop moving towards the right according to the friction value
    
    if(jump && !this.jumping && !falling)
    {
        ddy = ddy - JUMP; //set jump velocity
        this.jumping = true;
    }
    
    //find players new position and velocity
    this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
    this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.y));
    this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
    this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
    
    if((wasleft && (this.velocity.x>0)) || (wasright && (this.velocity.x<0)))
    {
        //if both the previous movment (wasleft or wasright) is active and x velocity is greater or less then (according to their respective directions) 0, set it to 0
        this.velocity.x = 0;
    }
    
    //calculate position and velocity
    this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
    this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));

    var tx = pixelToTile(this.position.x);
    var ty = pixleToTile(this.position.y);
    var nx = (this.position.x)%TILE;
    var ny = (this.position.y)%TILE;
    var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
    var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
    var celldown = cellAtTileCoord(LAYER_PLATFORMS, tX, tY + 1);
    var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

    if(this.velocity.y > 0)
    {
        if ((celldown && !cell) || (celldiag && !cellright && nx))
        {
            //set y pos to 0
            this.position.y = tileToPixle(ty);
            this.velocity.y = 0;    //set the player y position to 0
            this.falling = false;   //set the player falling status to 'not falling'
            this.jumping = false;   //set the player jump status to 'not jumping'
            ny = 0;                 //stop overlapping with cells below the player
        }
        else if (this.velocity.y <0)
        {
           if ((cell && !celldown) || (cellright && !celldiag && nx))
           {
               //set y position to 0 so the player does not pop through the platform above if they jump under it
               this.position.y = tileToPixle(ty + 1);
               this.velocity.y = 0; //set vertical velocity to 0
               cell = celldown;
               cellright = celldiag;
               ny = 0;
           } 
        }
        if(this.velocity > 0)
        {
            if((cellright && !cell) || (celldiag && !celldown && ny))
            {
                this.position.x = tileToPixle(tx);
                this.velocity.x = 0;    //set horizontal velocity to 0
            }
        }
        else if (this.velocity.x < 0)
        {
            if ((cell && !cellright) || (celldown && !celldiag && ny))
            {
                this.position.x = tileToPixle(tx + 1);
                this.velocity.x = 0;    //set horizontal velocity to 0
            }
        }
    }

}

Player.prototype.draw = function()
{
    context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.drawImage(this.image, -this.width/2, -this.height/2);
    context.restore();
}