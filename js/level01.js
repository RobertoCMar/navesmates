
const player = new Image();
const basicEnemy = new Image();
basicEnemy.src = "./../Assets/fondo.jpg";
player.src = "./../Assets/King-Boo.png";

class level1 extends gameArea{
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

const game = new level1({
    image: player, 
    width: 100, 
    height: 75, 
    speed: 5, 
    damage: 50
});
game.addEntity({
    x: 200, 
    y: 400,
    direction: "up",
    image: basicEnemy,
    height: 100,
    width: 80,
    health: 300
})
game.addEntity({
    x: 50, 
    y: 70,
    direction: "right",
    image: basicEnemy,
    height: 150,
    width: 150,
    health: 400
})
game.addEntity({
    x: 800, 
    y: 300,
    direction: "left",
    image: basicEnemy,
    height: 100,
    width: 80,
    health: 300
})
async function trees(){
    await new Promise(resolve => setTimeout(resolve, 500))
    drawTrees();
}

trees();
game.update();
