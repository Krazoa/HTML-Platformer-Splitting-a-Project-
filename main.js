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

//D = delta/displacement (change in somthing)
//setting distance mesurments
var METRE = TILE; // every one tile equals 1m
//setting gravity at which the player will fall at
var GRAVITY = METRE * 9.8 * 6;
//max player horizontal speed (max of 10m (10 tiles) per second)
var MAXDX = METRE * 10;
//max player vertial speed (max of 15m (15 tiles) per second)
var MAXDY = METRE * 15;
//horizontal acceleration per metre (force at which the player gains velocity at)
var ACCEL = MAXDX * 2;
//horizontal friction per metre (force at which the player slowly stops at)
var FRICTION = MAXDX * 6;
//jump distance at which the player jumps at (bunny hopping??)
var JUMP = METRE * 1500;
//number of layers
var LAYER_COUNT = 3;
//setting variable values to each collision state
var LAYER_BACKGROUND = 0; //0 = no collision
var LAYER_PLATFORMS = 1; //1 = collision with a platform
var LAYER_LADDERS = 2; //2 = collision with a ladder
//level dimentions in tiles
var MAP = {tw: 20, th: 15};
//dimentions of a tile (in pixles)
var TILE = 35;
//width and high of a tile in the tileset
var TILESET_TILE = TILE * 2;
//pixles between the image boarder and the tile images in the tile map
var TILESET_PADDING = 2;
//spacing width between each tile in the tileset
var TILESET_SPACING = 2;
//how many coloumns of image tiles 
var TILESET_COUNT_X = 14;
//how many rows of image tiles
var TILESET_COUNT_Y = 14;

//Creating a cells array
var cells = [];

// load an image to draw
var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";

var player = new Player();
var keyboard = new Keyboard();

var tileset = document.createElement("img");
tileset.src = "tileset.png";

function cellAtPixelCoord(layer, x,y)
{
    if(x<0 || x>SCREEN_WIDTH)
        return 1;
        //let the player drop
    else if(y>SCREEN_HEIGHT)
        return 0;
    return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
    if(tx<0 || tx>MAP.tw || ty<0)
        return 1;
        //let the player drop
    else if(ty>MAP.th)
        return 0;
        return cells[layer][ty][tx];
}

function tileToPixle(tile)
{
    return tile *TILE;
};

function pixleToTile(pixle)
{
    return Math.floor(pixle/TILE);
};

function bound(value, min, max)
{
    if(value < min)
        return min;
    if(value > max)
        return max;
    return value;
}

function drawMap()
{
    for(var layeridx=0; layeridx<LAYER_COUNT; layeridx++)
    {
        var idx = 0;
        //for each y layer, if y is less than total y layers then plus 1 to y
        for(var y = 0; y<level1.layers[layeridx].height; y++)
        {
            //for each x layer, if y is less than total x layers then plus 1 to x
            for(var x = 0; x<level1.layers[layeridx].width; x++)
            {
                //do check
                if(level1.layers[layeridx].data[idx] !=0 )
                {
                    //1 = tile, 0 = no tile
                    var tileIndex = level1.layers[layeridx].data[idx] - 1;
                    var sx = TILESET_PADDING + (tileIndex%TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
                    var sy = TILESET_PADDING + (Math.floor(tileIndex/TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
                    context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y - 1)*TILE, TILESET_TILE, TILESET_TILE);
                }
                idx++;
            }
        }
    }
}


function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
    
    player.update(deltaTime);
    player.draw();
    drawMap();
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}

function initialize()
{
    for(var layeridx = 0; layeridx < LAYER_COUNT; layeridx++)
    {
        cells[layeridx] = [];
        var idx = 0;
        for(var y = 0; y < level1.layers[layeridx].width; y++)
        {
            cells[layeridx][y] = [];
            for(var x = 0; x <level1.layers[layeridx].width; x++)
            {
                if(level1.layers[layeridx].data[idx] !=0)
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
                idx++
            }
        }
    }
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
