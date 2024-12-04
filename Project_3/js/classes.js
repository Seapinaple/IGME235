class Player extends PIXI.Sprite
{
    constructor(texture, x = 0, y = 0, speed = 0)
    {
        super(texture);
        this.anchor.set(0.5, 0.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    update(moveVect)
    {
        this.move(moveVect);

    }
    move(moveVect)
    {
        moveVect.normalize();
        this.x += moveVect.normalX * this.speed;
        this.y += moveVect.normalY * this.speed;
    }
    keepInBounds()
    {
        
    }
}


class Vector
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
        
    }

    normalize()
    {
        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        if (this.magnitude !== 0) 
            {
                this.normalX = this.x / this.magnitude;
                this.normalY = this.y / this.magnitude;
            } 
            else 
            {
                this.normalX = 0;
                this.normalY = 0;
            }
    }
}