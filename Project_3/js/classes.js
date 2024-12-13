class Player extends PIXI.Sprite
{
    constructor(texture, x = 0, y = 0, speed = 0, radius)
    {
        super(texture);
        this.anchor.set(0.5, 0.5);
        this.scale.set((radius / 2) / texture.width);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.startpos = new Point(x, y);
        this.rect = new PIXI.Rectangle(this.x, this.y, this.width, this.height);
    }

    
    update(moveVect, walls)
    {
        this.move(moveVect);
        this.keepInBounds();
        for (const element of walls)
        {
            this.collision(element, moveVect);    
        }
        this.startpos.x = this.x;
        this.startpos.y = this.y;
    }
    update(moveVect)
    {
        this.move(moveVect);
        this.keepInBounds();
        
        this.startpos.x = this.x;
        this.startpos.y = this.y;
    }
    move(moveVect)
    {
        moveVect.normalize();
        this.x += moveVect.normalX * this.speed;
        this.y += moveVect.normalY * this.speed;
        this.rect.x = this.x;
        this.rect.y = this.y;
    }
    keepInBounds()
    {
        if (this.x > (app.renderer.width - (this.texture.width * this.scale.x) / 2))
        {
            this.x = (app.renderer.width - (this.texture.width * this.scale.x) / 2);
        }
        if (this.x < 0 + ((this.texture.width * this.scale.x) /2 ))
        {
            this.x = 0 + ((this.texture.width * this.scale.x) /2 );
        }
        if (this.y > (app.renderer.height - (this.texture.width * this.scale.y) / 2))
        {
            this.y = (app.renderer.height - (this.texture.width * this.scale.y) / 2);
        }
        if (this.y < 0 + ((this.texture.height * this.scale.y) /2 ))
        {
            this.y = 0 + ((this.texture.height * this.scale.y) /2 );
        }
    }
    // collision(wall)
    // {
    //     let point = new Point(this.x, this.y);
    //     let radius = ((this.texture.width * this.scale.x) / 2);

    //     if (isCollide(point, radius, wall.center, wall.radius))
    //     {
    //         let pte = new Point (point.x, (point.y - radius));
    //         let pbe = new Point (point.x, (point.y + radius));
    //         let pre = new Point ((point.x - radius), point.y);
    //         let ple = new Point ((point.x + radius), point.y);

    //         let ote = new Point (wall.center.x, (wall.center.y - wall.radius));
    //         let obe = new Point (wall.center.x, (wall.center.y + wall.radius));
    //         let ore = new Point ((wall.center.x - wall.radius), wall.center.y);
    //         let ole = new Point ((wall.center.x + wall.radius), wall.center.y);

    //         if ((pte.y < obe.y) || (pbe.y > ote.y))
    //         {
    //             this.y = this.startpos.y;
    //         }

    //         if ((pte.x < obe.x) || (pbe.x > ote.x))
    //         {
    //             this.x = this.startpos.x;
    //         }
    //     }
    // }

    collision(wall, vect)
    {
        if (rectsIntersect(this, wall)) { // was this.rect and wall.rect, changing to the sprites themsel
            console.log ("hithi");
            if (vect.x > 0) {
                this.x = wall.center.x - player.width; 
                console.log(wall.center);
            }
            if (vect.x < 0) {
                this.x = wall.center.x + wall.width; 
                console.log(wall.center);
            }
            if (vect.y > 0) {
                this.y = wall.center.y - player.height; 
                console.log(wall.center);
            }
            if (vect.y < 0) {
                this.y = wall.center.y + wall.height; 
                console.log(wall.center);
            }
        }
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

class Point
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

class Wall extends PIXI.Sprite
{
    // Must take a point as the center center is top left corner
    constructor(texture, center, width)
    {
        super(texture);
        this.anchor.set(0, 0);
        this.scale.set((width) / texture.width);
        this.center = center;
        this.radius = width;
        this.position.set(center.x, center.y);
        this.wallRect = new PIXI.Rectangle(this.x, this.y, width, width);
        console.log(this.wallRect);
    }
}

class Rat extends PIXI.Sprite
{
    constructor(texture, x = 0, y = 0, speed = 0, radius, direction)
    {
        super(texture);
        this.anchor.set(0.5, 0.5);
        this.scale.set((radius / 2) / texture.width);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.startpos = new Point(x, y);
        this.rect = new PIXI.Rectangle(this.x, this.y, this.width, this.height);
        this.direction = direction;
        this.swapped = false;
    }


    update(walls, player)
    {
        this.swapped = false;
        move();
        collide(walls, player);
    }

    move()
    {
        if (this.direction.x !== 0)
        {
            this.x += this.direction.x;
        }
        if (this.direction.x !== 0)
        {
            this.y += this.direction.y;
        }
        
    }

    collide(walls, player)
    {
        for (const element of walls)
        {
            if (rectsIntersect(this, element) && !this.swapped)
            {
                this.direction *= -1;
                this.swapped = true;
            }
        }
        if (rectsIntersect(this, player))
        {
            // do something tht involves deleting this
        }
    }
}
