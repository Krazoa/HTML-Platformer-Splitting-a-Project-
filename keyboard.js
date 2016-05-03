var Keyboard = function() {
    var self = this;
    
    window.addEventListener('keydown', function(evt) {self.isKeyDown(evt);}, false);
    window.addEventListener('keyup', function(evt) {self.isKeyUp(evt);}, false);
    
    this.keyListeners = new Array();
    this.keys = new Array();
    
    //Key constant values
    this.KEY_SPACE = 32;
    this.KEY_LEFT = 37;
    this.KEY_UP = 38;
    this.KEY_RIGHT = 39;
    this.KEY_DOWN = 40;
    
    this.KEY_A = 65;
    this.KEY_D = 68;
    this.KEY_S = 83;
    this.KEY_W = 87;
    this.KEY_SHIFT = 16;
};

Keyboard.prototype.isKeyDown = function(evt)
{
    this.keys[evt.keyCode] = true;
};

Keyboard.prototype.isKeyUp = function(evt)
{
    this.keys[evt.keyCode] = false;
};

Keyboard.prototype.isKeyDown = function(keyCode)
{
    // console.log("A Keyboard.isKeyDown function Called")
    return this.keys[keyCode];
};