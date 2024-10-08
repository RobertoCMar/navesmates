
const canvas = document.getElementById("tablero");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d");
ctx.font = "15px Verdana";

const treeImg = new Image();
treeImg.src = "./../Assets/Tree.png";

function isInContact(aX, aY, aWidth, aHeight, bX, bY, bWidth, bHeight){
    return (
        aX + aWidth > bX && 
        aX < bX + bWidth && 
        aY + aHeight > bY && 
        aY < bY + bHeight 
    )
}

function centerX(x, width){
    return Math.round(x - width * 0.5);
}

function centerY(y, height){
    return Math.round (y - height * 0.5); 
}


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
        atkWidth = 50, atkHeight = 25, atkSpeed = 25, atkCD = 1000, atkColor = "yellow",
        colorLife = "green", colorLifeB = "red", healthBarHeight = 5, images
   }){
        this.keyPressed = false,
        this.key = null,
        this.player = new mainCharacter({
            x, y, width, height, speed, image, direction, 
            speed, health, damage, crtDamage, 
            atkWidth, atkHeight, atkSpeed, atkCD, atkColor,
            colorLife, colorLifeB, healthBarHeight, 
            multiImg: true, images
        }),
        this.entities = [this.player],
        this.control()
   }

    addEntity(
        {x, y, width, height, image, direction,
        speed = 10, health = 100, damage = 10, crtDamage = damage*1.5, 
        atkWidth = 50, atkHeight = 25, atkSpeed = 25, atkCD = 1000, atkColor = "yellow",
        colorLife = "green", colorLifeB = "red", healthBarHeight = 5}
    ) {
        const entity = new character({
            x, y, width, height, image, direction, 
            speed, health, damage, crtDamage, 
            atkWidth, atkHeight, atkSpeed, atkCD, atkColor,
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
            this.player.doAtk(() => this.player.basicAtk(), this.player.atkCD)
        } else if(this.key == "KeyX" && !this.player.shooting && !this.player.didSpecialAtk){
            let answer = parseInt(prompt("2 + 2"));
            if(answer != 4){
                this.player.minusHealth(this.player.damage);
            }
            this.player.doAtk(() => this.player.specialAtk(), this.player.atkCD * 10)
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
            if (this.entities.length === 1) {
                window.cancelAnimationFrame(this.update);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.remove();
                document.getElementById("win-screen").style.display = "flex";
                return;
            }
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
            this.midX = Math.round(this.x + this.width * 0.5)
    }

    moveY(y) {
            this.y += this.speed * y;
            this.midY = Math.round(this.y + this.height * 0.5)
    }

    clear(){
        ctx.clearRect(this.x, this.y, this.width, this.height)
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class character extends sprite{
    constructor({
            x, y, width, height, image, direction ,
            speed, health, damage, crtDamage, 
            atkWidth, atkHeight, atkSpeed, atkCD, atkColor,
            colorLife, colorLifeB, healthBarHeight, 
            multiImg = false, images
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
        this.atkCD = atkCD
        this.atkColor = atkColor
        this.colorLife = colorLife
        this.colorLifeB = colorLifeB
        this.healthBarHeight = healthBarHeight
        this.multiImg = multiImg;
        this.images = images;
    };

    clear() {
        // eto limpia la zona del player
        if(this.direction == "right" || this.direction == "left" || this.multiImg){
            ctx.clearRect(this.x, this.y, this.width, this.height);
        } else{
            let rotation;
            rotation = Math.PI * 0.5 
            if(this.direction == "down"){
                rotation *= -1;
            }
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(rotation);
            ctx.clearRect(-this.width / 2, -this.height/2, this.width, this.height)
            ctx.restore()
        }
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
            if(!this.multiImg){
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
            } else {
                switch (direction) {
                    case "up":
                        this.image = this.images.up;
                        break;
                    case "down":
                        this.image = this.images.down;
                        break;
                    case "left":
                        this.image = this.images.left;
                        break;
                    case "right":
                        this.image = this.images.right;
                        break;
                    default:
                        break;
                }
                    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                    this.drawHealthBar();
            }
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
        const direction = this.direction;
        let contact = false;
        if(direction != "left" && direction != "right"){
            return
        }
        if (this.x + this.speed * x >= 0 && this.x + this.speed * x + this.width <= canvas.width) {
                for(let npc of game.entities){
                    if(npc == this){
                        continue;
                    }
                    if(isInContact(this.x + this.speed * x, this.y ,this.width, this.height, npc.x, npc.y, npc.width, npc.height)){
                        contact = true;
                        if(direction == "right"){
                            this.x = npc.x - this.width - 2
                        }
                        else if(direction == "left"){
                            this.x = npc.x + npc.width + 2
                        }
                        break;
                    } 
                }
                if(!contact){
                    this.x += this.speed * x;
                }
                this.midX = Math.round(this.x + this.width * 0.5)
        }
    }

    moveY(y) {
        const direction = this.direction;
        let contact = false;
        if(direction != "up" && direction != "down"){
            return
        }
        if (this.y + this.speed * y >= 0 && this.y + this.speed * y + this.height <= canvas.height) {
            for(let npc of game.entities){
                if(npc == this){
                    continue;
                }
                if(isInContact(this.x, this.y + this.speed * y, this.width, this.height, npc.x, npc.y, npc.width, npc.height)){
                    contact = true;
                    if(direction == "down"){
                        this.y = npc.y - this.height - 2;
                    }else if(direction == "up"){
                        this.y = npc.y + npc.height + 2;
                    }
                    break;
                }  
            }
            if(!contact){
                this.y += this.speed * y; 
            }
            this.midY = Math.round(this.y + this.height * 0.5)  
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
    async doAtk(atk, cooldown) {
        this.shooting = true;
        atk()
        await new Promise(resolve => setTimeout(resolve, cooldown))
        this.shooting = false;
    }

   async basicAtk(damage=this.damage, crtDamage=this.crtDamage){
        let shoot;
        let obj = this;
        const x = obj.x;
        const y = obj.y;
        const direction = obj.direction
//        const damage = obj.damage;
//        const crtDamage = this.crtDamage;
        switch (direction){
            case "up":
                shoot = new sprite({
                    x: centerX(obj.midX, obj.atkHeight), 
                    y: y, 
                    width: obj.atkHeight, 
                    height: obj.atkWidth,
                    speed: obj.atkSpeed, 
                    color: obj.atkColor
                }); 
            break;
            case "down":
                shoot = new sprite({
                    x: centerX(obj.midX, obj.atkHeight), 
                    y: y, 
                    width: obj.atkHeight, 
                    height: obj.atkWidth, 
                    speed: obj.atkSpeed, 
                    color: obj.atkColor
                });
            break;
            case "left":
                shoot = new sprite({
                    x: x, 
                    y: centerY(obj.midY, obj.atkHeight), 
                    width: obj.atkWidth, 
                    height: obj.atkHeight, 
                    speed: obj.atkSpeed, 
                    color: obj.atkColor
                });
            break;
            case "right":
                shoot = new sprite({
                   x: x, 
                   y: centerY(obj.midY, obj.atkHeight), 
                   width: obj.atkWidth, 
                   height: obj.atkHeight, 
                   speed: obj.atkSpeed, 
                   color: obj.atkColor
                });
            break;
        }
        shoot.draw();
        while (shoot.x < canvas.width-60 && shoot.y < canvas.height - 60 && shoot.y > 0 && shoot.x > 0) {
            for(let npc of game.entities){
                if (obj !== game.player && npc !== game.player) {
                    continue;
                }
                if(isInContact(shoot.x, shoot.y, shoot.width, shoot.height, npc.x, npc.y, npc.width, npc.height)){
                    //se forma un circulo con radio
                    if(obj == npc){
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
                        ctx.fillText(`${damage}`, txtX, txtY)
                        npc.minusHealth(damage)
                    } else {
                        ctx.fillText("Critical!", txtX, txtY + 10)
                        ctx.fillText(`${crtDamage}`, txtX, txtY)
                        npc.minusHealth(crtDamage)
                    }
                    txtWidth = (critical) ? ctx.measureText(`${crtDamage}`).width : ctx.measureText(`${damage}`).width;
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

class mainCharacter extends character{
    constructor({
        x, y, width, height, image, direction ,
        speed, health, damage, crtDamage, 
        atkWidth, atkHeight, atkSpeed, atkCD, specialAtkCD, atkColor,
        colorLife, colorLifeB, healthBarHeight, 
        multiImg = false, images, 
    }){
        super({x, y, width, height, image, direction,
            speed, health, damage, crtDamage, 
            atkWidth, atkHeight, atkSpeed, atkCD, specialAtkCD, atkColor,
            colorLife, colorLifeB, healthBarHeight, 
            multiImg, images, 
        });
        this.didSpecialAtk = false;
    }

    async doAtk(atk, cooldown) {
        this.shooting = true;
        if(cooldown > this.atkCD)
            this.didSpecialAtk = true;
        atk()
        await new Promise(resolve => setTimeout(resolve, this.atkCD))
        this.shooting = false;
        if(cooldown > this.atkCD){
            await new Promise(resolve => setTimeout(resolve, cooldown - this.atkCD));
            this.didSpecialAtk = false;
        }
    }
    async specialAtk(){
        let temp = this.atkColor;
        this.atkColor = "red";
        this.basicAtk(this.damage * 3, this.damage * 3 * 1.5);
        this.atkColor = temp;
}
}
