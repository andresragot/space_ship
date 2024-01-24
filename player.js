
class Player {

    constructor(initialPosition, life, img) {
        this.img = img;

        this.position = initialPosition;
        this.rotation = 0;
        this.targetRotation = 0;

        this.movement = Vector2.Zero();

        this.speed = 300;
        this.speedRotation = 20;
        this.speedMult = 2;

        this.life = life;

        this.fireRate = .25;
        this.fireRateAux = 0;

        this.cannonOffset = {
            x: 0,
            y: -10
        }

        this.boundingRadius = 24;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius;

        this.bullets = new BulletPool(this, 10);
    }

    Update(deltaTime) {
        // rotation
        this.targerRotation = Math.atan2(Input.mouse.y - this.position.y + camera.position.y, Input.mouse.x - this.position.x + camera.position.x) + PIH;

        this.rotation += (this.targerRotation - this.rotation) * deltaTime * this.speedRotation; 


        // PIH sirve para rotar el sprite

        // movement
        this.movement.Set(0,0);

        if (Input.IsKeyPressed(KEY_A) || Input.IsKeyPressed(KEY_LEFT))
        {
            this.movement.x -= 1;
        }
        if (Input.IsKeyPressed(KEY_D) || Input.IsKeyPressed(KEY_RIGHT))
        {
            this.movement.x += 1;
        }
        if (Input.IsKeyPressed(KEY_W) || Input.IsKeyPressed(KEY_UP))
        {
            this.movement.y -= 1;
        }
        if (Input.IsKeyPressed(KEY_S) ||Input.IsKeyPressed(KEY_DOWN))
        {
            this.movement.y += 1;
        }

        this.movement.Normalize();

        // speed multiply
        if (Input.IsKeyPressed(KEY_LSHIFT))
        {
            this.movement.MultiplyScalar(this.speedMult);
        }

        //Apply the movement
        this.position.x += this.movement.x * this.speed * deltaTime;
        this.position.y += this.movement.y * this.speed * deltaTime;

        if (this.position.x < sceneLimits.x + this.boundingRadius)
            this.position.x = sceneLimits.x + this.boundingRadius;
        if (this.position.x > sceneLimits.x + sceneLimits.width - this.boundingRadius)
            this.position.x = sceneLimits.x + sceneLimits.width - this.boundingRadius;
        if (this.position.y < sceneLimits.y + this.boundingRadius)
            this.position.y = sceneLimits.y + this.boundingRadius;
        if (this.position.y > sceneLimits.y + sceneLimits.height - this.boundingRadius)
            this.position.y = sceneLimits.y + sceneLimits.height - this.boundingRadius;


        // Shooting
        this.fireRateAux += deltaTime;

        if (Input.IsMousePressed() && (this.fireRateAux >= this.fireRate))
        {
            const muzzlePosition = RotatePointAroundPoint(
                {
                    x: this.cannonOffset.x + this.position.x,
                    y: this.cannonOffset.y + this.position.y
                },
                this.position,
                this.rotation - PIH
            )
            var tempBull = this.bullets.Activate();
            tempBull.position.x = this.position.x;
            tempBull.position.y = this.position.y;                
            tempBull.rotation = this.rotation - PIH;
            tempBull.speed = 600;
            tempBull.damage = this.damage;

            this.fireRateAux = 0.0;
        }

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
