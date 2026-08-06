const BULLET_SPEED = 800
const BULLET_LIFE = 1.00   // seconds before a bullet disappears on its own

export function createBullet(ship) {
    const facing = Vec2.fromAngle(ship.angle)

    return add([
        pos(ship.pos.add(facing.scale(20))), // spawn at the ship's nose
        rect(4, 4),
        anchor("center"),
        color(YELLOW),
        opacity(1),        // lifespan() needs this to fade the bullet out
        area(),
        lifespan(BULLET_LIFE),
        offscreen({ destroy: true }),
        "bullet",
        {
            vel: facing.scale(BULLET_SPEED),
        },
    ])
}

