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
