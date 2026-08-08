export function createGameOverScene(isMobile = false) {
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

        wait(3.0, () => {
            add([
                text(isMobile ? "Touch screen to restart" : "Press any key to restart", { size: 25 }),
                pos(center().x, center().y + 100),
                anchor("center"),
                color(WHITE),
            ])

            onTouchStart(() => go("game"))
            onKeyPress(() => go("game"))
        })
    })
}

