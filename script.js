let outputWidth;
let outputHeight;

let faceTracker;
let videoInput;

let imgDicaprio;
let imgHill;

let selected = -1;

function preload() {
    imgDicaprio = loadImage('./img/wallstwolf_mask.png');
    imgHill = loadImage('./img/wallstwolf_mask2.png');
}

function setup() {
    //создание холста
    const maxWidth = Math.min(windowWidth, windowHeight);
    pixelDensity(1);
    outputHeight = maxWidth * 0.75;
    outputWidth = maxWidth;
    createCanvas(outputWidth, outputHeight)

    //захват видеопотока
    videoInput = createCapture(VIDEO);
    videoInput.size(outputWidth, outputHeight);
    videoInput.hide()

    //селектор фильтров
    const sel = createSelect();
    const selectList = ['Dicaprio', 'Hill'];
    sel.option('Select Filter', -1);
    for (let i = 0; i < selectList.length; i++) {
        sel.option(selectList[i], i);
    }
    sel.changed(applyFilter);

    faceTracker = new clm.tracker();
    faceTracker.init();
    faceTracker.start(videoInput.elt)
}

function applyFilter() {
    selected = this.selected();
}

function draw() {
    image(videoInput, 0, 0, outputWidth, outputHeight);

    switch (selected) {
        case '-1' : break;
        case '0' : drawDicaprio(); break;
        case '1' : drawHill(); break;
    }
}

function drawDicaprio() {
    const positions = faceTracker.getCurrentPosition();
    if (positions !== false) {
        push();
        const wx = Math.abs(positions [13][0] - positions [1][0]) * 1.8;
        const wy = Math.abs(positions [7][1] - Math.min(positions [16][1], positions [20][1])) * 1.8;
        translate(-wx/2, -wy/2);
        image(imgDicaprio, positions [62][0], positions [62][1], wx, wy);
        pop();
    }
}

function drawHill() {
    const positions = faceTracker.getCurrentPosition();
    if (positions !== false) {
        push();
        const wx = Math.abs(positions [13][0] - positions [1][0]) * 1.8;
        const wy = Math.abs(positions [7][1] - Math.min(positions [16][1], positions [20][1])) * 1.8;
        translate(-wx/2, -wy/2);
        image(imgHill, positions [62][0], positions [62][1], wx, wy);
        pop();
    }
}

function windowResized() {
    const maxWidth = Math.min(windowWidth, windowHeight);
    pixelDensity(1);
    outputHeight = maxWidth * 0.75;
    outputWidth = maxWidth;
    resizeCanvas (outputWidth, outputHeight);
}