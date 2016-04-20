//D = delta/displacement (change in somthing)
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