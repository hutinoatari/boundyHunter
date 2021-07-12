const canvas = document.getElementById("screen");
const fullscreenButton = document.getElementById("fullscreenButton");
fullscreenButton.onclick = () => canvas.requestFullscreen();
// 確認用canvas
const axesCanvas = document.getElementById("axesScreen");
axesCanvas.width = 320;
axesCanvas.height = 240;

window.addEventListener("gamepadconnected", () => game.start());

class Game {
    constructor(){
        this.fps = 30;
        this.scene = null;
        this.currentFrame = 0;
        this.canvas = canvas;
        this.canvas.width = 320;
        this.canvas.height = 240;
        this.playing = false;
    }

    start(){
        if(this.playing) return;
        this.playing = true;
        setInterval(this.step.bind(this), 1000 / this.fps);
    }

    step(){
        this.clearScreen();
        // 開発環境のindex0はタイプカバー
        const gamepad = navigator.getGamepads()[1];
        const inputLW = gamepad.axes[1];
        const inputLH = -gamepad.axes[0];
        const inputRW = -gamepad.axes[3];
        const inputRH = gamepad.axes[2];
        
        // 入力確認用
        const context = axesCanvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, axesCanvas.width, axesCanvas.height);
        context.fillStyle = "black";
        context.beginPath();
        context.moveTo(axesCanvas.width/4, axesCanvas.height/2);
        context.lineTo(axesCanvas.width/4 + inputLW*40, axesCanvas.height/2 + inputLH*40);
        context.stroke();
        context.beginPath();
        context.moveTo(axesCanvas.width*3/4, axesCanvas.height/2);
        context.lineTo(axesCanvas.width*3/4 + inputRW*40, axesCanvas.height/2 + inputRH*40);
        context.stroke();
    }

    clearScreen(){
        const context = this.canvas.getContext("2d");
        context.fillStyle = "lightgray";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const game = new Game();
