export function createSplashScene() {
    scene("splash", () => {
        add([
            text("ASTEROIDS", { size: 48 }),
            pos(center().x, center().y - 80),
            anchor("center"),
        ])

        add([
            text("Left / Right: rotate     Up: thrust     Space: fire", { size: 16 }),
            pos(center().x, center().y),
            anchor("center"),
        ])

        add([
            text("Press any key to play", { size: 16 }),
            pos(center().x, center().y + 50),
            anchor("center"),
            color(200, 200, 200),
        ])

        onKeyPress(() => go("game"))
    })
}

