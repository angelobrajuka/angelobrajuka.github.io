let handler, camera;
let playerController, player;

const ObjectID = {
    PLAYER: 0,
    ASTEROID: 1,
    ENEMY: 2,
    LASER: 3
}

function addAsteroid(x, y, minRad=random(5, 60), maxRad=minRad+random(25, 35)) {
    handler.addObject(new GameObject(PhysicsID.ENTITY).setPointsAsRandomPolygon(Math.round(random(8, 14)), minRad, maxRad).setPosition(x, y).applyForce(random(0.1, 1.5), random(0, 360)).applyAngularForce(random(-1, 1)).setOnCollideFunc(onAsteroidCollide).centerPoints(), new ObjectController(new AsteroidStats(), null, onAsteroidTick, null, onAsteroidKill));
}

function genAsteroids(difficulty) {
    const distRatio = 0.2;
    for(var i=0; i<difficulty; i++) {
        addAsteroid(random(0, WIDTH), random(0, HEIGHT*distRatio));
    }
    for(var i=0; i<difficulty; i++) {
        addAsteroid(random(0, WIDTH), random(HEIGHT*(1-distRatio), HEIGHT));
    }
    const whRatio = 0.7;
    for(var i=0; i<difficulty*whRatio; i++) {
        addAsteroid(random(0, WIDTH*distRatio), random(0, HEIGHT));
    }
    for(var i=0; i<difficulty*whRatio; i++) {
        addAsteroid(random(WIDTH*(1-distRatio), WIDTH), random(0, HEIGHT));
    }
}

function gsOnCreate(gs) {
    camera = new Camera().setAccel(0.05);;
    handler = new ObjectHandler();
    handler.gravity = 0;
    genAsteroids(10);

    playerController = new ObjectController(new PlayerStats(), onPlayerInit, onPlayerTick, onPlayerRender, onPlayerKill);
    player = new GameObject(PhysicsID.ENTITY);
    handler.addObject(player, playerController);
}

function gsOnPause(gs) {

}

function gsOnResume(gs) {

}

function gsTick(gs) {
    handler.tickObjects();
    // camera.follow();
    for(var i = 0; i < handler.gameObjects.length; i++) {
        let temp = handler.gameObjects[i];
    }
}

function gsRender(gs) {
    // camera.transform();
    handler.renderObjects();
    // camera.transform_();
}

function gsMouseMoved() {
    // camera.setTarget(getMouseX()-WIDTH/2, getMouseY()-HEIGHT/2, 1);
}

function gsKeyPressed(gs, keyCode) {
    if(playerController.stats.health > 0) onPlayerKeyPressed(player, keyCode);
}

function gsKeyReleased(gs, keyCode) {
    if(playerController.stats.health > 0) onPlayerKeyReleased(player, keyCode);
}
