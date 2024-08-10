//hola chavales xd xd xd xd xd xd 
const canvas = document.getElementById("tablero");
const ctx = canvas.getContext("2d");

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

    moveY(y){
        const newY = this.y + this.speed * y;
        if (newY >= 0 && newY + this.h <= canvas.height) {
            this.y = newY;
        }
    }

    moveX(x){
        const newX = this.x + this.speed * x;
        if (newX >= 0 && newX + this.w <= canvas.width) {
            this.x = newX;
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

