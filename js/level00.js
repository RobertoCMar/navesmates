
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
            this.player.direction = "down";
        } else if(this.key == "ArrowUp" || this.key == "KeyW"){
            this.player.moveY(-1);
            this.player.direction = "up";
        } else if(this.key == "ArrowRight" || this.key == "KeyD"){
            this.player.moveX(1);
            this.player.direction = "right";
        } else if(this.key == "ArrowLeft" || this.key == "KeyA"){
            this.player.moveX(-1);
            this.player.direction = "left";
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
    constructor(x, y, w, h, speed, color, health) {
        super(x, y, w, h, speed, color);
        this.shooting = false
        this.direction = "right";
        this.health = health;
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

    addhealth(n){
        this.health += n;
    }

    damage(n){
        this.health -= n
    }

   async fire(x, y){
    if(!this.shooting){
 //ayuda jefesita :,,v       const shoot = new sprite(x+50, y+12, 50, 25, 20, "yellow")
        let shoot;
        const bulletWidth = 50
        const bulletHeight = 25
        const direction = this.direction;
        const bulletSpeed = 20
        const bulletColor = "yellow"
        switch (direction){
            case "up":
                shoot = new sprite(x+Math.floor(bulletHeight*0.5), y-bulletWidth, bulletHeight, bulletWidth, bulletSpeed, bulletColor);
            break;
            case "down":
                shoot = new sprite(x+Math.floor(bulletHeight*0.5), y+bulletWidth, bulletHeight, bulletWidth, bulletSpeed, bulletColor);
            break;
            case "left":
                shoot = new sprite(x-bulletWidth, y+Math.floor(bulletHeight*0.5), bulletWidth, bulletHeight, bulletSpeed, bulletColor);
            break;
            case "right":
                shoot = new sprite(x+bulletWidth, y+Math.floor(bulletHeight*0.5), bulletWidth, bulletHeight, bulletSpeed, bulletColor);
            break;
        }
        this.shooting = true
        shoot.draw();
        let reachBarrier = false
        while (shoot.x < canvas.width-60 && shoot.y < canvas.height - 60 && shoot.y > 0 && shoot.x > 0) {
            if( (shoot.x > canvas.width * 0.5) && !reachBarrier){
                this.shooting = false
                barrier.draw()
                reachBarrier = true
            }
            shoot.clear()
            switch (direction){
                case "right":
                    shoot.moveX(1);
                break;
                case "left":
                    shoot.moveX(-1);
                break;
                case "up":
                    shoot.moveY(-1);
                break;
                case "down":
                    shoot.moveY(1);
                break;
            }
            shoot.draw()
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        shoot.clear();
        this.shooting = false
    }
}
}
const barrier = new sprite(canvas.width*0.5, 0, 5, canvas.height, 0, "red")
barrier.draw()
const game = new gameArea({w: 50, h: 50, color: "blue", health: 100});
game.player.draw()
game.update()

