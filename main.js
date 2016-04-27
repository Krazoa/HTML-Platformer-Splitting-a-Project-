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
    if(x<0 || x>SCREEN_WIDTH)
        return 1;
        //let the player drop
    else if(y>SCREEN_HEIGHT)
        return 0;
    return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
    if(tx<0 || tx>=MAP.tw)
        return 1;
        //let the player drop
    else if(ty>=MAP.th)
        return 0;
    return cells[layer][tx][ty];
};

function tileToPixle(tile)
{
    return tile * TILE;
};

function pixleToTile(pixle)
{
    return Math.floor(pixle/TILE);
};

function drawMap()
{
    for(var layeridx=0; layeridx<LAYER_COUNT; layeridx++)
    {
        var Idx = 0;
        //for each y layer, if y is less than total y layers then plus 1 to y
        for(var y = 0; y<level1.layers[layeridx].height; y++)
        {
            //for each x layer, if y is less than total x layers then plus 1 to x
            for(var x = 0; x<level1.layers[layeridx].width; x++)
            {
                //do check
                if(level1.layers[layeridx].data[Idx] !=0 )
                {
                    //1 = tile, 0 = no tile
                    var tileIndex = level1.layers[layeridx].data[Idx] - 1;
                    var sx = TILESET_PADDING + (tileIndex%TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
                    var sy = TILESET_PADDING + (Math.floor(tileIndex/TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
                    context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y - 1)*TILE, TILESET_TILE, TILESET_TILE);
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
        for(var y = 0; y < level1.layers[layeridx].width; y++)
        {
            cells[layeridx][y] = [];
            for(var x = 0; x < level1.layers[layeridx].height; x++)
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
    
    // console.log(player.velocity.y);
    // console.log(player.celldown);
    console.log(player.tx);
    // console.log(player.ty);
    // console.log(player.position);
    // console.log(player.position.x);
    // console.log(player.position.y);
    
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
