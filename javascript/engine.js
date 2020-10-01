
let images = new Map();
let sounds = new Map();
let fonts = new Map();

function mLoadImage(name) {
    images[name] = loadImage("res/images/"+name+".png");
}

function mImage(name, x, y, width, height) {
    image(images[name], x, y, width, height);
}

function mLoadSound(name, extension="wav") {
    sounds[name] = loadSound("res/sounds/"+name+"."+extension);
}

function mPlaySound(name) {
    sounds[name].play(0, 1, 1);
}

function mLoadFont(name, extension='otf') {
    fonts[name] = loadFont('res/fonts/'+name+'.'+extension);
}

function mSetFont(name) {
    textFont(fonts[name]);
}
class Camera {
    constructor() {
        this.initDefault();
    }

    initDefault() {
        this.setPos(0, 0);
        this.setTarget(0, 0, 1);
        this.setScale(1);
        this.setAccel(0.05);
    }
    
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    addPos(x, y) {
        this.setPos(this.x+x, this.y+y);
    }

    setScale(scale) {
        this.scale = scale;
    }

    addScale(scale) {
        this.setScale(this.scale+scale);
    }
    
    setAccel(velAccel) {
        this.velAccel = velAccel;
        return this;
    }

    setTarget(tx, ty, tscale) {
        this.tx = tx;
        this.ty = ty;
        this.tscale = tscale;
    }

    follow() {
        this.addPos((this.tx-this.x)*this.velAccel, (this.ty-this.y)*this.velAccel);
        if(Math.abs(this.tx-this.x) <= 0.5) { this.x = this.tx; }
        if(Math.abs(this.ty-this.y) <= 0.5) { this.y = this.ty; }
        this.addScale((this.tscale-this.scale)*this.velAccel*0.2);
    }

    transform() {
        translate(WIDTH/2, HEIGHT/2);
        scale(this.scale);
        translate(-WIDTH/2-this.x, -HEIGHT/2-this.y);
    }

    transform_() {
        translate(WIDTH/2+this.x, HEIGHT/2+this.y);
        scale(1/this.scale);
        translate(-WIDTH/2, -HEIGHT/2);
    }
}
class Collider {
    constructor() {
        this.points = [];
        this.isValid = false;
        this.radius = 0;
    }

    addPoint(x, y) {
        this.points.push(new Point(x, y));
        this.isValid = (this.points.length >= 3);
        
        var temp;
        var tempRadius;
        for(var i=0; i<this.points.length; i++) {
            temp = this.points[i];
            tempRadius = Math.sqrt(temp.x*temp.x + temp.y*temp.y);
            this.radius = (tempRadius > this.radius) ? tempRadius : this.radius;
        }
    }

    setPointsAsRegularPolygon(numOfPoints, radius) {
        this.points.splice(0,this.points.length)
        for(var i=0; i<numOfPoints; i++) {
            this.addPoint(0, -radius);
            this.rotate(360/(numOfPoints));
        }
        this.rotate(180/numOfPoints);
    }

    setPointsAsRandomPolygon(numOfPoints, minRadius, maxRadius) {
        for(var i=0; i<numOfPoints; i++) {
            this.addPoint(0, -random(minRadius, maxRadius));
            this.rotate(360/(numOfPoints));
        }
        this.rotate(180/numOfPoints);
    }

    centerPoints() {
        if(this.points.length < 3) {
            return;
        }
        let longestDist = 0;
        let p1 = this.points[0];
        let p2 = this.points[1];
        let currentDist;
        for(var i = 0; i < this.points.length; i ++) {
            for(var j = 0; j < this.points.length; j ++) {
                if(i == j) continue;
                currentDist = math_dist(this.points[i], this.points[j]);
                if(currentDist > longestDist) {
                    longestDist = currentDist;
                    p1 = this.points[i];
                    p2 = this.points[j];
                }
            }
        }

        let offset = midPoint(p1, p2);

        for(var i = 0; i < this.points.length; i++) {
            this.points[i].x -= offset.x;
            this.points[i].y -= offset.y;
        }
        this.radius = longestDist/2;
    }

