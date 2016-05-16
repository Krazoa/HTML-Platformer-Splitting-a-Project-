var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var Enemy = function(x, y)
{
    this.sprite = new Sprite("bat.png");
    this.sprite.buildAnimation(2, 1, 88, 94, 0.3, [0,1]);
    this.sprite.setAnimationOffset(0, -25, -40);
    
    this.position = new Vector2();
    this.position.Set(x, y);
    
    this.velocity = new Vector2();
    
    this.moveRight = true;
    this.pause = 0;
}

Enemy.prototype.update = function(dt)
{
    this.sprite.update(dt);
    if(this.pause > 0)
    {
        this.pause -= dt;
    }
    else
    {
        var ddx = 0;    //enemy acceleration
        
        //collision code (same as the player collision)
        var tx = pixleToTile(this.position.x);
        var ty = pixleToTile(this.position.y);
        var nx = (this.position.x)%TILE;
        var ny = (this.position.y)%TILE;
        var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
        var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
        var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
        var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
        
        if(this.moveRight)
        {
            if(celldiag&& !cellright)
            {
                ddx = ddx + ENEMY_ACCEL;
            }
            else
            {
                this.velocity.x = 0;
                this.moveRight = false;
                this.pause = 0.5;
            }
        }
        if(!this.moveRight)   
        {
            if(celldown && !cell)
            {
                ddx = ddx - ENEMY_ACCEL;
            }
            else
            {
                this.velocity.x = 0;
                this.moveRight = false;
                this.pause = 0.5;    
            }
        } 
        this.position.x = Math.floor(this.position.x + (dt * this.velocity.x));
        this.velocity.x = bound(this.velocity.x + (dt * ddx), -ENEMY_MAXDX, ENEMY_MAXDX);
    }
}