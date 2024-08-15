const boo = document.getElementById("boo")
const game = new gameArea({image: boo, width: 100, height: 75, speed: 5, damage: 50});
game.update()