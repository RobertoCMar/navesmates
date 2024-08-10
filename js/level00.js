
const canvas = document.getElementById("tablero");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d");
ctx.fillStyle = "red"
ctx.fillRect(canvas.width/2, 0, 5, canvas.height)
class gameArea{
   constructor({x = 0, y = 0, w, h, c = "red", speed = 10}){
        this.keyPressed = false,
        this.key = null,
        this.player = new player(x, y, w, h, c, speed),
        this.control()
   }

    control(){
       window.addEventListener("keydown", (k) => {
            this.keyPressed = true;
            this.key = k.code;
        })

        window.addEventListener("keyup", () => {
            this.keyPressed = false;
            this.key = null;
        })
    }

    motion(){
        if(this.key == "ArrowDown" || this.key == "KeyS"){
            this.player.moveY(1)
        } else if(this.key == "ArrowUp" || this.key == "KeyW"){
            this.player.moveY(-1);
        } else if(this.key == "ArrowRight" || this.key == "KeyD"){
            this.player.moveX(1);
        } else if(this.key == "ArrowLeft" || this.key == "KeyA"){
            this.player.moveX(-1);
        }
    }

    update(){
        this.player.clear();
        this.motion()
        this.player.draw()
        requestAnimationFrame( () => this.update() )
    }
}

class player{
    constructor(x, y, w, h, c, speed) {
        this.x = x,
        this.y = y,
        this.w = w,
        this.h = h,
        this.c = c,
        this.speed = speed
    };

    moveY(y) {
        if (this.y + this.speed * y >= 0 && this.y + this.speed * y + this.h <= canvas.height) {
            this.y += this.speed * y;
        }
    }

    moveX(x) {
        if (this.x + this.speed * x >= 0 && this.x + this.speed * x + this.w <= canvas.width * 0.5) {
            this.x += this.speed * x;
        }
    }


    clear(){
        ctx.clearRect(this.x, this.y, this.w, this.h)
    }

    draw(){
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}

const game = new gameArea({w: 50, h: 50, c: "blue"});
game.player.draw()
game.update()

