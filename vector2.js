//initilising vector 2
var Vector2 =  function vector2(posX, posY)
{
    this.x = posX;
    this.y = posY;
}

Vector2.prototype.Set = function(posX, posY)
{
    this.x = posX;
    this.y = posY;
}

Vector2.prototype.Magnitude = function() //a.k.a length
{
    var mag = this.x * this*x + this.y * this.y;
    mag = Math.sqrt(mag);
    return mag;
}

Vector2.prototype.Normalize = function()
{
    this.x /= mag
    this.y /= mag
}

Vector2.prototype.SetNormalize = function()
{
    var mag = this.Magnitude();
    var vec2 = new Vector2(0,0);
    
    vec2.x = this.x / mag;
    vec2.y = this.y / mag;
    
    return vec2;
}

Vector2.prototype.Multiply = function(scalar)
{
    this.x *= scalar;
    this.y *= scalar;
}

Vector2.prototype.Add = function(other)
{
    this.x += other.x;
    this.y += other.y;
}

Vector2.prototype.Sub = function(other)
{
    this.x -= other.x;
    this.y -= other.y;
}

Vector2.prototype.Divide = function(scalar)
{
    this.x /= scalar;
    this.y /= scalar;
}