    rotate(angle) {
        angle *= Math.PI/180;
        var prevX, prevY;
        for(var i=0; i<this.points.length; i++) {
            prevX = this.points[i].x;
            prevY = this.points[i].y;
            this.points[i].x = prevX*Math.cos(angle) - prevY*Math.sin(angle);
            this.points[i].y = prevX*Math.sin(angle) + prevY*Math.cos(angle);
        }
    }

    collide(x1, y1, collider2, x2, y2) {
        if(this.isValid && collider2.isValid) {
            // both colliders have more than 2 points
            if(x1+this.radius >= x2-collider2.radius && x1-this.radius <= x2+collider2.radius &&
            y1+this.radius >= y2-collider2.radius && y1-this.radius <= y2+collider2.radius) { // squares collide
                if(math_square(this.radius+collider2.radius) >= (math_square(x2-x1)+math_square(y2-y1))) { // circles collide
                    var a, b, c, d;                    
                    
                    for(var i=0; i<this.points.length; i++) {
                        a = this.points[i].add(x1, y1);
                        b = this.points[((i+1)<this.points.length)?(i+1):(0)].add(x1, y1);
                        for(var j=0; j<collider2.points.length; j++) {
                            c = collider2.points[j].add(x2, y2);
                            d = collider2.points[((j+1)<collider2.points.length)?(j+1):(0)].add(x2, y2);

                            let point = linesCollide(a, b, c, d);
                            if(point != null) return point;
                        }
                    }
                }
            }
        } else {
            console.error("Error: colliders must have at least 3 points");
        }
        return null;
    }
}
class RGBA {
    constructor(r, g, b, a) {
        this.setRGBA(r, g, b, a);
    }

