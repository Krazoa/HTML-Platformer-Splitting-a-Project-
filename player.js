var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var LEFT = 0;
var RIGHT = 1;
var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
// var ANIM_CLIMB = 6;
// var ANIM_SHOOT_LEFT = 7;
// var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 6;

//creating a new function to return the player
var Player = function()
{
    this.sprite = new Sprite("ChuckNorris.png");
    
    //animations which will be called depending on the player event
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [8, 9, 10, 11, 12]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [52, 53, 54, 55, 56, 57, 58, 59]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [60, 61, 62, 63, 64]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 78]);
    for(var i=0; i<ANIM_MAX; i++)
    {
        this.sprite.setAnimationOffset(i, -55, -89);
    }
    
    // this.x = canvas.width/2;
    // this.y = canvas.height/2;
    this.position = new Vector2(canvas.width/2, canvas.height/2);
    // this.position.Set(9*TILE, 0*TILE);
    this.position.Set(80, 350); //Changed so Chuck does not fall straight into the pit
    // this.position.x = 9*TILE
    // this.position.y = 0*TILE
    
    this.width = 159;
    this.height = 163;
    
    // this.angularVelocity = 0;
    // this.rotation = 0;
    // this.offset = new Vector2();
    // this.offset.Set(-55,-87);
    
    this.velocity = new Vector2();
    this.velocity.x = 0;
    this.velocity.y = 0;
    
    this.falling = true;
    this.jumping = false;
    
    this.direction = RIGHT;
    
    this.cooldownTimer = 0;
    
    // this.image.src = "hero.png";
};

Player.prototype.update = function(deltaTime)
{
    this.sprite.update(deltaTime);
    
    var left = false;
    var right = false;
    var jump = false;
    
    //check keypresses
    if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
    {
        // console.log("Left had been triggered!")
        left = true;
        this.direction = LEFT;
        if(this.sprite.currentAnimation != ANIM_WALK_LEFT && this.jumping == false)
        {
            this.sprite.setAnimation(ANIM_WALK_LEFT);
        }
    }
    else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
    {
        // console.log("Right had been triggered!")
        right = true;
        this.direction = RIGHT;
        if(this.sprite.currentAnimation != ANIM_WALK_RIGHT && this.jumping == false)
        {
            this.sprite.setAnimation(ANIM_WALK_RIGHT);
        }
    }
    else
    {
        if(this.jumping == false && this.falling == false)
        {
            if(this.direction == LEFT)
            {
                if(this.sprite.currentAnimation != ANIM_IDLE_LEFT && this.jumping == false)
                {
                    this.sprite.setAnimation(ANIM_IDLE_LEFT);
                }
            }
            else
            {
                if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT && this.jumping == false)
                {
                    this.sprite.setAnimation(ANIM_IDLE_RIGHT);
                }
            }
        }    
    }
    
    if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true && this.falling == false)
    {
        // console.log("Jump had been triggered!")
        jump = true;
        if(left == true)
        {
            this.sprite.setAnimation(ANIM_JUMP_LEFT);
        }
        if (right == true)
        {
            this.sprite.setAnimation(ANIM_JUMP_RIGHT);
        }
    }
    
    var wasleft = this.velocity.x < 0;
    var wasright = this.velocity.x > 0;
    var falling = this.falling;
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
        
        if(this.direction == LEFT)
        {
            this.sprite.setAnimation(ANIM_JUMP_LEFT);
        }
        else
        {
            this.sprite.setAnimation(ANIM_JUMP_RIGHT);
        }
    }
    if(this.cooldownTimer>0)
    {
        this.cooldownTimer -= deltaTime;
    }
    if(keyboard.isKeyDown(keyboard.KEY_SHIFT) == true && this.cooldownTimer <= 0)
    {
        sfxFire.play();
        this.cooldownTimer = 0.3;
        // console.log("bullet fired");
        bullets.push(new Bullet(this.position.x, this.position.y));
    }
    
    //find players new position and velocity
    this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
    this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
    this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
    this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
    
    if((wasleft && (this.velocity.x>0)) || (wasright && (this.velocity.x<0)))
    {
        //if both the previous movment (wasleft or wasright) is active and x velocity is greater or less then (according to their respective directions) 0, set it to 0
        this.velocity.x = 0;
    }
    //collision detection
    //calculate position and velocity
    // this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
    // this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));

    var tx = pixleToTile(this.position.x);
    var ty = pixleToTile(this.position.y);
    // console.log(tx);
    var nx = (this.position.x)%TILE;
    var ny = (this.position.y)%TILE;
    
    // console.log("Cells have been initilized")
    var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
    var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
    var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
    var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
    

    if(this.velocity.y > 0)
    {
        if((celldown && !cell) || (celldiag && !cellright && nx))
        {
            //set y pos to 0 (Colliding with a platform)
            this.position.y = tileToPixle(ty);
            this.velocity.y = 0;    //set the player y position to 0
            this.falling = false;   //set the player falling status to 'not falling'
            this.jumping = false;   //set the player jump status to 'not jumping'
            ny = 0;                 //stop overlapping with cells below the player
        }
    }
    else if(this.velocity.y < 0)
    {
        if((cell && !celldown) || (cellright && !celldiag && nx))
        {
               //set y position to 0 so the player does not pop through the platform above if they jump under it
               this.position.y = tileToPixle(ty + 1);
               this.velocity.y = 0; //set vertical velocity to 0
               cell = celldown;
               cellright = celldiag;
               ny = 0;
        } 
    }
    if(this.velocity.x > 0) 
    {
        if((cellright && !cell) || (celldiag && !celldown && ny)) 
        {
            this.position.x = tileToPixle(tx);
            this.velocity.x = 0;    //set horizontal velocity to 0
        }
    }
    else if(this.velocity.x < 0) 
    {
        if((cell && !cellright) || (celldown && !celldiag && ny)) 
        {
            this.position.x = tileToPixle(tx + 1);
            this.velocity.x = 0;    //set horizontal velocity to 0
        }
    }

}

Player.prototype.draw = function()
{
    // context.save();
    //     context.translate(this.position.x, this.position.y);
    //     context.rotate(this.rotation);
    //     context.drawImage(this.image, -this.width/2, -this.height/2);
    // context.restore();
    
    this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}