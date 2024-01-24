var canvas = /** @type {HTMLCanvasElement} */(null);
var ctx = /** @type {CanvasRenderingContext2D} */(null);

// game variables
var assets = {
    ships: {
        img: null,
        path: "./assets/simpleSpace_sheet.png"
    },
    crosshair: {
        img: null,
        path: "./assets/crosshair060.png"
    },
    laser: {
        img: null,
        path: "./assets/laser.png"
    }
}

var enemies = [];
var player = null;
var grid = null;
var camera = null;
var sceneLimits = {
    x: 0,
    y: 0,
    width: 1000,
    height: 500
}

function LoadImages(assets, onloaded) {
    let imagesToLoad = 0;
    
    const onload = () => --imagesToLoad === 0 && onloaded();

    /*const onload = function() {
        --imagesToLoad;
        if (imagesToLoad === 0) {
            onloaded();
        }
    }*/

    // iterate through the object of assets and load every image
    for (let asset in assets) {
        if (assets.hasOwnProperty(asset)) {
            imagesToLoad++; // one more image to load

            // create the new image and set its path and onload event
            const img = assets[asset].img = new Image;
            img.src = assets[asset].path;
            img.onload = onload;
        }
     }
    return assets;
}

function Init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    // input setup
    SetupKeyboardEvents();
    SetupMouseEvents();
    
    // assets loading
    LoadImages(assets, () => {
        Start();
        Loop();
    });
}

function Start() {

    grid = new Grid(sceneLimits.width, sceneLimits.height, 50);

    // initialize the player
    player = new Player(new Vector2(canvas.width / 2, canvas.height / 2), 1, assets.ships.img);

    camera = new Camera(player);
    camera.Start();
}

function Loop() {
    requestAnimationFrame(Loop);

    let deltaTime = 1/60;

    // Update the games logic
    Update(deltaTime);

    // Draw the game elements
    Draw();
}

function Update(deltaTime) {
    // update the enemies
    enemies.forEach(enemy => enemy.Update(deltaTime));

    // update the player
    player.Update(deltaTime);

    // update the camera
    camera.Update(deltaTime);
}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, "black");
    bgGrad.addColorStop(0.2, "rgb(80, 80, 180)");
    bgGrad.addColorStop(1, "rgb(20, 20, 80)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    camera.PreDraw(ctx);

    // grid
    grid.Draw(ctx);

    // draw the enemies
    enemies.forEach(enemy => enemy.Draw(ctx));

    // draw the player
    player.Draw(ctx);

    camera.PostDraw(ctx);

    // crosshair
    ctx.drawImage(graphicAssets.crosshair.image, Input.mouse.x - 32, Input.mouse.y - 32);

    // draw the fps
    DrawStats(ctx)
}

function DrawStats(ctx) {
    ctx.textAlign = "start";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(2, 2, 110, 54);
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    
    // TODO
}

window.onload = Init;