    setRGBA(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

function fillRGBA(rgba) {
    fill(rgba.r, rgba.g, rgba.b, rgba.a);
}

function strokeRGBA(rgba) {
    stroke(rgba.r, rgba.g, rgba.b, rgba.a);
}
var g_debugDrawStroke = new RGBA(255, 0, 0, 255);
var g_debugDrawFill = new RGBA(0, 0, 0, 0);
var g_debugDrawPointColor = new RGBA(0, 0, 0, 0);

class GameObject {
    constructor(id) {
        this.objectController = null;
        this.setPhysicsObject(new PhysicsObject(id));
        this.isDead = false;
        this.image = null;
        this.puppet = null;
        this.setRenderOffset(0, 0, 0);
        this.setOnCollideFunc(null);
    }

    setOnCollideFunc(onCollide) {
        this.onCollideFunc = onCollide;
        return this;
    }

    setRenderOffset(x, y, angle) {
        this.renderOffsetX = x;
        this.renderOffsetY = y;
        this.renderAngleOffset = angle;
        return this;
    }

    setImage(image) {
        this.image = image;
        return this;
    }

    setPuppet(puppet) {
        this.puppet = puppet;
        return this;
    }

    setPhysicsObject(physicsObject) {
        this.physicsObject = physicsObject;
        return this;
    }

    setPosition(x, y) {
        this.physicsObject.setPosition(x, y);
        return this;
    }

    getX() {
        return this.physicsObject.x;
    }

    getY() {
        return this.physicsObject.y;
    }

    getAngle() {
        return this.physicsObject.angle;
    }

    getRadius() {
        return this.physicsObject.collider.radius;
    }

    addPoint(x, y) {
        this.physicsObject.collider.addPoint(x, y);
        return this;
    }

    centerPoints() {
        this.physicsObject.collider.centerPoints();
        return this;
    }

    setPointsAsRegularPolygon(numOfPoints, radius) {
        this.physicsObject.setPointsAsRegularPolygon(numOfPoints, radius);
        return this;
    }

    setPointsAsRandomPolygon(numOfPoints, minRadius, maxRadius) {
        this.physicsObject.setPointsAsRandomPolygon(numOfPoints, minRadius, maxRadius);
        return this;
    }

    setFrictionCoefficient(friction) {
        this.physicsObject.setFrictionCoefficient(friction);
        return this;
    }

    applyForce(forceX, forceY) {
        this.physicsObject.applyForce(forceX, forceY);
        return this;
    }

    applyFrictionForce() {
        this.physicsObject.applyFrictionForce();
    }

    applyAngularForce(angularForce) {
        this.physicsObject.applyAngularForce(angularForce);
        return this;
    }

    kill() {
        this.isDead = true;
    }

    isOnScreen(camera=null) {
        if(camera == null) camera = new Camera();
        return (this.getX()+this.getRadius() > leftEdge(camera) && this.getX()-this.getRadius() < rightEdge(camera) && this.getY()+this.getRadius() > topEdge(camera) && this.getY()-this.getRadius() < bottomEdge(camera));
    }

    rotate(angle, objects=null, id=null) {
        this.physicsObject.rotate(objects, id, true, angle);
    }

    move(objects, id) {
        this.physicsObject.move(objects, id);
    }

    tick() {

    }

    debugDraw() {
        if(g_debugDrawFill.a > 0 || g_debugDrawStroke.a > 0) {
            fill(g_debugDrawFill.r, g_debugDrawFill.g, g_debugDrawFill.b, g_debugDrawFill.a);
            stroke(g_debugDrawStroke.r, g_debugDrawStroke.g, g_debugDrawStroke.b, g_debugDrawStroke.a);
            strokeWeight(2);
            var points = this.physicsObject.collider.points;
            beginShape();
            for(var i=0; i<points.length; i++) {
                vertex(points[i].x+this.getX(), points[i].y+this.getY());
            }
            endShape(CLOSE);
        }
        if(g_debugDrawPointColor.a > 0) {
            stroke(g_debugDrawPointColor.r, g_debugDrawPointColor.g, g_debugDrawPointColor.b, g_debugDrawPointColor.a);
            ellipse(this.getX(), this.getY(), 3, 3);
        }
    }

    render() {
        if(this.image != null) {
            translate(this.getX(), this.getY());
            rotate(deg_to_rad(this.getAngle()+this.renderAngleOffset));
            mImage(this.image, 0, 0, this.getRadius()*2, this.getRadius()*2);
            rotate(-deg_to_rad(this.getAngle()+this.renderAngleOffset));
            translate(-this.getX(), -this.getY());
        } else if(this.puppet != null) {
            this.puppet.render(this.getX(), this.getY());
        } else {
            this.debugDraw();
        }
    }
}
var leftMouse = false; // keycode 223
var rightMouse = false; // 224
var middleMouse = false; // 225
var wheelUp = false; // 226
var wheelDown = false; // 227

window.onload = function()
{
    document.addEventListener('contextmenu', (e) => { e.preventDefault(); } );
    window.addEventListener('mousedown', (e) => {
        let code = 0;
        if(e.button === 0) {
            leftMouse = true;
            code = 223;
        } else if(e.button === 1) {
            middleMouse = true;
            code = 225;
        } else if(e.button === 2) {
            rightMouse = true;
            code = 224;
        }
        onKeyPress(code);
    }, false);
    window.addEventListener('mouseup', (e) => {
        let code = 0;
        if(e.button === 0) {
            leftMouse = false;
            code = 223;
        } else if(e.button === 1) {
            middleMouse = false;
            code = 225;
        } else if(e.button === 2) {
            rightMouse = false;
            code = 224;
        }
        onKeyRelease(code);
    }, false);
    window.addEventListener('wheel', (e) => {
        wheelUp = e.deltaY < 0;
        wheelDown = e.deltaY > 0;
        onKeyPress(wheelUp ? 226 : 227);
    });
    window.addEventListener('keydown', (e) => {
        if(!e.repeat) onKeyPress(e.keyCode);
    }, false);
    window.addEventListener('keyup', (e) => {
        if(!e.repeat) onKeyRelease(e.keyCode);
    }, false);
}

// functions for user to define
function onKeyPress(key) {}
function onKeyRelease(key) {}
function onMouseMoved() {}
// 


function getMouseX() {
    return ((mouseX <= 0) ? 0 : ((mouseX >= canvasWidth) ? WIDTH : mouseX/canvasScale));
}

function getMouseY() {
    return ((mouseY <= 0) ? 0 : ((mouseY >= canvasHeight) ? HEIGHT : mouseY/canvasScale));
}

function mouseMoved() {
    onMouseMoved();
}

function mouseDragged() {
    mouseMoved();
}

var keyBinds = new Map();

function setKeybind(name, value) {
    keyBinds[name] = value;
}

function getBindValue(name) {
    return keyBinds[name];
}

function isBindPressed(name) {
    var value = getBindValue(name);
    if(value > 222) {
        switch(value) {
            case 223:
                return leftMouse;
            case 224:
                return rightMouse;
            case 225:
                return middleMouse;
            case 226:
                return wheelUp;
            case 227:
                return wheelDown;
        }
    }
    return keyIsDown(value);
}
function math_square(num) {
    return num*num;
}

function math_map(num, Olow, Ohigh, Nlow, Nhigh) {
    return ((num-Olow)/(Ohigh-Olow))*(Nhigh-Nlow)+Nlow;
}

function math_dist(a, b) {
    return Math.sqrt(math_square(a.x-b.x)+math_square(a.y-b.y));
}

function math_higher(a, b) {
    return (a > b) ? a : b;
}

function midPoint(a, b) {
    return new Point((a.x+b.x)/2, (a.y+b.y)/2);
}

function linesCollide(a, b, c, d) {
    // calculate the distance to intersection point
    let uA = ((d.x-c.x)*(a.y-c.y) - (d.y-c.y)*(a.x-c.x)) / ((d.y-c.y)*(b.x-a.x) - (d.x-c.x)*(b.y-a.y));
    let uB = ((b.x-a.x)*(a.y-c.y) - (b.y-a.y)*(a.x-c.x)) / ((d.y-c.y)*(b.x-a.x) - (d.x-c.x)*(b.y-a.y));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

        // optionally, draw a circle where the lines meet
        let intersectionX = a.x + (uA * (b.x-a.x));
        let intersectionY = a.y + (uA * (b.y-a.y));

        return new Point(intersectionX, intersectionY);
    }
    return null;
}

function deg_to_rad(degrees) {
    return degrees * Math.PI / 180;
}

function rad_to_deg(rad) {
    return rad * 180 / Math.PI;
}

function math_xyToAngle(x, y) {
    let angle;
    if(x == 0) {
        angle = ((y > 0) ? 270 : 90);
    } else if(y == 0) {
        angle = ((x > 0) ? 0 : 180);
    } else {
        angle = rad_to_deg(Math.atan(-y / x));
        if(x < 0) {
            angle += 180;
        }
    }

    return angle;
}

function math_getAngleFromArrowKeys() {
    let signX = 0;
    let signY = 0;
    if(keyIsDown(LEFT_ARROW)) {
        signX --;
    }
    if(keyIsDown(RIGHT_ARROW)) {
        signX ++;
    }
    if(keyIsDown(UP_ARROW)) {
        signY --;
    }
    if(keyIsDown(DOWN_ARROW)) {
        signY ++;
    }
    return math_xyToAngle(signX, signY);
}

function xor(foo, bar) {
    return foo ? !bar : bar;
  }
class ObjectController {
    constructor(stats, onInit, onTick, onRender, onKill) {
        this.stats = stats;
        this.onInit = onInit;
        this.onTick = onTick;
        this.onRender = onRender;
        this.onKill = onKill;
        this.setObject(null);
    }

