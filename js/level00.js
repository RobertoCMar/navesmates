
const canvas = document.getElementById("tablero");
canvas.width = window.innerWidth
canvas.height = window.innerHeight - window.innerHeight*0.1
const ctx = canvas.getContext("2d");

class gameArea{
   constructor({x = 0, y = 0, w, h, speed = 10, color}){
        this.keyPressed = false,
        this.key = null,
        this.player = new player(x, y, w, h, speed, color),
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
    if(this.keyPressed){
        if(this.key == "ArrowDown" || this.key == "KeyS"){
            this.player.moveY(1)
        } else if(this.key == "ArrowUp" || this.key == "KeyW"){
            this.player.moveY(-1);
        } else if(this.key == "ArrowRight" || this.key == "KeyD"){
            this.player.moveX(1);
        } else if(this.key == "ArrowLeft" || this.key == "KeyA"){
            this.player.moveX(-1);
        } else if(this.key == "Space"){
            this.player.fire(this.player.x, this.player.y)
        }
    }
    }

    update(){
        this.player.clear();
        this.motion()
        this.player.draw()
        requestAnimationFrame( () => this.update() )
    }
}

class sprite{
    constructor(x, y, w, h, speed, color){
        this.x = x,
        this.y = y,
        this.w = w,
        this.h = h,
        this.speed = speed,
        this.color = color
    }
    moveX(x) {
            this.x += this.speed * x;
    }

    moveY(y) {
            this.y += this.speed * y;
        
    }

    clear(){
        ctx.clearRect(this.x, this.y, this.w, this.h)
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}

class player extends sprite{
    constructor(x, y, w, h, speed, color) {
        super(x, y, w, h, speed, color);
        this.shooting = false
    };
    
    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }

    moveX(x) {
        if (this.x + this.speed * x >= 0 && this.x + this.speed * x + this.w <= canvas.width * 0.5) {
            this.x += this.speed * x;
        }
    }

    moveY(y) {
        if (this.y + this.speed * y >= 0 && this.y + this.speed * y + this.h <= canvas.height) {
            this.y += this.speed * y;
        }
    }
   async fire(x, y){
    if(!this.shooting){
        const shoot = new sprite(x+50, y+12, 50, 25, 20, "yellow")
        this.shooting = true
        shoot.draw();
        let reachBarrier = false
        while (shoot.x < canvas.width-60) {
            if( (shoot.x > canvas.width * 0.5) && !reachBarrier){
                this.shooting = false
                barrier.draw()
                reachBarrier = true
            }
            shoot.clear()
            shoot.moveX(1)
            shoot.draw()
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        shoot.clear();
    }
}
}
const barrier = new sprite(canvas.width*0.5, 0, 5, canvas.height, 0, "red")
barrier.draw()
const game = new gameArea({w: 50, h: 50, color: "blue"});
game.player.draw()
game.update()

