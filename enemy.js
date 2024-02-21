
class Enemy {

    constructor(img, initialPosition, life) {
        this.img = img;
        this.position = initialPosition;
        this.rotation = 0;
        this.targetRotation = 0;
        this.life = life;

        this.boundingRadius = 18;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius;

        this.speed = 80; 
    }

    Update(deltaTime) {
        // rotation
        this.targetRotation = Math.atan2(
            player.position.y - this.position.y,
            player.position.x - this.position.x
        );

        this.rotation = this.targetRotation;

        // movement
        this.position.x += Math.cos(this.rotation) * this.speed * deltaTime;
        this.position.y += Math.sin(this.rotation) * this.speed * deltaTime;
    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation + PIH);
        ctx.scale(1, 1);

        ctx.drawImage(this.img, 149, 182, 31, 46, -15, -23, 31, 46);

        ctx.restore();

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    Damage(damage) {
        this.life -= damage;
        if (this.life < 0)
            this.life = 0;
        
        return this.life <= 0;
    }

}
