export function createSplashScene() {
    scene("splash", () => {
        add([
            text("ASTEROIDS", { size: 48 }),
            pos(center().x, center().y - 100),
            anchor("center"),
        ])

        add([
            text("Left/Right: Rotate\n        Up: Thrust\n     Space: Fire", { size: 25 }),
            pos(center().x, center().y),
            anchor("center"),
        ])

        add([
            text("Press any key to play", { size: 25 }),
            pos(center().x, center().y + 100),
            anchor("center"),
            color(200, 200, 200),
        ])

        onKeyPress(() => go("game"))
    })
}

