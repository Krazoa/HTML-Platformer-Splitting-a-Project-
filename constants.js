var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

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
//number of *visible* layers
var LAYER_COUNT = 5; //SET BACK TO 3 WHEN ENEMIES SPAWN
//setting variable values to each collision state
var LAYER_BACKGROUND = 0; //0 = no collision
var LAYER_PLATFORMS = 1; //1 = collision with a platform
var LAYER_LADDERS = 2; //2 = collision with a ladder
var LAYER_OBJECT_TRIGGERS = 3;//both do not contain any collisions and do not get drawn.
var LAYER_OBJECT_ENEMIES = 4; //These two layers are enemy layers. They wont be added to the layer count as they
//level dimentions in tiles
var MAP = {tw: 60, th: 17};
//offset X of the world
var worldOffsetX = 0;
//starting X position of the map
var startX = -1
//Game States
var Gamestate_splash = 0;
var Gamestate_play = 1;
var Gamestate_over = 2;
var Gamestate_reset = 3;
var Gamestate_resetvalues = 4;
var Gamestate_win = 5;
var Gamestate_death = 6;
//Defult Start Game State
var Gamestate = Gamestate_splash;
//Splash Timer
var Splash_timer = 2;
//Reset Timer
var reset_timer = 3;
//Score counter
var score = 0;
//Setting player life
var player_hp = 200;
//Kill counter
var kills = 0;
//Damage Cooldown
var damageCooldown = 2;
//Player Lives
var lives = 2;
//Misc Key Values
var Enterstate = false;
//Debug Key Values
var Cheat = false;
var TriggerHurt = false;
//Enemy Variables
var ENEMY_MAXDX = METRE * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;
var enemies = [];   //Array bracket holding all the enemies in the map
//Music
var musicBackground;
var sfxFire;
var sfxPlayerDie;
//Array of Bulletz
var bullets = [];
//Player states
var Playerstate_RunJump = 0;
var Playerstate_Climb = 1;
//Defult start player state
var Playerstate = Playerstate_RunJump;