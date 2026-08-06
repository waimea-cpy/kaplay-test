const SHIP_TURN_SPEED = 200     // degrees per second
const SHIP_THRUST = 800         // acceleration while holding "up"
const SHIP_DRAG = 0.98          // velocity multiplier each frame

export function createShip() {
    const shipPoints = [
        vec2(20, 0),
        vec2(-14, 12),
        vec2(-10, 10),
        vec2(-10, -10),
        vec2(-14, -12),
    ]

    const flamePoints = [
        vec2(-11, 4),
        vec2(-20 , 0),
        vec2(-11, -4),
    ]

    const ship = add([
        pos(center()),
        rotate(-90),                            // Point up to start
        anchor("center"),

        polygon(shipPoints, { fill: false }),
        area(),
        outline(2, WHITE, 1.0, "round"),

        "ship",

        {
            vel: vec2(0, 0),
            turnSpeed: SHIP_TURN_SPEED,
            thrust: SHIP_THRUST,
            drag: SHIP_DRAG,
        },
    ])

    const flame = ship.add([
        pos(0, 0),
        polygon(flamePoints, { fill: false }),
        outline(2, RED, 1.0, "round"),
        opacity(0),
    ])

    return [ship, flame]
}

