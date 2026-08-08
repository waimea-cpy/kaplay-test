export function createSplashScene(isMobile = false) {
    scene("splash", () => {
        add([
            text("ASTEROIDS", { size: 48 }),
            pos(center().x, center().y - 100),
            anchor("center"),
            color(WHITE),
        ])

        add([
            text("L/R Rotate\n Up Thrust\n  Z Fire", { size: 25 }),
            pos(center().x, center().y),
            anchor("center"),
            color(WHITE),
        ])

        wait(2.0, () => {
            add([
                text(isMobile ? "Touch screen to play" : "Press any key to play", { size: 25 }),
                pos(center().x, center().y + 100),
                anchor("center"),
                color(WHITE),
            ])

            onTouchStart(() => go("game"))
            onKeyPress(() => go("game"))
        })
    })
}

