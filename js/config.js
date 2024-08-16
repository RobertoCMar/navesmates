
const canvas = document.getElementById("tablero");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d");
ctx.font = "15px Verdana";

const treeImg = new Image();
treeImg.src = "./../Assets/Tree.png";

function drawTrees() {
    const treeSize = 30; // Tamaño de cada árbol
    const treePositions = [];

    // Árboles en la parte superior
    for (let x = 0; x < canvas.width; x += treeSize) {
        treePositions.push({ x: x, y: 0 });
    }

    // Árboles en la parte inferior
    for (let x = 0; x < canvas.width; x += treeSize) {
        treePositions.push({ x: x, y: canvas.height - treeSize });
    }

    // Árboles en el lado izquierdo
    for (let y = 0; y < canvas.height; y += treeSize) {
        treePositions.push({ x: 0, y: y });
    }

    // Árboles en el lado derecho
    for (let y = 0; y < canvas.height; y += treeSize) {
        treePositions.push({ x: canvas.width - treeSize, y: y });
    }

    treePositions.forEach(pos => {
        ctx.drawImage(treeImg, pos.x, pos.y, treeSize, treeSize);
    });
}

class gameArea{
   constructor({x = Math.floor(canvas.width * 0.5), y = Math.floor(canvas.height * 0.5), width, height, image, 
        direction = "right", speed = 10, health = 100, damage = 10, crtDamage = damage*1.5, 
        atkWidth = 50, atkHeight = 25, atkSpeed = 25, atkCooldown = 1000, atkColor = "yellow",
        colorLife = "green", colorLifeB = "red", healthBarHeight = 5
   }){
        this.keyPressed = false,
        this.key = null,
        this.player = new character({
            x, y, width, height, speed, image, direction, 
            speed, health, damage, crtDamage, 
            atkWidth, atkHeight, atkSpeed, atkCooldown, atkColor,
            colorLife, colorLifeB, healthBarHeight   
        }),
        this.entities = [this.player],
        this.control()
   }

    addEntity(
        {x, y, width, height, image, direction,
        speed = 10, health = 100, damage = 10, crtDamage = damage*1.5, 
        atkWidth = 50, atkHeight = 25, atkSpeed = 25, atkCooldown = 1000, atkColor = "yellow",
        colorLife = "green", colorLifeB = "red", healthBarHeight = 5}
    ) {
        const entity = new character({
            x, y, width, height, image, direction, 
            speed, health, damage, crtDamage, 
            atkWidth, atkHeight, atkSpeed, atkCooldown, atkColor,
            colorLife, colorLifeB,  healthBarHeight   
        });
        this.entities.push(entity);
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
        } else if(this.key == "Space" && !this.player.shooting){
            this.player.doBasicAtk()
        }
    } 
    }

    level(){return}

    update(){
        if(this.player.lives){
            this.entities.forEach(entity => {
                entity.clear();
            });
            this.motion()
            this.level();
            this.entities = this.entities.filter( (monito) => monito.lives)
            this.entities.forEach(entity => {
                    entity.draw();
            });
            requestAnimationFrame( () => this.update() )
        } else{
            window.cancelAnimationFrame;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.remove();
            document.getElementById("death-screen").style.display = "flex";
        }
    }
};

class sprite{
    constructor({x, y, width, height, speed = 0, color}){
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.midX = Math.floor(this.x + this.width * 0.5),
        this.midY = Math.floor(this.y + this.height * 0.5),
        this.speed = speed,
        this.color = color
    }
    moveX(x) {
            this.x += this.speed * x;
            this.midX = Math.floor(this.x + this.width * 0.5)
    }

