
class Camera {

    constructor(target) {
        this.target = target;

        this.minX = -100;
        this.maxX = 500;
        this.minY = -100;
        this.maxY = 100;

        this.smoothingSpeed = 5;

        // shake
        this.shakingValue = Vector2.Zero();
        this.shakingTime = 0;
        this.shakingSpeed = 40;
        this.shakingSize = 5;
        this.shakeInitRandom = Vector2.Zero();

        this.position = Vector2.Zero();
        this.targetPosition = Vector2.Zero();
    }

    Start() {
        this.position.x = this.target.position.x - canvas.width / 2;
        this.position.y = this.target.position.y - canvas.height / 2;
    }

    Update(deltaTime) {
        this.targetPosition.x = this.target.position.x - canvas.width / 2;
        this.targetPosition.y = this.target.position.y - canvas.height / 2;

        if (this.targetPosition.x < this.minX)
            this.targetPosition.x = this.minX;
        if (this.targetPosition.x > this.maxX)
            this.targetPosition.x = this.maxX;

        if (this.targetPosition.y < this.minY)
            this.targetPosition.y = this.minY;
        if (this.targetPosition.y > this.maxY)
            this.targetPosition.y = this.maxY;

        this.shakingValue.Set(0,0);
        if (this.shakingTime > 0)
        {
            this.shakingTime -= deltaTime;

            this.shakingValue.x = Math.cos(this.shakeInitRandom.x + this.shakingTime * this.shakingSpeed) * this.shakingSize;
            this.shakingValue.y = Math.sin(this.shakeInitRandom.y + this.shakingTime * this.shakingSpeed) * this.shakingSize;
        }

        const smoothStep = this.smoothingSpeed * deltaTime;

        this.position.x += ((this.targetPosition.x - this.position.x) * smoothStep) + this.shakingValue.x;
        this.position.y += ((this.targetPosition.y - this.position.y) * smoothStep) + this.shakingValue.y;
    }

    PreDraw(ctx) {
        ctx.save();

        ctx.translate(-this.position.x, -this.position.y);
    }

    PostDraw(ctx) {
        ctx.restore();
    }

    Shake(time, speed, size){
        this.shakingTime = time;
        this.shakingSpeed = speed;
        this.shakingSize = size;
        this.shakeInitRandom.Random();
    }
}