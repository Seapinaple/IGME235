
// player class, controls collisions with the player and player movement
class Player extends PIXI.Sprite
{
    
    constructor(texture, x = 0, y = 0, speed = 0, radius)
    {
        super(texture);
        this.anchor.set(0, 0);
        this.scale.set((radius) / texture.width);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.startpos = new Point(x, y);
        this.rect = new PIXI.Rectangle(this.x, this.y, this.width, this.height);
    }

    // moves the player then checks for collisions
    update(moveVect, walls, exito, rats)
    {
        this.move(moveVect);
        this.keepInBounds();
        for (const element of walls)
        {
            this.collision(element, moveVect);    
        }
        this.exitCollision(rats, exito);
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
        if (this.x > (app.renderer.width - (this.texture.width * this.scale.x)))
        {
            this.x = (app.renderer.width - (this.texture.width * this.scale.x));
        }
        if (this.x < 0)
        {
            this.x = 0;
        }
        if (this.y > (app.renderer.height - (this.texture.width * this.scale.y)))
        {
            this.y = (app.renderer.height - (this.texture.width * this.scale.y));
        }
        if (this.y < 0 )
        {
            this.y = 0 ;
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
        // // // console.log("sdf");
        if (rectsIntersect(this, wall)) 
            { // was this.rect and wall.rect, changing to the sprites themsel
            // // // console.log ("hithi");
            // if (this.x > wall.x) {
            //     this.x = wall.center.x + wall.width + 1; 
            //     this.rect.x = this.x;
            //     // // // console.log(wall.center);
            // }
            // if (this.x.x < wall.x) {
            //     this.x = wall.center.x + wall.width; 
            //     // // console.log(wall.center);
            // }
            // if (this.y > wall.y) {
            //     this.y = wall.center.y - (player.height / 2); 
            //     // // console.log(wall.center);
            // }
            // if (this.y < wall.y) {
            //     this.y = wall.center.y + wall.height; 
            //     // // console.log(wall.center);
            // }

           if (vect.x > 0 && this.x < wall.x)
           {
                this.x = wall.x - this.width;
           }
           if (vect.x < 0 && this.x > wall.center.x)
            {
                 this.x = wall.x + this.width;
            }
            if (vect.y > 0 && this.y < wall.center.y) 
            {
                this.y = wall.y - this.width;
                // // console.log("deep");
            }
            if (vect.y < 0 && this.y > wall.y)
            {
                this.y = wall.y + this.width;
                // // console.log("uppy");
            }
        }
    }
// if all the rats are dead lets player iwn the game
    exitCollision(rats, exitoo)
    {
        if (exitoo != null)
        {
            if (rectsIntersect(this, exitoo))
                {
                    for (let i = 0; i < rats.length; i++)
                    {
                        if (rats[i] != null)
                        {
                            // // console.log("rats");
                            return;
                            
                        }
                    }
        
                    gameScene.visible = false;
                    gameOverScene.visible = true;
                }
        }
        
    }
    
}


// vector class cause i like using my own things
class Vector
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
        
    }
// normalizes the vector
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
// a x and y point 
class Point
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}
// Wall class, used for collision with the player
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
        // // // console.log(this.wallRect);
        this.realCenter = new Point(center.x + width / 2, center.y + width / 2);
    }
}
// rat, actually a mouse, it will move back and forth on the screen using its update function
class Rat extends PIXI.Sprite
{
    constructor(texture, x = 0, y = 0, speed = 0, radius, sprites)
    {
        super(texture);
        this.anchor.set(0.5, 0.5);
        this.scale.set((radius / 2) / texture.width);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.startpos = new Point(x, y);
        this.rect = new PIXI.Rectangle(this.x, this.y, this.width, this.height);
        this.direction = new Vector(0,1);
        this.swapped = false;
        this.sound = new Howl({
            src: ['sounds/click.wav'], 
            volume: 1, 
            loop: false, 
            onplay: function() {
              console.log('Sound started playing!');
            }
          });
    }

// moves the rat and checks for collision
    update(walls, player, ratties)
    {
        this.swapped = false;
        this.move();
        this.collide(walls, player, ratties);
    }

    move()
    {
        // // // console.log("i like to move it move it");
        
            this.x += this.direction.x;
        
        
            this.y += this.direction.y;
        
        
    }

    collide(walls, player, ratties)
    {
        for (const element of walls)
        {
            if (rectsIntersect(this, element) && !this.swapped)
            {
                this.direction.y *= -1;
                this.swapped = true;
            }
        }
        if (rectsIntersect(this, player))
        {
            // do something tht involves deleting this
            // // // console.log("ouchie");
            ratties[this] = null;
            THErATiSdEAD(this);
            this.sound.play();
        }
    }
}

// exit staircase, has a texture and rectangle for collision
class Exit extends PIXI.Sprite
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
        this.exitRect = new PIXI.Rectangle(this.x, this.y, this.width, this.width);
        // // // console.log(this.wallRect);
    }

    
}