    moveY(y) {
            this.y += this.speed * y;
            this.midY = Math.floor(this.y + this.height * 0.5)
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

class character extends sprite{
    constructor({
            x, y, width, height, image, direction ,
            speed, health, damage, crtDamage, 
            atkWidth, atkHeight, atkSpeed, atkCooldown, atkColor,
            colorLife, colorLifeB, healthBarHeight
        }) {
        super({x, y, width, height, speed});
   
        this.image = image
        this.shooting = false
        this.direction = direction;
        this.health = health;
        this.maxHealth = health;
        this.lives = true
        this.damage = damage
        this.crtDamage = crtDamage;
        this.atkWidth = atkWidth
        this.atkHeight = atkHeight
        this.atkSpeed = atkSpeed
        this.atkCooldown = atkCooldown
        this.atkColor = atkColor
        this.colorLife = colorLife
        this.colorLifeB = colorLifeB
        this.healthBarHeight = healthBarHeight
    };

    clear() {
        // eto limpia la zona del player
        ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
        
        // para saber donde esta la barra de salud
        const healthBarWidth = this.width;
        let healthBarY;
    
        if (this.y > canvas.height * 0.1) { 
            healthBarY = this.y - this.healthBarHeight - 2;
        } else {
            healthBarY = this.y + this.height + 2;
        }
    
        // Limpiar donde se dibuja la barra de salud
        ctx.clearRect(this.x - 1, healthBarY - 1, healthBarWidth + 2, this.healthBarHeight + 2);
    }
    

    draw(){
        if (this.lives) {
            const direction = this.direction;
            let rotation
            switch (direction) {
                case "right":
                    rotation = Math.PI; //180 grados
                    break;
                case "left":
                    rotation = 0;
                    break;
                case "down":
                    rotation = -Math.PI * 0.5 //-90 grados
                    break
                case "up":
                    rotation = Math.PI * 0.5//90 grados
                    break
                default:
                    break;
            }
            ctx.save();
        //para rotar el canvas se toma como referencia el centro del playerr
        //cambiamos el origen (coordenadas 0 , 0) al centro de lo k vamos a rotar
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            if(rotation == Math.PI){
        //se invierte el canvas verticalmente, pq
        // sino el mono mira a a la derecha, 
        //pero patas pa arriba xdxdxd    
                ctx.scale(1, -1)
            }
            ctx.rotate(rotation);
        //No le entendía bn al principio, pero aquí, ya que cambiamos el origen
        //(mitad del player)
        //despejamos la ecuación para encontar la nueva coordenada x & y
        //ya que 0 es la mitad del player,restamos los valores de la mitad para encontrar su posicion original
            ctx.drawImage(this.image, -this.width / 2, -this.height/2, this.width, this.height)
        //se deshace todos los cambios del context Bv    
            ctx.restore()
            this.drawHealthBar();
        }
        else
        {
            //Morir funcion XD
        }
    }
    
    drawHealthBar(){
        const healthBarWidth = this.width;
        let healthBarX = this.x;
        
        let healthBarY;
        if (this.y > canvas.height * 0.1) { 
            healthBarY = this.y - this.healthBarHeight - 2;  // Barra arriba del jugador :v
        } else {
            healthBarY = this.y + this.height + 2;  // Barra abajo del jugador :v
        }
        
        ctx.fillStyle = this.colorLifeB;
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, this.healthBarHeight);
        
        ctx.fillStyle = this.colorLife;
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * (this.health / this.maxHealth), this.healthBarHeight);
    }

    moveX(x) { 
        if (!this.lives) return;
        if(this.direction != "left" && this.direction != "right"){
            return
        }
        if (this.x + this.speed * x >= 0 && this.x + this.speed * x + this.width <= canvas.width) {
                this.x += this.speed * x;
                for(let npc of game.entities){
                    if(npc == this){
                        continue;
                    }
                    if(this.isInContact(npc.x, npc.y, npc.width, npc.height)){
                        if(this.direction == "right"){
                            this.x = npc.x - npc.width - 2
                        }
                        else if(this.direction == "left"){
                            this.x = npc.x + npc.width + 2
                        }
                        break;
                    }
                }
                this.midX = Math.floor(this.x + this.width * 0.5)
        }
    }

    moveY(y) {
        if (!this.lives) return;
        if(this.direction != "up" && this.direction != "down"){
            return
        }
        if (this.y + this.speed * y >= 0 && this.y + this.speed * y + this.height <= canvas.height) {
            this.y += this.speed * y;
            for(let npc of game.entities){
                if(npc == this){
                    continue;
                }
                if(this.isInContact(npc.x, npc.y, npc.width, npc.height)){
                    if(this.direction == "down"){
                        this.y = npc.y - npc.height - 2;
                    }else if(this.direction == "up"){
                        this.y = npc.y + npc.height + 2;
                    }
                    break;
                }  
            }
            this.midY = Math.floor(this.y + this.height * 0.5)  
        }
    }

