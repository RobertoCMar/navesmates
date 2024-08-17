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

const basicEnemy = new Image();
player.up.src = "./../Assets/Man-back.png";
player.down.src = "./../Assets/Man-front.png";
player.right.src = "./../Assets/Man-right.png";
player.left.src = "./../Assets/Man-left.png";
basicEnemy.src = "./../Assets/King-Boo.png";
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

const game = new level0({
    image: player.down, 
    width: 60, 
    height: 100, 
    speed: 5, 
    damage: 50,
    images: player 
});
game.addEntity({
    x: 200, 
    y: 400,
    direction: "left",
    image: basicEnemy,
    height: 100,
    width: 80,
    health: 300,
    damage: 1
})

async function trees(){
    await new Promise(resolve => setTimeout(resolve, 500))
    drawTrees();
}

trees();
game.update();
