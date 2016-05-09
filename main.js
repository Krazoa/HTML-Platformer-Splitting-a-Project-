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
    
    //Setting name
    context.fillStyle = "#ffffff";
    context.font= "12px Arial";
    context.fillText("AIE Project by Michele A.", 2, SCREEN_HEIGHT - 2)
    
    context.fillStyle = "#ffffff";
    context.font = "25px Arial";
    context.fillText("Pretend you see a splash image here :)", SCREEN_WIDTH/2, SCREEN_HEIGHT/2)
    
    if(Splash_timer <= 0)
    {
        Gamestate = Gamestate_reset;
    }
}
function runGameplay(deltaTime)
{
    
    player.update(deltaTime);
    DrawLives();
    drawMap();
    player.draw();
    DrawScore();
    DrawHPCounter();
    // KillCounter.draw();
    
    
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
    
    // //Add enemies
    // for(var i=0; i<enemies.length; i++)
    // {
    //     enemies[i].update(deltaTime);
    // }
    
    if(player_hp <= 0)
    {
        // console.log(lives)
        lives -= 1;
        player_hp = 100;
        if(lives == 0)
        {
            sfxPlayerDie.play();
            // console.log("Player died")
            Gamestate = Gamestate_over;
        }
    }
}
function runGamevalreset(deltaTime)
{
    //Reset all values
    score = 0;
    reset_timer = 3;
    Cheat = false;
    player_hp = 100;
    lives = 3;
    Gamestate = Gamestate_reset;
    
}
function runGameover(deltaTime)
{
    Enterstate = false;
    context.fillStyle = "#ffffff";
    context.font = "25px Arial";
    context.fillText("Chuck Norris is dead...just kidding, Chuck Norris never dies.", 100, SCREEN_HEIGHT/2)
    
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
    
    context.fillStyle = "#ffffff";
    context.font = "18px Arial";
    context.fillText("In the year 30XX, Chuck Norris decides to go on another pointless rampage...", 100, 200)
    
    context.fillStyle = "#ffffff";
    context.font = "14px Arial";
    context.fillText("Movement Controls: Left and Right Arrow Keys", 100, 350)
    
    context.fillStyle = "#ffffff";
    context.font = "14px Arial";
    context.fillText("Climbing Controls: Up Arrow Key", 100, 400)
    
    context.fillStyle = "#ffffff";
    context.font = "14px Arial";
    context.fillText("Shooting Controls: Shift Key", 100, 450)
    
    //Insert some sort of background here
    
    context.fillStyle = "#ffffff";
    context.font = "25px Arial";
    context.fillText("Press ENTER to begin", 100, 230)
    if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true)
    {
        Enterstate = true;
    }
    if(Enterstate == true)
    {
        reset_timer -= deltaTime;
        context.fillStyle = "#ffffff";
        context.font = "24px Arial";
        context.fillText("Prepare for battle in " + reset_timer + " seconds!!!", 100, 300)
    }
    if(reset_timer <= 0)
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
    
    // //adding enemies
    // Idx = 0;
    // for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++)
    // {
    //     for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++)
    //     {
    //         if(level1.layers[LAYER_OBJECT_ENEMIES.data[Idx] != 0)
    //         {
    //             var px = tileToPixle(x);
    //             var py = tileToPixle(y);
    //             var e = new Enemy(px, py);
    //             enemies.push(e);
    //         }
    //         Idx++;
    //     }
    // }
    
    musicBackground = new Howl(
        {
            urls: ["background.ogg"],
            loop: true,
            buffer: true,
            volume: 0.4
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