    setObject(object) {
        this.object = object;
        if(this.object != null && this.onInit != null) {
            this.onInit(this.object, this.stats);
        }
    }

    tick() {
        if(this.object != null && this.onTick != null) this.onTick(this.object, this.stats);
    }

    render() {
        if(this.object != null && this.onRender != null) this.onRender(this.object, this.stats);
    }

    kill(objectHandler) {
        if(this.object != null && this.onKill != null) this.onKill(this.object, this.stats, objectHandler);
    }
}
class ObjectHandler {
    constructor() {
        this.gameObjects = [];
        this.gravity = 0.98;
        this.gravityDirection = 270;
    }

    addObject(object, controller=null) {
        this.gameObjects.push(object);
        if(controller != null) {
            controller.setObject(object);
            object.objectController = controller;
        }
    }

    tickObjects() {
        for(var i=0; i<this.gameObjects.length; i++) {
            this.gameObjects[i].tick();
            if(this.gameObjects[i].objectController != null) {
                this.gameObjects[i].objectController.tick();
            }
            this.gameObjects[i].applyFrictionForce();
            this.gameObjects[i].physicsObject.applyForce(this.gravity, this.gravityDirection);
            this.gameObjects[i].physicsObject.rotate(this.gameObjects, i, true);
            this.gameObjects[i].move(this.gameObjects, i, true);
            if(this.gameObjects[i].isDead) {
                if(this.gameObjects[i].objectController != null) this.gameObjects[i].objectController.kill(this);
                this.gameObjects.splice(i, 1);
                i --;
            }
        }
    }

