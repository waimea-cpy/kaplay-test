const ASTEROID_SPEED_MIN = 60
const ASTEROID_SPEED_MAX = 140

export function createAsteroid(scaleFactor=1, spawnPos, inheritVelocity) {
    const shapes = [
        [
            vec2(9, -18),
            vec2(-2, -16),
            vec2(-10, -18),
            vec2(-19, -10),
            vec2(-17, 0),
            vec2(-20, 10),
            vec2(-11, 19),
            vec2(-3, 16),
            vec2(8, 19),
            vec2(16, 8),
            vec2(17, 2),
            vec2(14, -2),
            vec2(17, -9),
        ],
        [
            vec2(-11, -18),
            vec2(-13, -12),
            vec2(-20, -8),
            vec2(-19, 7),
            vec2(-12, 17),
            vec2(-1, 15),
            vec2(7, 16),
            vec2(14, 9),
            vec2(14, 4),
            vec2(11, 1),
            vec2(14, -2),
            vec2(14, -9),
            vec2(2, -18),
        ],
        [
            vec2(9, -20),
            vec2(-6, -20),
            vec2(-20, -7),
            vec2(-20, 7),
            vec2(-10, 20),
            vec2(9, 20),
            vec2(19, 7),
            vec2(19, -7),
        ],
    ]

    const points = choose(shapes).map(pt => pt.scale(scaleFactor))

    if (!spawnPos) {
        const edge = choose(["top", "bottom", "left", "right"])

        if      (edge === "top")    spawnPos = vec2(rand(0, width()), -30)
        else if (edge === "bottom") spawnPos = vec2(rand(0, width()), height() + 30)
        else if (edge === "left")   spawnPos = vec2(-30, rand(0, height()))
        else                        spawnPos = vec2(width() + 30, rand(0, height()))
    }

    const dir = Vec2.fromAngle(rand(0, 360))

    const velocity = inheritVelocity || dir.scale(rand(ASTEROID_SPEED_MIN, ASTEROID_SPEED_MAX))

    return add([
        pos(spawnPos),
        rotate(rand(0, 360)),
        anchor("center"),
        polygon(points, { fill: false }),
        area({ shape: new Polygon(points) }),
        outline(2, WHITE),
        "asteroid",
        {
            vel: velocity,
            scaleFactor: scaleFactor,
        },
    ])
}