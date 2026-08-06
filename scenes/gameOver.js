export function createGameOverScene() {
    scene("gameOver", (level, score) => {
        add([
            text("GAME OVER", { size: 48 }),
            pos(center().x, center().y - 60),
            anchor("center"),
            color(WHITE),
        ])

        add([
            text(`Level ${level}  Score ${score}`, { size: 48 }),
            pos(center().x, center().y + 20),
            anchor("center"),
            color(WHITE),
        ])

        add([
            text("Press R to restart", { size: 24 }),
            pos(center().x, center().y + 80),
            anchor("center"),
            color(WHITE),
        ])

        onKeyPress("r", () => {
            go("game")
        })
    })
}