    renderObjects() {
        for(var i=0; i<this.gameObjects.length; i++) {
            this.gameObjects[i].render();
            if(this.gameObjects[i].objectController != null) this.gameObjects[i].objectController.render();
        }
    }
}
class ParticleStat {
    constructor(cameraReference=null, maxLife=70) {
        this.life = 0;
        this.maxLife = maxLife;
        this.cameraReference = cameraReference;
    }
}

function particleOnTickDefault(particle, stats=particle.objectController.stats) {
    stats.life ++;
    if(!particle.isOnScreen(stats.cameraReference) || stats.life >= stats.maxLife) {
        particle.kill();
    }
}

function generateParticle(objectHandler, particle, cameraReference, maxLife=70, onTick=particleOnTickDefault) {
    objectHandler.addObject(particle, new ObjectController(new ParticleStat(cameraReference, maxLife), null, onTick, null, null));
}

function generateExplosion(objectHandler, cameraReference, x, y, num, force, variation, maxLifeMin, maxLifeMax, onCollideFunc=null) {
    for(var i = 0; i < num; i ++) {
        generateParticle(objectHandler, new GameObject(PhysicsID.PARTICLE).setPointsAsRegularPolygon(3, 2).setPosition(x, y).applyForce(force+random(-variation, variation), random(0, 360)).setOnCollideFunc(onCollideFunc), cameraReference, random(maxLifeMin, maxLifeMax));
    }
}
const PhysicsID = {
    STATIC_OBJECT: 0,
    PARTICLE: 1,
    ENTITY: 2
}

class PhysicsObject {
    constructor(id) {
        this.setPosition(0, 0);
        this.setCollider(new Collider());
        this.setVelocity(0, 0);
        this.setID(id);
        this.setAngle(0);
        this.setAngularVelocity(0);
        this.setFrictionCoefficient(0);
        this.isOnGround = false;
    }

