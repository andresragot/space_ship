class Enemy_Asteroid extends Enemy
{
    constructor(img, initialPosition, life)
    {
        super(img, initialPosition, life);
        this.speed = 50;
        
        this.asteroidSpeed = 5;
        this.rotationAsteroid = 0;
        this.rotation = RandomBetweenFloat(0.01, 2* Math.PI);
    }

    Update(deltaTime)
    {
        this.position.x += Math.cos(this.rotation) * this.speed * deltaTime;
        this.position.y += Math.cos(this.rotation) * this.speed * deltaTime;

        this.rotationAsteroid += this.asteroidSpeed * deltaTime;
    }

    Draw(ctx)
    {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotationAsteroid);
        ctx.scale(1, 1);

        ctx.drawImage(this.img, 111, 0, 32, 32, -16, -15, 30, 30);

        ctx.restore();

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(Math.cos(this.rotation) * 10 + this.position.x , Math.sin(this.rotation) * 10 + this.position.y);
        ctx.stroke();
        
    }

    Damage(damage)
    {
        console.log("Asteroide");
        this.life -= damage;
        if (this.life < 0)
            this.life = 0;
        
        return this.life <= 0;
    }
}