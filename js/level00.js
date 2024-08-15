const boo = document.getElementById("boo")
const game = new gameArea({
    image: boo, 
    width: 100, 
    height: 75, 
    speed: 5, 
    damage: 50
});
game.addEntity({
    x: 200, 
    y: 500,
    image: boo,
    height: 100,
    width: 80,
    health: 300
})
game.update()