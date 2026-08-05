const ASTEROID_SPEED_MIN = 60
const ASTEROID_SPEED_MAX = 140

export function createAsteroid() {
    const points = [
        vec2(20, 0), vec2(10, 17), vec2(-10, 17),
        vec2(-20, 0), vec2(-10, -17), vec2(10, -17),
    ]

    const edge = choose(["top", "bottom", "left", "right"])
    let spawnPos

    if      (edge === "top")    spawnPos = vec2(rand(0, width()), -30)
    else if (edge === "bottom") spawnPos = vec2(rand(0, width()), height() + 30)
    else if (edge === "left")   spawnPos = vec2(-30, rand(0, height()))
    else                        spawnPos = vec2(width() + 30, rand(0, height()))

    // Aim roughly at the centre of the screen from wherever it spawned
    const dir = center().sub(spawnPos).unit()

    return add([
        pos(spawnPos),
        rotate(rand(0, 360)),
        scale(rand(1, 3)),
        anchor("center"),
        polygon(points, { fill: false }),
        area({ shape: new Polygon(points) }),
        outline(2, WHITE),
        offscreen({ destroy: true, distance: 100 }),
        "asteroid",
        {
            vel: dir.scale(rand(ASTEROID_SPEED_MIN, ASTEROID_SPEED_MAX)),
        },
    ])
}