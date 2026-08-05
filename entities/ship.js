const SHIP_TURN_SPEED = 200     // degrees per second
const SHIP_THRUST = 800         // acceleration while holding "up"
const SHIP_DRAG = 0.98          // velocity multiplier each frame

export function createShip() {
    const points = [
        vec2(20, 0),
        vec2(-14, 14),
        vec2(-14, -14),
    ]

    return add([
        pos(center()),
        rotate(-90),                            // Point up to start
        anchor("center"),
        polygon(points, { fill: false }),       // outline only, no fill
        area({ shape: new Polygon(points) }),   // matching collision shape
        outline(2, WHITE),
        "ship",
        {
            vel: vec2(0, 0),
            turnSpeed: SHIP_TURN_SPEED,
            thrust: SHIP_THRUST,
            drag: SHIP_DRAG,
        },
    ])
}

