
class Enemy {

    constructor(img) {
        this.img = img;
    }

    Update(deltaTime) {

    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(0.5, 0.5);

        ctx.drawImage(this.img, 0, 0, 148, 120, -74, -60, 148, 120);

        ctx.restore();

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();
    }

}
