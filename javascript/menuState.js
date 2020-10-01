
function onPlayButtonClicked() {
    stateMachine.setState(gameState);
}

function msOnCreate(ms) {
    const w = 370;
    const h = 100;
    ms.addButton(WIDTH/2-w/2, HEIGHT/2-h/2, w, h, onPlayButtonClicked, new RGBA(20, 160, 20, 255), null, "PLAY", "space-age", new RGBA(255, 255, 255, 255));
}

function msOnPause(ms) {

}

function msOnResume(ms) {

}

function msTick(ms) {

}

function msRender(ms) {
    
}