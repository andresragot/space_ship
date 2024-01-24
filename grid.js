
class Grid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
    }

    Draw(ctx) {
        ctx.strokeStyle = "grey";
        
        // horizontal lines
        for (let y = 0; y <= this.height; y += this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // vertical lines
        for (let x = 0; x <= this.width; x += this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
    }
}