const boo = document.getElementById("boo")
const enemy = new player({image: boo, x: 400, y: 400, width: 50, height: 50, speed: 10})
enemy.draw()
// Nmms se ve bien cagado XDDDDD
const game = new gameArea({image: boo, x: 0, y: 0, width: 50, height: 50, speed: 10});
game.player.draw()
game.addEntity(enemy);
game.update()