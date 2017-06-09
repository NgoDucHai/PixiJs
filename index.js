var Container           = PIXI.Container,
    autoDetectRenderer  = PIXI.autoDetectRenderer,
    loader              = PIXI.loader,
    resources           = PIXI.loader.resources,
    Sprite              = PIXI.Sprite;


var renderer    = autoDetectRenderer(500,500),
    stage       = new Container();



document.body.appendChild(renderer.view);

loader.add("image/bunny.png")
      .add("image/bg.jpg")
            .load(setup);
var bunny;
var bg;
var corner = -1;
function setup() {
    bunny = new Sprite(
        resources["image/bunny.png"].texture
    );
    bg = new Sprite(
        resources["image/bg.jpg"].texture
    );
    bg.width = 500;
    bg.height = 500;
    bunny.interactive = true;
    bunny.buttonMode = true;
    bunny.anchor.set(0.5);

    bunny.x = 50;
    bunny.y = 50;

    bunny.width = 50;
    bunny.height = 50;

    bunny.vx = 0;
    bunny.vy = 0;

    bunny
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)
        .on('mousemove', onMove);

    stage.addChild(bg);
    stage.addChild(bunny);

    var left    = keyboard(37),
        up      = keyboard(38),
        right   = keyboard(39),
        down    = keyboard(40);

    left.press = function() {

        bunny.vx = -5;
        bunny.vy = 0;
    };

    left.release = function() {

        if (!right.isDown && bunny.vy === 0) {
            bunny.vx = 0;
        }
    };

    up.press = function() {
        bunny.vy = -5;
        bunny.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && bunny.vx === 0) {
            bunny.vy = 0;
        }
    };

    right.press = function() {
        bunny.vx = 5;
        bunny.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && bunny.vy === 0) {
            bunny.vx = 0;
        }
    };

    down.press = function() {
        bunny.vy = 5;
        bunny.vx = 0;
    };
    down.release = function() {
        if (!up.isDown && bunny.vx === 0) {
            bunny.vy = 0;
        }
    };

    state = play;

    gameLoop();
}


function gameLoop() {
    requestAnimationFrame(gameLoop);
    state();
    renderer.render(stage);
}

function play() {
    // bunny.rotation += corner*0.05;
    bunny.x += bunny.vx;
    bunny.y += bunny.vy;
}

function onDragStart(event) {
    corner = -corner;
    this.scale.x *= 1.3;
    this.scale.y *= 1.3;
    this.data = event.data;
    this.alpha = 0.5;
    this.drangging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.scale.x /= 1.3;
    this.scale.y /= 1.3;
    this.drangging = false;
    this.data = null;
}

function onDragMove() {
    if(this.drangging){
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

function onMove(event) {
    if(corner){
        const x = event.data.global.x;
        const y = event.data.global.y;
        bunny.rotation = Math.atan2(y - bunny.y, x - bunny.x);

    }
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

