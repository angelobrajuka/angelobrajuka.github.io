function onPlayerInit(player) {
    player.addPoint(40, 0).addPoint(-24, 24).addPoint(-10, 0).addPoint(-24, -24);
    player.setPosition(WIDTH/2, HEIGHT/2).setFrictionCoefficient(PLAYER_FRICTION).setOnCollideFunc(onPlayerCollide);
    player.rotate(-90);
}

function arrowPressed() {
    return (xor(keyIsDown(LEFT_ARROW), keyIsDown(RIGHT_ARROW)) || xor(keyIsDown(UP_ARROW), keyIsDown(DOWN_ARROW)));
}

function fireLaser(player) {
    handler.addObject(new GameObject(ObjectID.LASER).setPointsAsRegularPolygon(3, 7).setPosition(player.getX()+player.physicsObject.collider.points[0].x, player.getY()+player.physicsObject.collider.points[0].y).applyForce(12, 360-player.getAngle()).applyForce(player.physicsObject.getVel(), player.physicsObject.getVelAngle()-180).applyAngularForce(random(-1, 1)).setOnCollideFunc(onLaserCollide), new ObjectController(new LaserStats(), null, onLaserTick, null, null));
}

function onPlayerTick(player, playerStats=player.objectController.stats) {
    if(playerStats.thrust || playerStats.thrustClockwise || playerStats.thrustCounterCl) {
        player.physicsObject.applyForce(playerStats.thrust ? PLAYER_ACCEL_FORCE : 0, 360-player.getAngle());
        generateParticle(
        handler, 
        new GameObject().setPointsAsRegularPolygon(3, 3)
            .setPosition(player.physicsObject.collider.points[2].x+player.getX(), player.physicsObject.collider.points[2].y+player.getY())
            .applyForce(random(5, 10), 180-player.getAngle()+random(-15, 15)), 
        camera, random(3, 7));
        
        let angularForce = 0;
        angularForce += (playerStats.thrustCounterCl ? -PLAYER_ANGULAR_ACCEL_FORCE : 0);
        angularForce += (playerStats.thrustClockwise ?  PLAYER_ANGULAR_ACCEL_FORCE : 0);
        player.applyAngularForce(angularForce);
    }
    camera.setTarget(player.getX()-WIDTH/2, player.getY()-HEIGHT/2, math_map((CAMERA_SCALE_FACTOR-Math.abs(player.physicsObject.getVel()))/CAMERA_SCALE_FACTOR, 1/(CAMERA_SCALE_FACTOR+1), 1.0, 0.6, 1.0));
}

function onPlayerKeyPressed(player, keyCode, playerStats=player.objectController.stats) {
    if(keyCode == getBindValue("thrust")) {
        playerStats.thrust = true;
    } else if(keyCode == getBindValue("rotate_left")) {
        playerStats.thrustCounterCl = true;
    } else if(keyCode == getBindValue("rotate_right")) {
        playerStats.thrustClockwise = true;
    } else if(keyCode == getBindValue("shoot") && playerStats.canShoot) {
        playerStats.justShot = true;
        fireLaser(player);
    }
}

function onPlayerKeyReleased(player, keyCode, playerStats=player.objectController.stats) {
    if(keyCode == getBindValue("thrust")) {
        playerStats.thrust = false;
    } else if(keyCode == getBindValue("rotate_left")) {
        playerStats.thrustCounterCl = false;
    } else if(keyCode == getBindValue("rotate_right")) {
        playerStats.thrustClockwise = false;
    } else if(keyCode == getBindValue("shoot")) {
        playerStats.justShot = false;
    }
}

function onPlayerCollide(player, point, object, physicsObject) {
    switch(object.objectController.stats.objectID) {
    case ObjectID.ASTEROID:
        player.kill();
        break;
    }
}

function onPlayerRender(player, playerStats) {

}

function onPlayerKill(player, playerStats, objectHandler=handler) {
    generateExplosion(objectHandler, camera, player.getX(), player.getY(), 12, 5, 1, 30, 150);
    playerStats.health = 0;
}

class PlayerStats {
    constructor() {
        this.objectID = ObjectID.PLAYER;
        this.health = 100;
        this.justShot = false;
        this.thrust = false;
        this.thrustClockwise = false;
        this.thrustCounterCl = false;
    }

    canShoot() {
        return !this.justShot;
    }
}