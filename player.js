
class Player {

    constructor(initialPosition, life, img) {
        this.img = img;

        this.position = initialPosition;
        this.rotation = 0;
        this.targetRotation = 0;

        this.speed = 300;
        this.speedRotation = 5;
        this.speedMult = 1.5;

        this.movement = Vector2.Zero();

        this.life = life;

        this.fireRate = .1;
        this.fireRateAux = 0;

        this.cannonOffset = {
            x: 10,
            y: 0
        }

        this.boundingRadius = 24;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius
        ;

        this.bullets = new BulletPool(this, 10);
    }

    Update(deltaTime) {
        // rotation
        this.targetRotation = Math.atan2(
            Input.mouse.y - this.position.y + camera.position.y,
            Input.mouse.x - this.position.x + camera.position.x
        ) + PIH;

        this.rotation = this.targetRotation;

        // https://gamedev.stackexchange.com/questions/72348/how-do-i-lerp-between-values-that-loop-such-as-hue-or-rotation
        /*const rotationDif = this.targetRotation - this.rotation;

        function NormalizeAngle(angle) {
            while (angle < 0) 
                angle += Math.PI;
            while (angle >= Math.PI) 
                angle -= Math.PI;
            return angle;
        }

        let distanceForward = this.targetRotation - this.rotation;
        let distanceBackward = this.rotation - this.targetRotation;

        // Which direction is shortest?
        // Forward? (normalized to 75)
        if (NormalizeAngle(distanceForward) < NormalizeAngle(distanceBackward)) {
            // Adjust for 360/0 degree wrap
            if (this.targetRotation < this.rotation)
                this.targetRotation += Math.PI; // Will be above 360
        }
        else {
            // Adjust for 360/0 degree wrap
            if (this.targetRotation > this.rotation)
                this.targetRotation -= Math.PI; // Will be below 0
        }

        // rotation lerp
        this.rotation += Math.abs(this.rotation-this.targetRotation) * this.speedRotation * deltaTime;
        */

        // movement
        this.movement.Set(0, 0);

        if (Input.IsKeyPressed(KEY_A) || Input.IsKeyPressed(KEY_LEFT)) {
            this.movement.x -= 1;
        }
        if (Input.IsKeyPressed(KEY_D) || Input.IsKeyPressed(KEY_RIGHT)) {
            this.movement.x += 1;
        }
        if (Input.IsKeyPressed(KEY_W) || Input.IsKeyPressed(KEY_UP)) {
            this.movement.y -= 1;
        }
        if (Input.IsKeyPressed(KEY_S) || Input.IsKeyPressed(KEY_DOWN)) {
            this.movement.y += 1;
        }
        this.movement.Normalize();

        // speed multiply
        if (Input.IsKeyPressed(KEY_LSHIFT)) {
            this.movement.MultiplyScalar(this.speedMult);
        }

        // apply the movement
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

        // shotting
        this.fireRateAux += deltaTime;

        if (Input.IsMousePressed() && (this.fireRateAux >= this.fireRate)) {
            const muzzlePosition = RotatePointAroundPoint(
                {
                    x: this.cannonOffset.x + this.position.x,
                    y: this.cannonOffset.y + this.position.y
                },
                this.position,
                this.rotation - PIH
            );
            const bulletPosition = new Vector2(muzzlePosition.x, muzzlePosition.y);

            const bullet = this.bullets.Activate();
            bullet.position = bulletPosition;
            bullet.rotation = this.rotation - PIH;
            bullet.speed = 600;
            bullet.damage = 1;

            //this.camera.Shake(0.1, 70, 2);

            this.fireRateAux = 0.0;
        }

        this.bullets.Update(deltaTime);

        // bullet scene limits
        this.bullets.bullets.forEach(bullet => {
            if (bullet.active) {
                // check the world bounds
                if (bullet.position.x < sceneLimits.x ||
                    bullet.position.x > sceneLimits.x + sceneLimits.width ||
                    bullet.position.y < sceneLimits.y ||
                    bullet.position.y > sceneLimits.y + sceneLimits.height) {
                    this.bullets.Deactivate(bullet);
                }
            }
        });
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