    setID(id) {
        this.physicsID = id;
        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    setAngle(angle) {
        this.collider.rotate(-this.angle);
        this.angle = angle;
        this.collider.rotate(this.angle);
        return this;
    }

    setAngularVelocity(angularVelocity) {
        this.angularVelocity = angularVelocity;
        return this;
    }

    setFrictionCoefficient(friction) {
        this.friction = friction;
        return this;
    }

    applyAngularForce(angularForce) {
        this.setAngularVelocity(this.angularVelocity+angularForce);
    }

    checkCollisions(objects, id) {
        var temp;
        for(var i=0; i<objects.length; i++) {
            if(i != id) {
                temp = objects[i].physicsObject;
                let point = this.collider.collide(this.x, this.y, temp.collider, temp.x, temp.y);
                if(point != null) {
                    let thiscpy = new PhysicsObject().setPosition(this.x, this.y).setVelocity(this.velX, this.velY).setAngle(this.angle).setAngularVelocity(this.angularVelocity).setID(this.physicsID).setFrictionCoefficient(this.friction);
                    let obj2cpy = new PhysicsObject().setPosition(temp.x, temp.y).setVelocity(temp.velX, temp.velY).setAngle(temp.angle).setAngularVelocity(temp.angularVelocity).setID(temp.physicsID).setFrictionCoefficient(temp.friction);
                    if(objects[id].onCollideFunc != null) objects[id].onCollideFunc(objects[id], point, objects[i],  obj2cpy);
                    if(objects[i].onCollideFunc != null)   objects[i].onCollideFunc(objects[i],  point, objects[id], thiscpy);
                }
            }
        }
    }

    rotate(objects=null, id=null, checkCollisions=false, angle=this.angularVelocity) {
        if(objects == null || id == null || this.onCollideFunc == null) {
            this.collider.rotate(angle);
            this.angle += angle;
            return;
        }
        let steps = round(Math.abs(angle));
        if(steps == 0) {
            steps = 1;
        }
        let step = angle/steps;
        
        for(var i = 0; i < steps; i ++) {
            this.angle += step;
            this.collider.rotate(step);
            if(checkCollisions) this.checkCollisions(objects, id);
        }
    }

    avgVel(vel, angle) {
        
    }

    bounce(that, point) {
        this.applyForce(-this.getVel(), this.getVelAngle()-180);
        this.applyForce(that.getVel(), math_xyToAngle(point.x-that.x, point.y-that.y));
    }

    move(objects, id, checkCollisions=true, velX=this.velX, velY=this.velY) {
        if(objects === null || id === null || this.onCollideFunc === null) {
            this.setPosition(this.x+velX, this.y+velY);
            return;
        }
        
        let xSteps = Math.abs(velX);
        let ySteps = Math.abs(velY);

        let steps = round(math_higher(xSteps, ySteps));
        if(steps == 0) steps = 1;

        let xStep = velX/steps;
        let yStep = velY/steps;
        
        for(var i = 0; i < steps; i ++) {
            this.setPosition(this.x+xStep, this.y+yStep);
            if(checkCollisions) this.checkCollisions(objects, id);
        }
    }

    setVelocity(velX, velY) {
        this.velX = velX;
        this.velY = velY;
        return this;
    }

    applyForce(force, angle) {
        angle = deg_to_rad(angle);
        let forceX = Math.cos(angle)*force;
        let forceY = -Math.sin(angle)*force;
        this.setVelocity(this.velX+forceX, this.velY+forceY);
    }

    getVel() {
        return Math.sqrt(math_square(this.velX)+math_square(this.velY));
    }

    getVelAngle() {
        return math_xyToAngle(this.velX, this.velY)+180;
    }

    applyFrictionForce() {
        this.applyForce(this.getVel()*this.friction, this.getVelAngle());
        this.applyAngularForce(-this.angularVelocity*this.friction);
        if(0 < Math.abs(this.velX) <= this.friction) {
            this.velX = 0;
        }
        if(0 < Math.abs(this.velY) <= this.friction) {
            this.velY = 0;
        }
        if(0 < Math.abs(this.angularVelocity) <= this.friction) {
            this.angularVelocity = 0;
        }
    }

    applyGravitationalForce() {
        if(!this.isOnGround) this.applyForce(g_gravity, g_gravityDirection);
    }

    setCollider(collider) {
        this.collider = collider;
    }

    addPoint(x, y) {
        this.collider.addPoint(x, y);
    }

    setPointsAsRegularPolygon(numOfPoints, radius) {
        this.collider.setPointsAsRegularPolygon(numOfPoints, radius);
    }

    setPointsAsRandomPolygon(numOfPoints, minRadius, maxRadius) {
        this.collider.setPointsAsRandomPolygon(numOfPoints, minRadius, maxRadius);
    }
}
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(x, y) {
        return new Point(this.x+x, this.y+y);
    }
}
class Limb {

}

class Puppet {
    
}
function draw() {
    tick();
    if(wheelUp)
        onKeyRelease(226);
    if(wheelDown)
        onKeyRelease(227);
    wheelDown = false;
    wheelUp = false;
}

function tick() {}
class Button {
    constructor() {
        this.setPosition(0, 0);
        this.setSize(0, 0);
        this.setOnClick(null);
        this.setColor(null);
        this.setText(null, null, null);
        this.setImage(null);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }

