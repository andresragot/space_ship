
class Player {

    constructor(initialPosition, life, img) {
        this.img = img;

        this.position = initialPosition;
        this.rotation = 0;
        this.speed = 300;
        this.life = life;
        this.fireRate = .25;
        this.fireRateAux = 0;
        this.cannonOffset = {
            x: 0,
            y: -10
        }
        this.boundingRadius = 24;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius
        ;
        this.bullets = new BulletPool(this, 10);
    }

    Update(deltaTime) {
        // rotation
        this.rotation = Math.atan2(Input.mouse.y - this.position.y, Input.mouse.x - this.position.x) + PIH;

        // movement
        if (Input.IsKeyPressed(KEY_A))
            this.position.x -= this.speed*deltaTime;
        if (Input.IsKeyPressed(KEY_D))
            this.position.x += this.speed*deltaTime;
        if (Input.IsKeyPressed(KEY_W))
            this.position.y -= this.speed*deltaTime;
        if (Input.IsKeyPressed(KEY_S))
            this.position.y += this.speed*deltaTime;

        this.bullets.Update(deltaTime);
    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(1, 1);

        ctx.drawImage(this.img, 52, 244, 48, 48, -24, -24, 48, 48);

        ctx.restore();

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();

        this.bullets.Draw(ctx);
    }

}
