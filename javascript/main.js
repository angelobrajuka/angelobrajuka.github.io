

function preload() {
	// load sounds


	// load images


	// load fonts
	mLoadFont("space-age");
}

var stateMachine;
var gameState, menuState;

function setup() {
	windowInit(16/9, 1080);
	g_debugDrawFill.setRGBA(255, 255, 255, 0);
	g_debugDrawStroke.setRGBA(255, 255, 255, 255);
	g_debugDrawPointColor.setRGBA(255, 255, 255, 0);

	setKeybind("shoot", 32); // space bar
	setKeybind("thrust", 38); // up arrow
	setKeybind("rotate_right", 39); // right arrow
	setKeybind("rotate_left", 37); // left arrow

	gameState = new State(gsOnPause, gsOnResume, gsTick, gsRender, gsMouseMoved, gsKeyPressed, gsKeyReleased);
	gsOnCreate(gameState);
	menuState = new State(msOnPause, msOnResume, msTick, msRender, null, null, null);
	msOnCreate(menuState);
	
	stateMachine = new StateMachine();
	stateMachine.init(menuState);
	// mPlaySound("soundtrack");
}

function tick() {
	background(0);
	scale(canvasScale);
	stateMachine.tick();
}

function onKeyPress(key) {
	stateMachine.currentState.keyPressed(key);
}

function onKeyRelease(key) {
	stateMachine.currentState.keyReleased(key);
}

function onMouseMoved() {
	stateMachine.currentState.mouseMoved();
}