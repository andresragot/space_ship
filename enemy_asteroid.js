class Enemy_Asteroid extends Enemy
{
    constructor(img, initialPosition, life, small, direction)
    {
        super(img, initialPosition, life);        
        
        if (typeof(direction) === "undefined")
        {
            this.direction = new Vector2(player.position.x - this.position.x, player.position.y - this.position.y);
            this.direction.Normalize();
        }
        else
        {
            this.direction = direction;
        }

        this.speed = 50;
        
        this.asteroidSpeed = RandomBetweenFloat(0, 2);

        this.small = small;
        this.boundingRadius = small ? 15 : 24;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius;

    }

    Update(deltaTime)
    {
        this.position.x += this.direction.x * this.speed * deltaTime;
        this.position.y += this.direction.y * this.speed * deltaTime;

        this.rotation += this.asteroidSpeed * deltaTime;
    }

    Draw(ctx)
    {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation + PIH);
        ctx.scale(1, 1);

        if (this.small)
            ctx.drawImage(this.img, 144, 476, 32, 32, -16, -16, 32, 32);
        else
            ctx.drawImage(this.img, 144, 428, 48, 48, -24, -24, 48, 48);

        ctx.restore();

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.direction.x * 10 + this.position.x , this.direction.y * 10 + this.position.y);
        ctx.stroke();
        
    }

    Damage(damage)
    {
        const dead = super.Damage(damage);
        if (dead && !this.small)
        {
            // Spawn two small asteroid
            const smallAsteroidA = new Enemy_Asteroid(this.img, Vector2.Copy(this.position), 1, true, new Vector2(this.direction.y, -this.direction.x));
            enemies.push(smallAsteroidA);

            const smallAsteroidB = new Enemy_Asteroid(this.img, Vector2.Copy(this.position), 1, true, new Vector2(-this.direction.y, this.direction.x));
            enemies.push(smallAsteroidB);
        }
        
        return dead
    }
}