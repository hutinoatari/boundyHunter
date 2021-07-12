const canvas = document.getElementById("screen");
const fullscreenButton = document.getElementById("fullscreenButton");
fullscreenButton.onclick = () => canvas.requestFullscreen();

window.addEventListener("gamepadconnected", () => game.start());

const degToRad = (deg) => deg * (Math.PI / 180);
const radToDeg = (rad) => rad / (Math.PI / 180);

class Player {
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 1;
        this.color = color;
        this.size = 12;
        this.r = this.size/2;
        this.jumping = false;
    }

    step(w, h, a){
        this.vx += this.ax;
        this.x += this.vx;
        this.vy += this.ay;
        this.y += this.vy;

        if(a){
            const inputSize = (w**2 + h**2)**0.5;
            const kickX = this.x + 12/inputSize*w;
            const kickY = this.y + 12/inputSize*h;
            if(kickX<12 || 308<kickX || kickY<12 || 228<kickY){
                const v = (this.vx**2 + this.vy**2)**0.5 * 1.1 + 6;
                this.vx = w*v/inputSize;
                this.vy = h*v/inputSize;
            }
        }

        if(this.x-this.r < 12){
            this.x = 12 + this.r;
            this.vx *= -0.7;
        }
        if(this.x+this.r > 308){
            this.x = 308 - this.r;
            this.vx *= -0.7;
        }
        if(this.y-this.r < 12){
            this.y = 12 + this.r;
            this.vy *= -0.7;
        }
        if(this.y+this.r > 228){
            this.y = 228 - this.r;
            this.vy *= -0.7;
        }
    }

    render(canvas, w, h){
        const context = canvas.getContext("2d");
        context.fillStyle = this.color;
        context.translate(this.x, this.y);
        if(w!==0 || h!==0){
            context.rotate(Math.atan2(h, w) + degToRad(90));
            context.scale(1, 0.7);
        }
        context.beginPath();
        context.arc(0, 0, this.r, 0, 2*Math.PI);
        context.fill();
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

class Game {
    constructor(){
        this.fps = 30;
        this.canvas = canvas;
        this.canvas.width = 320;
        this.canvas.height = 240;
        this.playing = false;

        this.player1 = new Player(30, 210, "red");
        //this.player2 = new Player(290, 210, "blue");
    }

    start(){
        if(this.playing) return;
        this.playing = true;
        setInterval(this.step.bind(this), 1000 / this.fps);
    }

    step(){
        this.drawBack();
        // 開発環境のindex0はタイプカバー
        const gamepad = navigator.getGamepads()[1];
        const inputLW = gamepad.axes[1];
        const inputLH = -gamepad.axes[0];
        const inputLA = gamepad.buttons[13].pressed;
        const inputRW = -gamepad.axes[3];
        const inputRH = gamepad.axes[2];
        const inputRA = gamepad.buttons[3].pressed;

        this.player1.step(inputLW, inputLH, inputLA);
        //this.player2.step(inputRW, inputRH, inputRA);
        this.player1.render(this.canvas, inputLW, inputLH);
        //this.player2.render(this.canvas, inputRW, inputRH);
    }

    drawBack(){
        const context = this.canvas.getContext("2d");
        context.fillStyle = "lightgray";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = "gray";
        context.fillRect(0, 0, 12, this.canvas.height);
        context.fillRect(this.canvas.width, 0, -12, this.canvas.height);
        context.fillRect(0, 0, this.canvas.width, 12);
        context.fillRect(0, this.canvas.height, this.canvas.width, -12);
    }
}

const game = new Game();
