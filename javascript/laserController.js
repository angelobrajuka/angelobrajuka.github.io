class LaserStats {
    constructor() {
        this.objectID = ObjectID.LASER;
    }
}

function onLaserCollide(laser, point, object) {
    switch(object.objectController.stats.objectID) {
    case ObjectID.ASTEROID:
        object.kill();

        laser.kill();
        break;
    }
}

function onLaserTick(laser, laserStats) {
    if(!laser.isOnScreen(camera)) {
        laser.kill();
    }
}