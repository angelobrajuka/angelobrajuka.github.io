class AsteroidStats {
    constructor() {
        this.objectID = ObjectID.ASTEROID;
    }
}

function onAsteroidCollide(asteroid, point, object, physicsObject) {
    switch(object.objectController.stats.objectID) {
    case ObjectID.ASTEROID:
        asteroid.physicsObject.bounce(physicsObject, point);
        break;
    }
}

function onAsteroidTick(asteroid, stats) {
    if(!asteroid.isOnScreen(camera)) {
        if(asteroid.getX()+asteroid.getRadius() < leftEdge(camera)) {
            asteroid.setPosition(rightEdge(camera)+asteroid.getRadius(), asteroid.getY());
        } else if(asteroid.getX()-asteroid.getRadius() > rightEdge(camera)) {
            asteroid.setPosition(leftEdge(camera)-asteroid.getRadius(), asteroid.getY());
        }
        if(asteroid.getY()+asteroid.getRadius() < topEdge(camera)) {
            asteroid.setPosition(asteroid.getX(), bottomEdge(camera)+asteroid.getRadius());
        } else if(asteroid.getY()-asteroid.getRadius() > bottomEdge(camera)) {
            asteroid.setPosition(asteroid.getX(), topEdge(camera)-asteroid.getRadius());
        }
    }
}

function onAsteroidKill(asteroid, stats, gameObjects) {
    generateExplosion(handler, camera, asteroid.getX(), asteroid.getY(), 6, 6, 2, 20, 120);

    if(asteroid.getRadius() > 40) {
        addAsteroid(asteroid.getX(), asteroid.getY(), asteroid.getRadius()/3, asteroid.getRadius()/2);
        addAsteroid(asteroid.getX(), asteroid.getY(), asteroid.getRadius()/3, asteroid.getRadius()/2);
    }
}