    setOnClick(onClick) {
        this.onClick = onClick;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setText(text, textFont, textColor) {
        this.text = text;
        this.textFont = textFont;
        this.textColor = textColor;
        return this;
    }

    setImage(image) {
        this.image = image;
        return this;
    }

    mouseIsHovering() {
        return (getMouseX() > this.x && getMouseX() < this.x+this.width && getMouseY() > this.y && getMouseY() < this.y+this.height);
    }

    pressed() {
        return (this.mouseIsHovering() && leftMouse);
    }

    render() {
        if(this.color != null) {
            fill(this.color.r, this.color.g, this.color.b, this.color.a);
            rect(this.x, this.y, this.width, this.height);
        }
        if(this.image != null) {
            mRenderImage(this.image, this.x, this.y, this.width, this.height);
        }
        if(this.text != null && this.textFont != null && this.textColor != null) {
            fill(this.textColor.r, this.textColor.g, this.textColor.b, this.textColor.a);
            textSize(this.height);
            mSetFont(this.textFont);
            textAlign(CENTER, CENTER);
            text(this.text, this.x+this.width/2, this.y+this.height/2);
        }
    }
}

class State {
    constructor(onPause, onResume, onTick, onRender, onMouseMoved, onKeyPressed, onKeyReleased) {
        this.buttons = [];
        this.onPause = onPause;
        this.onResume = onResume;
        this.onTick = onTick;
        this.onRender = onRender;
        this.onMouseMoved = onMouseMoved;
        this.onKeyPressed = onKeyPressed;
        this.onKeyReleased = onKeyReleased;
    }

    addButton(x, y, width, height, onClick, color, image, text, textFont, textColor) {
        this.buttons.push(new Button().setPosition(x, y).setSize(width, height).setOnClick(onClick).setColor(color).setImage(image).setText(text, textFont, textColor));
    }

    mouseMoved() {
        for(var i = 0; i < this.buttons.length; i ++) {
            if(this.buttons[i].mouseIsHovering()) {

            }
        }

        if(this.onMouseMoved != null) this.onMouseMoved(this);
    }

    keyPressed(keyCode) {
        if(keyCode == 223) {
            for(var i = 0; i < this.buttons.length; i ++) {
                if(this.buttons[i].pressed()) {
                    this.buttons[i].onClick();
                }
            }
        }

        if(this.onKeyPressed != null) this.onKeyPressed(this, keyCode);
    }

    keyReleased(keyCode) {


        if(this.onKeyReleased != null) this.onKeyReleased(this, keyCode);
    }

    tick() {


        this.onTick(this);
    }

    render() {
        for(var i = 0; i < this.buttons.length; i ++) {
            this.buttons[i].render();
        }

        this.onRender(this);
    }
}
class StateMachine {
    constructor() {
        
    }
    
    init(firstState) {
        this.currentState = firstState;
    }

    setState(state) {
        if(this.currentState.onPause != null) this.currentState.onPause();
        this.currentState = state;
        if(this.currentState.onResume != null) this.currentState.onResume();
    }

    tick() {
        if(this.currentState.tick != null) this.currentState.tick();
        if(this.currentState.render != null) this.currentState.render();
    }
}


let cnv;
let maxWidth, maxHeight, canvasWidth, canvasHeight, canvasScale;
let RATIO, HEIGHT, WIDTH;

function leftEdge(camera=null) {
	if(camera==null) return 0;
	return camera.x+WIDTH/2-WIDTH/2/camera.scale;
}

function rightEdge(camera=null) {
	if(camera==null) return WIDTH;
	return camera.x+WIDTH/2+WIDTH/2/camera.scale;
}

function topEdge(camera=null) {
	if(camera==null) return 0;
	return camera.y+HEIGHT/2-HEIGHT/2/camera.scale;
}

function bottomEdge(camera=null) {
	if(camera==null) return HEIGHT;
	return camera.y+HEIGHT/2+HEIGHT/2/camera.scale;
}

function windowInit(canvasRatio, canvasHeight) {
    RATIO = canvasRatio;
    HEIGHT = canvasHeight;
    WIDTH = HEIGHT*RATIO;
    setCanvas(createCanvas(0, 0));
    windowResized();
    pixelDensity(1);
	imageMode(CENTER);
}

function setCanvas(n_cnv) {
	cnv = n_cnv;
}

function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
}

function windowResized() {
	var maxWidth = windowWidth;
	var maxHeight = windowHeight;

	if (maxWidth <= maxHeight * 4 / 3) {
		// tall - height set based on width
		canvasWidth = maxWidth;
		canvasHeight = canvasWidth / RATIO;
		canvasScale = canvasWidth / WIDTH;
	} else {
		// wide - width set based on height
		canvasHeight = maxHeight;
		canvasWidth = canvasHeight * RATIO;
		canvasScale = canvasHeight / HEIGHT;
	}

	resizeCanvas(canvasWidth, canvasHeight);
	centerCanvas();
}
