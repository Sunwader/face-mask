let outputWidth;
let outputHeight;

let faceTracker;
let videoInput;

let imgDicaprio;
let imgHill;

let selected = -1; //без фильтра по умолчанию

//загрузка изображений для масок
function preload() {
    imgDicaprio = loadImage('./img/wallstwolf_mask.png');
    imgHill = loadImage('./img/wallstwolf_mask2.png');
}

//создание исходного пользовательского интерфейса
function setup() {
    //создание холста
    const maxWidth = Math.min(windowWidth, windowHeight);
    pixelDensity(1);
    outputHeight = maxWidth * 0.75; //разрешение 4/3
    outputWidth = maxWidth;

    createCanvas(outputWidth, outputHeight)

    //захват видеопотока с помощью библиотеки p5
    videoInput = createCapture(VIDEO);
    videoInput.size(outputWidth, outputHeight);
    videoInput.hide()

    //создание селектора фильтров
    const sel = createSelect();
    const selectList = ['Dicaprio', 'Hill']; //массив масок
    sel.option('Select Filter', -1); //дефолтное состояние
    for (let i = 0; i < selectList.length; i++) {
        sel.option(selectList[i], i);
    }
    sel.changed(applyFilter);

    //создание фейстрекера - устр-ва отслеживания лица
    faceTracker = new clm.tracker();
    faceTracker.init();
    faceTracker.start(videoInput.elt)
}

//меняем тип фильтра
function applyFilter() {
    selected = this.selected();
}

//рисование видео и фильтров
function draw() {

    //рендерим видео с камеры
    image(videoInput, 0, 0, outputWidth, outputHeight);

    //определяем выбранный фильтр
    switch (selected) {
        case '-1' : break;
        case '0' : drawDicaprio(); break;
        case '1' : drawHill(); break;
    }
}

//отрисовка маски Ди Каприо
function drawDicaprio() {
    //определение лица
    const positions = faceTracker.getCurrentPosition();
    //использование библиотеки p5 для рендеринга лица по координатам
    if (positions !== false) {
        push();
        const wx = Math.abs(positions [13][0] - positions [1][0]) * 1.8;
        const wy = Math.abs(positions [7][1] - Math.min(positions [16][1], positions [20][1])) * 1.8;
        translate(-wx/2, -wy/2);
        image(imgDicaprio, positions [62][0], positions [62][1], wx, wy);
        pop();
    }
}

//отрисовка маски Хилла
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

//отображение масок при изменении размера экрана
function windowResized() {
    const maxWidth = Math.min(windowWidth, windowHeight);
    pixelDensity(1);
    outputHeight = maxWidth * 0.75;
    outputWidth = maxWidth;
    resizeCanvas (outputWidth, outputHeight);
}