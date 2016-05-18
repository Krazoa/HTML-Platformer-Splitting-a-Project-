var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";

var player = new Player();
var splash = new Splash();
var Chuck = new Chuck();
var HpHud = new HpHud();
var ScoreHud = new ScoreHud();
var KillCounter = new KillCounter();
var Background = new Background();
var Treeline = new Treeline();
var lifeIcon = new lifeIcon();
var keyboard = new Keyboard();

var tileset = document.createElement("img");
tileset.src = "tileset.png";


function bound(value, min, max)
{
    if(value < min)
        return min;
    if(value > max)
        return max;
    return value;
};

function cellAtPixelCoord(layer, x,y)
{
    if(x<0 || x>SCREEN_WIDTH || y<0)
        return 1;
        //let the player drop
    else if(y>SCREEN_HEIGHT)
        return 0;
    return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
    if(tx<0 || tx>=MAP.tw || ty<0)
        return 1;
        //let the player drop
    else if(ty>=MAP.th)
        return 0;
    return cells[layer][ty][tx];
};

function tileToPixle(tile)
{
    return tile * TILE;
};

function pixleToTile(pixle)
{
    return Math.floor(pixle/TILE);
};

//GameStates
function runGamesplash(deltaTime)
{
    Splash_timer -=deltaTime
    
    splash.draw();
    Chuck.update(deltaTime);
    Chuck.draw();
    
    //Setting name
    context.fillStyle = "#ffffff";
    context.font= "12px Arial";
    context.fillText("AIE Project by Michele A.", 2, SCREEN_HEIGHT - 2)
    
    context.fillStyle = "#ffffff";
    context.font = "60px Agency FB";
    context.fillText("Chuck Productions", SCREEN_WIDTH/2 - 190, SCREEN_HEIGHT/2)
    
    if(Splash_timer <= 0)
    {
        Gamestate = Gamestate_reset;
    }
}
function runGameplay(deltaTime)
{
    Background.draw();
    Treeline.draw();
    player.update(deltaTime);
    KillCounter.update(deltaTime);
    // DrawLives();
    drawMap();
    player.draw();
    HpHud.draw();
    ScoreHud.draw();
    DrawScore();
    DrawHPCounter();
    KillCounter.draw();
    lifeIcon.update(deltaTime);
    lifeIcon.draw();
    RunBulletChecks(deltaTime);
    
    
    //Debug Keys
    if(keyboard.isKeyDown(keyboard.KEY_A) == true)
    {
        Cheat = true;
        score += 100;
        if(Cheat == true)
        {
            context.fillStyle = "#ffffff";
            context.font = "10px Arial";
            context.fillText("CHEATER!!!", SCREEN_WIDTH - 170, 130)
        }
        
    }
    else
    {
        Cheat = 0;    
    }
    if(keyboard.isKeyDown(keyboard.KEY_S) == true)
    {
        player_hp -= 1;
    }
    
    damageCooldown -=deltaTime;
    
    // //Add enemies
    for(var i=0; i<enemies.length; i++)
    {
        enemies[i].update(deltaTime);
        if(player.isAlive == true)
        {
           if(intersects(player.position.x, player.position.y, TILE, TILE, enemies[i].position.x, enemies[i].position.y, TILE, TILE) == true) 
           {
               if(damageCooldown <= 2)
               {
                    player_hp -=40
                    damageCooldown = 2
               }
           }
        }
        enemies[i].draw();
    }
    
    if(player.position.y > SCREEN_HEIGHT + 100)
    {
        player_hp = 0;
    }
    
    if(player_hp <= 0)
    {
        sfxPlayerDie.play();
        if(lives == 1)
        {
            // console.log("Player died")
            Gamestate = Gamestate_over;
        }
        else
        {
            Gamestate = Gamestate_death;
        }
    }
    
    // switch(Playerstate)
    // {
    //     case Playerstate_RunJump:
    //         player.updateRunJumpState();
    //         break;
    //     case Playerstate_Climb:
    //         player.updateClimbState();
    //         break;
    // }
    
}