    addHealth(n){
        this.health += n;
    }

    minusHealth(n){
        this.health -= n
        if (this.health <= 0) {
            this.lives = false;
        } 
    }
//Para los disparos primero se lladoBabasicAtk que se encarga de los booleanos, y luego al metodo basicAtk...
//Este proceso se debe hacer dentro de un condicional que verifique si player está disparando
//Así se soluciona el spam :vV:v:v xdXdxdxd
    async doBasicAtk() {
        this.shooting = true;
        this.basicAtk(this.x, this.y);
        await new Promise(resolve => setTimeout(resolve, this.atkCooldown))
        this.shooting = false;
    }

   async basicAtk(x, y){
 //ayuda jefesita :,,v       const shoot = new sprite(x+50, y+12, 50, 25, 20, "yellow")
        let shoot;
        const direction = this.direction
        switch (direction){
            case "up":
                shoot = new sprite({
                    x: this.midX, 
                    y: y, 
                    width: this.atkHeight, 
                    height: this.atkWidth, 
                    speed: this.atkSpeed, 
                    color: this.atkColor
                }); 
            break;
            case "down":
                shoot = new sprite({
                    x: this.midX, 
                    y: y, 
                    width: this.atkHeight, 
                    height: this.atkWidth, 
                    speed: this.atkSpeed, 
                    color: this.atkColor
                });
            break;
            case "left":
                shoot = new sprite({
                    x: x, 
                    y: this.midY, 
                    width: this.atkWidth, 
                    height: this.atkHeight, 
                    speed: this.atkSpeed, 
                    color: this.atkColor
                });
            break;
            case "right":
                shoot = new sprite({
                   x: x, 
                   y: this.midY, 
                   width: this.atkWidth, 
                   height: this.atkHeight, 
                   speed: this.atkSpeed, 
                   color: this.atkColor
                });
            break;
        }
        shoot.draw();
        while (shoot.x < canvas.width-60 && shoot.y < canvas.height - 60 && shoot.y > 0 && shoot.x > 0) {
            for(let npc of game.entities){
                if(shoot.isInContact(npc.x, npc.y, npc.width, npc.height)){
                    //se forma un circulo con radio
                    if(this == npc){
                        continue;
                    }
                    let whatDamage = Math.random() * 4
                    let critical = false
                    if(whatDamage < 1){
                        critical = true
                    }

                    let radius = npc.width * 1.2
                    let txtX, txtY, angle
                    let txtWidth, txtHeight;
                    angle = Math.random() * Math.PI * 2 //angulo de 0-360 grados
                   //en  base al angulo, se calculan las coordenas para el texto
                   //el texto aparece siempre en el perimetro del circulo
                    txtX = npc.midX + radius * Math.cos(angle)
                    txtY = npc.midY + radius * Math.sin(angle)
                    
                    shoot.clear()
                    ctx.fillStyle = "red"
                    if(!critical){
                        ctx.fillText(`${this.damage}`, txtX, txtY)
                        npc.minusHealth(this.damage)
                    } else {
                        ctx.fillText("Critical!", txtX, txtY + 10)
                        ctx.fillText(`${this.crtDamage}`, txtX, txtY)
                        npc.minusHealth(this.crtDamage)
                    }
                    txtWidth = (critical) ? ctx.measureText(`${this.crtDamage}`).width : ctx.measureText(`${this.damage}`).width;
                    txtHeight = parseInt(ctx.font);
                    await new Promise(resolve => setTimeout(resolve, 500))
                    ctx.clearRect(txtX, txtY - txtHeight, txtWidth, txtHeight);
                    if(critical){
                        ctx.clearRect(txtX, txtY + 10 - txtHeight, ctx.measureText("Critical!").width, txtHeight);
                    }
                    return
                }
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
        drawTrees();  
}
}

