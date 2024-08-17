const player = {
    up:
        new Image(),
    down:
        new Image(),
    left:
        new Image(),
    right:
        new Image()    
};

const basicEnemyImg = new Image();
player.up.src = "./../Assets/Man-back.png";
player.down.src = "./../Assets/Man-front.png";
player.right.src = "./../Assets/Man-right.png";
player.left.src = "./../Assets/Man-left.png";
basicEnemyImg.src = "./../Assets/King-Boo.png";
class level0 extends gameArea{
    level(){
        for(let npc of this.entities){
            if(npc == this.player){
                continue;
            }

            if(!npc.shooting){
                npc.doBasicAtk();
            }
        }
    }
}

const basicEnemy = {
    width: 80,
    height: 100,
    padding: 30,
    x: 50,
    y: canvas.width * 0.5 - 80
}

const game = new level0({
    image: player.down, 
    width: 60, 
    height: 100, 
    speed: 5, 
    damage: 50,
    images: player 
});


for(let i = 0; basicEnemy.x + (basicEnemy.width + basicEnemy.padding) * i < canvas.width - basicEnemy.width - basicEnemy.padding; i++){
    game.addEntity({
        x: basicEnemy.x + (basicEnemy.width + basicEnemy.padding) * i, 
        y: basicEnemy.y,
        direction: "up",
        image: basicEnemyImg,
        height: basicEnemy.height,
        width: basicEnemy.width,
        health: 300,
    })
}

async function trees(){
    await new Promise(resolve => setTimeout(resolve, 500))
    drawTrees();
}

trees();
game.update();