function runGamevalreset(deltaTime)
{
    //Reset all values
    score = 0;
    reset_timer = 3;
    Cheat = false;
    win = false;
    player_hp = 200;
    lives = 3;
    score = 0;
    Gamestate = Gamestate_reset;
    player.position.Set(80, 350);
    bullets.splice(0, bullets.length);
    enemies.splice(0, enemies.length);
    player.isAlive = true;
    addEnemies();
}
function runGamedeath(deltaTime)
{
    // console.log(lives)
    Background.draw();
    Treeline.draw();
    drawMap();
    context.fillStyle = "#ff0000";
    context.font = "80px Arial";
    context.fillText("YOU DIED", 100, SCREEN_HEIGHT/2)
    
    context.fillStyle = "#ff0000";
    context.font = "24px Arial";
    context.fillText("Press 'R' to respawn", 100, 500)
    bullets.splice(0, bullets.length);
    enemies.splice(0, enemies.length);
    addEnemies();
    player.isAlive = true;
    score = 0;
    if(keyboard.isKeyDown(keyboard.KEY_R) == true)
    {
        lives -= 1;
        player_hp = 200;
        player.position.Set(80, 350);
        Gamestate = Gamestate_play;
    }
    
}
// function runGameReIntial(deltaTime)
// {
//     initialize();
//     Gamestate = Gamestate_resetvalues;
// }

function runGameWin(deltaTime)
{
    Background.draw();
    Treeline.draw();
    Enterstate = false;
    context.fillStyle = "#ffffff";
    context.font = "26px Arial";
    context.fillText("You Win?", 100, SCREEN_HEIGHT/2 - 50)
    
    context.fillStyle = "#ffffff";
    context.font = "25px Arial";
    context.fillText("Suddenly, Chuck Norris got bored and decided to go home. How anti-climatic.", 100, SCREEN_HEIGHT/2)

    context.fillStyle = "#ffffff";
    context.font = "24px Arial";
    context.fillText("Press R to go back to restart.", 100, SCREEN_HEIGHT/2 + 50)
    if(keyboard.isKeyDown(keyboard.KEY_R) == true)
    {
        Gamestate = Gamestate_resetvalues;
    }
}

function runGameover(deltaTime)
{
    Background.draw();
    Treeline.draw();
    Enterstate = false;
    context.fillStyle = "#ffffff";
    context.font = "25px Arial";
    context.fillText("Chuck Norris is dead...just kidding, Chuck Norris never dies.", 100, SCREEN_HEIGHT/2)
    player.isAlive = false;

    context.fillStyle = "#ffffff";
    context.font = "24px Arial";
    context.fillText("Press R to restart.", 100, SCREEN_HEIGHT/2 + 50)
    if(keyboard.isKeyDown(keyboard.KEY_R) == true)
    {
        Gamestate = Gamestate_resetvalues;
    }
}
function runGamereset(deltaTime)
{
    Background.draw();
    Treeline.draw();
    context.fillStyle = "#ffffff";
    context.font = "18px Arial";
    context.fillText("In the year 30XX, Chuck Norris decides to go on another pointless rampage...", 100, 200)
    
    context.fillStyle = "#ffffff";
    context.font = "14px Arial";
    context.fillText("Movement Controls: Left and Right Arrow Keys", 100, 350)
    
    context.fillStyle = "#ffffff";
    context.font = "14px Arial";
    context.fillText("Climbing Controls: Up and Down Arrow Keys", 100, 400)
    
    context.fillStyle = "#ffffff";
    context.font = "14px Arial";
    context.fillText("Shooting Controls: Shift Key", 100, 450)
    
    context.fillStyle = "#ffffff";
    context.font = "14px Arial";
    context.fillText("Jumping Controls: Spacebar", 100, 500)
    
    context.fillStyle = "#ffffff";
    context.font = "25px Arial";
    context.fillText("Press ENTER to begin", 100, 230)
    if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true)
    {
        Enterstate = true;
    }
    if(Enterstate == true)
    {
        //this is a long and unresonably complex way of doing a single int counter
        //as rounding to 1 will fix the counter at the single intiger and cause it to freeze
        var RoundReset_timer = 3;
        
        reset_timer -= deltaTime
        // console.log(reset_timer)
        
        if(reset_timer < 3 && reset_timer > 2)
        {
            RoundReset_timer = 3;
        }
        if(reset_timer < 2 && reset_timer > 1)
        {
            RoundReset_timer = 2;
        }
        if(reset_timer < 1 && reset_timer > 0)
        {
            RoundReset_timer = 1;
        }
        if(reset_timer <= 0)
        {
            RoundReset_timer = 0;
        }
        
        context.fillStyle = "#ffffff";
        context.font = "24px Arial";
        context.fillText("Prepare for battle in " + RoundReset_timer + " seconds!!!", 100, 300)
    }
    if(RoundReset_timer <= 0)
    {
        Gamestate = Gamestate_play;
        Enterstate = 0;
    }
}

