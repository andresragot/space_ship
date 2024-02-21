var canvas = /** @type {HTMLCanvasElement} */(null);
var ctx = /** @type {CanvasRenderingContext2D} */(null);

var time = 0,
    fps = 0,
    framesAcum = 0,
    acumDelta = 0;
var targetDT = 1/60; // 60 fps
var globalDT;

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

var player = null;
var enemies = [];
var kamikaze = null;
var camera = null;
var grid = null;
var sceneLimits = {
    x: 0,
    y: 0,
    width: 1000,
    height: 500
}
var enemiesSpawnPoints = [
    new Vector2(100, 100),
    new Vector2(sceneLimits.width - 100, 100),
    new Vector2(100, sceneLimits.height - 100),
    new Vector2(sceneLimits.width - 100, sceneLimits.height - 100),
];
var timeToSpawnEnemy = 3;
var timeToSpawnEnemyAux = 3;

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
    time = performance.now();

    grid = new Grid(sceneLimits.width, sceneLimits.height, 50);

    // initialize the player
    player = new Player(new Vector2(canvas.width / 2, canvas.height / 2), 1, assets.ships.img);

    camera = new Camera(player);
    camera.Start();

    // one enemy
    let enemy = new Enemy(assets.ships.img, new Vector2 (100, 100), 1);
    enemies.push(enemy);

    kamikaze = new Enemy_k(assets.ships.img, new Vector2(100, 100), 1);

}

function Loop() {
    requestAnimationFrame(Loop);

    let now = performance.now();

    let deltaTime = (now - time) / 1000;
    globalDT = deltaTime;
    
    time = now;

    framesAcum++;
    acumDelta += deltaTime;

    if (acumDelta >= 1) {
        fps = framesAcum;
        framesAcum = 0;
        acumDelta -= 1;
    }
    
    if (deltaTime > 1)
        return;


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

    // update the kamikaze
    kamikaze.Update(deltaTime);

    // player bullets vs enemies collisions
    for (let i = player.bullets.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets.bullets[i];
        if (bullet.active) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (CheckCollisionCircle(bullet.position, enemies[j].position, enemies[j].boundingRadius2)) {
                    const enemyKilled = enemies[j].Damage(bullet.damage);

                    player.bullets.Deactivate(bullet);

                    if (enemyKilled) {
                        enemies.splice(j, 1);
                    }
                }
            }
        }
    }

    // enemies spawning
    
    
    if (timeToSpawnEnemyAux <= 0)
    {
        var index = RandomBetweenInt(0, 3);
        var position = enemiesSpawnPoints[index]
        
        let enemy = new Enemy(assets.ships.img, position, 1);
        enemies.push(enemy);

        timeToSpawnEnemyAux = timeToSpawnEnemy;
    }
    else
    {
        timeToSpawnEnemyAux -= deltaTime;
    }
        
    
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

    // draw the kamikaze
    kamikaze.Draw(ctx);

    camera.PostDraw(ctx);

    // crosshair
    ctx.drawImage(assets.crosshair.img, Input.mouse.x - 32, Input.mouse.y - 32);

    // draw the fps
    DrawStats(ctx)
}

function DrawStats(ctx) {
    ctx.textAlign = "start";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(2, 2, 110, 54);
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    
    
    ctx.fillText("FPS: " + fps, 6, 14);
    ctx.fillText("FPS (dt): " + (1 / globalDT).toFixed(2), 6, 32);
    ctx.fillText("deltaTime: " + (globalDT).toFixed(4), 6, 50);
}

window.onload = Init;
