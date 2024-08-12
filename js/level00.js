
const canvas = document.getElementById("tablero");
canvas.width = window.innerWidth
canvas.height = window.innerHeight - window.innerHeight*0.1
const ctx = canvas.getContext("2d");

class gameArea{
   constructor({x = 0, y = 0, width, height, speed, color}){
        this.keyPressed = false,
        this.key = null,
        this.player = new player({x, y, width, height, speed, color}),
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
    constructor({x, y, width, height, speed = 0, color}){
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
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
        ctx.clearRect(this.x, this.y, this.width, this.height)
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    isInContact(objX, objY, objWidth, objHeight){
        return (
            this.x + this.width >= objX && 
            this.x <= objX + objWidth && 
            this.y + this.height >= objY && 
            this.y <= objY + objHeight 
        )
    }
}

class player extends sprite{
    constructor({
            x, y, width, height, color, 
            speed = 10, health = 100, 
            damage = 10, atkWidth = 50, atkHeight = 25, atkSpeed = 25, atkColor = "yellow"
        }) {
        super({x, y, width, height, speed, color});
        this.shooting = false
        this.direction = "right";
        this.health = health;
        this.lives = true
        this.damage = damage
        this.atkWidth = atkWidth
        this.atkHeight = atkHeight
        this.atkSpeed = atkSpeed
        this.atkColor = atkColor
    };
    
    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    moveX(x) { 
        if (this.x + this.speed * x >= 0 && this.x + this.speed * x + this.width <= canvas.width) {
                this.x += this.speed * x;
                if(this.isInContact(enemy.x, enemy.y, enemy.width, enemy.height)){
                    this.x -= this.speed * x
                }
        }
    }

    moveY(y) {
        if (this.y + this.speed * y >= 0 && this.y + this.speed * y + this.height <= canvas.height) {
                this.y += this.speed * y;
            if(this.isInContact(enemy.x, enemy.y, enemy.width, enemy.height)){
                this.y -= this.speed * y;
            }
        }
    }

    addHealth(n){
        this.health += n;
    }

    minusHealth(n){
        this.health -= n
        if(this.health <= 0){
            this.lives = false
            this.clear()
        } else {
            console.log(this.health)
            this.draw()
        }
    }

   async fire(x, y){
    if(!this.shooting){
 //ayuda jefesita :,,v       const shoot = new sprite(x+50, y+12, 50, 25, 20, "yellow")
        let shoot;
        const direction = this.direction
        switch (direction){
            case "up":
                shoot = new sprite({
                    x: x+Math.floor(this.atkHeight*0.5), 
                    y: y-this.atkWidth, 
                    width: this.atkHeight, 
                    height: this.atkWidth, 
                    speed: this.atkSpeed, 
                    color: this.atkColor
                });
            break;
            case "down":
                shoot = new sprite({
                    x: x+Math.floor(this.atkHeight*0.5), 
                    y: y+this.atkWidth, 
                    width: this.atkHeight, 
                    height: this.atkWidth, 
                    speed: this.atkSpeed, 
                    color: this.atkColor
                });
            break;
            case "left":
                shoot = new sprite({
                    x: x-this.atkWidth, 
                    y: y+Math.floor(this.atkHeight*0.5), 
                    width: this.atkWidth, 
                    height: this.atkHeight, 
                    speed: this.atkSpeed, 
                    color: this.atkColor
                });
            break;
            case "right":
                shoot = new sprite({
                   x: x+this.atkWidth, 
                   y: y+Math.floor(this.atkHeight*0.5), 
                   width: this.atkWidth, 
                   height: this.atkHeight, 
                   speed: this.atkSpeed, 
                   color: this.atkColor
                });
            break;
        }
        this.shooting = true
        shoot.draw();
        while (shoot.x < canvas.width-60 && shoot.y < canvas.height - 60 && shoot.y > 0 && shoot.x > 0) {
            if(shoot.isInContact(enemy.x, enemy.y, enemy.width, enemy.height)){
                shoot.clear()
                this.shooting = false
                enemy.minusHealth(this.damage)
                return
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
const enemy = new player({x: 400, y: 400, width: 50, height: 50, speed: 10, color: "red"})
enemy.draw()
const game = new gameArea({x: 0, y: 0, width: 50, height: 50, speed: 10, color: "blue"});
game.player.draw()
game.update()