function drawMap()
{
    var startX = -1;
    var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2; //max no. of tiles before scrolling occurs
    var tileX = pixleToTile(player.position.x); //convert player position on which tile and converts into tile
    var offsetX = TILE + Math.floor(player.position.x%TILE); //find offset of the player from the tile they stand on
    
    //move the map when the player moves too far to the lefr or right.
    startX = tileX - Math.floor(maxTiles / 2);
    if(startX < -1)
    {
        startX = 0;
        offsetX = 0;
    }
    if(startX > MAP.tw - maxTiles)
    {
        startX = MAP.tw - maxTiles + 1;
        offsetX = TILE;
    }
    
    worldOffsetX = startX * TILE + offsetX;
    
    for(var layeridx=0; layeridx<LAYER_COUNT; layeridx++)
    {
        // var Idx = 0;
        //for each y layer, if y is less than total y layers then plus 1 to y
        for(var y = 0; y<level1.layers[layeridx].height; y++)
        {
            var Idx = y * level1.layers[layeridx].width + startX;
            //for each x layer, if y is less than total x layers then plus 1 to x
            for(var x = startX; x < startX + maxTiles; x++)
            {
                //do check
                if(level1.layers[layeridx].data[Idx] !=0 )
                {
                    //1 = tile, 0 = no tile
                    var tileIndex = level1.layers[layeridx].data[Idx] - 1;
                    var sx = TILESET_PADDING + (tileIndex%TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
                    var sy = TILESET_PADDING + (Math.floor(tileIndex/TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
                    context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, (x - startX)*TILE - offsetX, (y - 1)*TILE, TILESET_TILE, TILESET_TILE);
                }
                Idx++;
            }
        }
    }
}

function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
	if (y2 + h2 < y1 ||x2 + w2 < x1 || x2 > x1 + w1 || y2 > y1 + h1)
	{
		return false;
	}
	return true;
}

function RunBulletChecks(deltaTime)
{
    var hit = false;
    for(var i=0; i<bullets.length; i++)
    {
        bullets[i].update(deltaTime);
        if(bullets[i].position.x - worldOffsetX < 0 || bullets[i].position.s - worldOffsetX > SCREEN_WIDTH)
        {
            hit = true;
        }
        
        //else hit = false (In case hit is somehow stuck on true after being triggered)
        
        for(var j=0; j<enemies.length; j++)
        {
            if(intersects(bullets[i].position.x, bullets[i].position.y, TILE, TILE, enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
            {
                //remove the enemy
                enemies.splice(j, 1);
                hit = true;
                //add kill to score/kill counter
                score += 100;
                kills += 1;
                break;
            }
        }
        if(hit == true)
        {
            //remove the colliding bullet
            bullets.splice(i, 1);
            break;
        }
        if(bullets[i].x > SCREEN_WIDTH)
        {
            bullet.splice(i, 1);
        }
        bullets[i].draw();
    }   
}

//Creating a cells array
var cells = [];
function initialize()
{
    for(var layeridx = 0; layeridx < LAYER_COUNT; layeridx++)
    {
        cells[layeridx] = [];
        var Idx = 0;
        for(var y = 0; y < level1.layers[layeridx].height; y++)
        {
            cells[layeridx][y] = [];
            for(var x = 0; x < level1.layers[layeridx].width; x++)
            {
                if(level1.layers[layeridx].data[Idx] !=0)
                {
                    cells[layeridx][y][x] = 1; //create collision on cell which the player is colliding with
                    cells[layeridx][y-1][x] = 1; //create collision with the cell below colliding cell
                    cells[layeridx][y-1][x+1] = 1; //create collision with cell below, right with the colliding cell
                    cells[layeridx][y][x+1] = 1; //create collision with one cell to the right cell which the player is colliding with
                }
                else if(cells[layeridx][y][x] != 1)
                {
                    // if there is no collision calculated and cell has not been given a value, set it to 0 (no collision)
                    cells[layeridx][y][x] = 0;
                }
                Idx++;
            }
        }
    }
    
    cells[LAYER_OBJECT_TRIGGERS] = [];
    Idx = 0;
    for(var y = 0; y < level1.layers[LAYER_OBJECT_TRIGGERS].height; y++)
    {
        cells[LAYER_OBJECT_TRIGGERS][y] = [];
        for(var x = 0; x < level1.layers[LAYER_OBJECT_TRIGGERS].width; x++)
        {
            if(level1.layers[LAYER_OBJECT_TRIGGERS].data[Idx] != 0)
            {
                cells[LAYER_OBJECT_TRIGGERS][y][x] = 1;
                cells[LAYER_OBJECT_TRIGGERS][y-1][x] = 1;
                cells[LAYER_OBJECT_TRIGGERS][y-1][x+1] = 1;
                cells[LAYER_OBJECT_TRIGGERS][y][x+1] = 1;
            }
            else if(cells[LAYER_OBJECT_TRIGGERS][y][x] != 1)
            {
                cells[LAYER_OBJECT_TRIGGERS][y][x] = 0;
            }
            Idx++;
        }
    }
    
    addEnemies();
    
    musicBackground = new Howl({
            urls: ["background.ogg"],
            loop: true,
            buffer: true,
            volume: 0.05
        });
        
    sfxFire = new Howl({
       urls: ["fireEffect.ogg"],
       buffer: true,
       volume: 1,
       onend: function()
            {
                isSfxPlaying = false;
            }
    });
    
    sfxPlayerDie = new Howl({
        urls: ["death.ogg"],
        buffer: true,
        volume: 1, 
    });
    
    // if(Gamestate == 1)
    // {
        musicBackground.play();
    // }
}

function addEnemies()
{
    //adding enemies
    Idx = 0;
    for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++)
    {
        for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++)
        {
            if(level1.layers[LAYER_OBJECT_ENEMIES].data[Idx] != 0)
            {
                var px = tileToPixle(x);
                var py = tileToPixle(y);
                var e = new Enemy(px, py);
                enemies.push(e);
            }
            Idx++;
        }
    }
}

function DrawLevelCollisionData(tileLayer, colour) {
    for (var y = 0; y < level1.layers[tileLayer].height; y++) {
        for (var x = 0; x < level1.layers[tileLayer].width; x++) {
            if (cells[tileLayer][y][x] == 1) {
                context.fillStyle = colour;
                context.fillRect(TILE * x, TILE * y, TILE, TILE);
            }
        }
    }
}

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();

	// // update the frame counter 
	// fpsTime += deltaTime;
	// fpsCount++;
	// if(fpsTime >= 1)
	// {
	// 	fpsTime -= 1;
	// 	fps = fpsCount;
	// 	fpsCount = 0;
	// }		
		
	// // draw the FPS
	// context.fillStyle = "#ffffff";
	// context.font="14px Arial";
	// context.fillText("FPS: " + fps, 5, 20, 100);
    
    // Game State Manager
    switch(Gamestate)
    {
        case Gamestate_splash:
            runGamesplash(deltaTime);
            break;
        case Gamestate_play:
            runGameplay(deltaTime);
            break;
        case Gamestate_over:
            runGameover(deltaTime);
            break;
        case Gamestate_reset:
            runGamereset(deltaTime);
            break;
        case Gamestate_resetvalues:
            runGamevalreset(deltaTime);
            break;
        case Gamestate_win:
            runGameWin(deltaTime);
            break;
        case Gamestate_death:
            runGamedeath(deltaTime);
            break;
        // case Gamestate_reintial:
        //     runGameReIntial(deltaTime);
        //     break;
    }
    
    //Debug Console Logs
    // console.log(player.velocity.y);
    // console.log(player.celldown);
    // console.log(player.tx);
    // console.log(player.ty);
    // console.log(player.position);
    // console.log(player.position.x);
    // console.log(player.position.y);
    
    // Debug Collision Layer Checks
    // DrawLevelCollisionData(0, "#00ff00");
    // DrawLevelCollisionData(1, "#0000ff");
    // DrawLevelCollisionData(2, "#ff0000");
    // DrawLevelCollisionData(3, "#ff00ff");
    // DrawLevelCollisionData(4, "#ffff00");
    	
    //Debug players collision box
    // context.fillStyle = "#ffffff";
    // context.fillRect(player.position.x, player.position.y, TILE, TILE);
    
}


initialize();

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
