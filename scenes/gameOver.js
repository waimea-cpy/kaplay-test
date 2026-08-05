export function createGameOverScene() {
    scene("gameOver", () => {
        add([
            text("GAME OVER", { size: 48 }),
            pos(center().x, center().y - 40),
            anchor("center"),
            color(WHITE),
        ])

        add([
            text("Press R to restart", { size: 24 }),
            pos(center().x, center().y + 20),
            anchor("center"),
            color(WHITE),
        ])

        onKeyPress("r", () => {
            go("game")
        })
    })
}

