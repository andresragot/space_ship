
class Bullet {

    constructor() {
        this.position = { x: 0, y: 0};
        this.rotation = 0;
        this.damage = 1;
        this.active = false;
        this.owner = null;
        this.speed = 200;
        this.onDeactivate = null;
    }

    Update(deltaTime) {
        this.position.x += Math.cos(this.rotation) * this.speed * deltaTime;
        this.position.y += Math.sin(this.rotation) * this.speed * deltaTime;

        // deactivate the bullet if out of bounds
        if (this.position.y < 0) {
            this.onDeactivate(this);
        }
    }

    Draw(ctx) {
        ctx.fillStyle = "yellow"
        ctx.fillRect(this.position.x - 1, this.position.y - 8, 2, 8);
    }
}

class BulletPool {
    constructor(owner, maxSize) {
        this.owner = owner;
        this.bullets = [];

        // initialize the bullet pool array
        for (let i = maxSize; i > 0; i--) {
            const bullet = new Bullet();
            bullet.owner = this.owner;
            bullet.onDeactivate = this.Deactivate;

            this.bullets.push(bullet);
        }
    }

    Activate() {
        let bullet = null;
        let i = 0;
        while (bullet == null && i < this.bullets.length) {
            if (!this.bullets[i].active) {
                bullet = this.bullets[i];
            }
            else {
                i++;
            }
        }

        if (bullet == null) {
            // there is no bullet not active in the pool
            // lets create a new one
            bullet = new Bullet();
            bullet.owner = this.owner;
            bullet.onDeactivate = this.Deactivate;

            this.bullets.push(bullet);
        }

        bullet.active = true;
        return bullet;
    }

    Deactivate(bullet) {
        bullet.active = false;
    }

    Update(deltaTime) {
        this.bullets.forEach(bullet => {
            if (bullet.active) {
                bullet.Update(deltaTime);
                /*if (bullet.position.y < 0) {
                    // deactivate the bullet
                    this.Deactivate(bullet);
                }*/
            }
        });
    }

    Draw(ctx) {
        this.bullets.forEach(bullet => {
            if (bullet.active)
                bullet.Draw(ctx);
        });

        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.strokeStyle = "white";
        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].active) {
                ctx.fillRect(10 + 20 * i, 10, 20, 20);
            }
            ctx.strokeRect(10 + 20 * i, 10, 20, 20);
        }
    }
}