import { createShip } from "../entities/ship.js"
import { createBullet } from "../entities/bullet.js"
import { createAsteroid } from "../entities/asteroid.js"

const ASTEROIDS_TO_CLEAR = 8    // destroy this many to advance to the next level
const BASE_SPAWN_INTERVAL = 1.5 // seconds between spawns on level 1

export function createGameScene() {
    scene("game", (level = 1) => {
        const [ship, flame] = createShip()
        let lives = 3

        const asteroidsToSpawn = level + 5
        const startingScale = 2

        for (let i = 0; i < asteroidsToSpawn; i++) {
            createAsteroid(startingScale)
        }

        add([
            text(`Level ${level}`, { size: 20 }),
            pos(12, 12),
            color(WHITE)
        ])

        onKeyDown("left", () => {
            ship.angle -= ship.turnSpeed * dt()
        })

        onKeyDown("right", () => {
            ship.angle += ship.turnSpeed * dt()
        })

        onKeyDown("up", () => {
            const facing = Vec2.fromAngle(ship.angle)
            ship.vel = ship.vel.add(facing.scale(ship.thrust * dt()))
            flame.opacity = 1
        })

        onKeyRelease("up", () => {
            flame.opacity = 0
        })

        onKeyPress("space", () => {
            createBullet(ship)
        })

        onUpdate(() => {
            ship.pos = ship.pos.add(ship.vel.scale(dt()))
            ship.vel = ship.vel.scale(ship.drag)

            // Screen wrap - the ship stays in play forever
            if (ship.pos.x < 0)        ship.pos.x = width()
            if (ship.pos.x > width())  ship.pos.x = 0
            if (ship.pos.y < 0)        ship.pos.y = height()
            if (ship.pos.y > height()) ship.pos.y = 0
        })

        onUpdate("bullet", (bullet) => {
            bullet.pos = bullet.pos.add(bullet.vel.scale(dt()))
        })

        onUpdate("asteroid", (asteroid) => {
            asteroid.pos = asteroid.pos.add(asteroid.vel.scale(dt()))

            const offset = asteroid.scaleFactor * 20
            if (asteroid.pos.x < 0 - offset)        asteroid.pos.x = width() + offset
            if (asteroid.pos.x > width() + offset)  asteroid.pos.x = 0 - offset
            if (asteroid.pos.y < 0 - offset)        asteroid.pos.y = height() + offset
            if (asteroid.pos.y > height() + offset) asteroid.pos.y = 0 - offset
        })

        onCollide("bullet", "asteroid", (bullet, asteroid) => {
            destroy(bullet)
            destroy(asteroid)

            const nextScale = asteroid.scaleFactor / 2;

            if (nextScale >= 0.5) {
                const parentVelocity = asteroid.vel
                const parentSpeed = parentVelocity.len()
                const parentAngle = parentVelocity.angle()

                const speedMultiplier = 1.5
                const childSpeed = parentSpeed * speedMultiplier

                const deflectionAngle = rand(15,45)
                const leftAngle = parentAngle - deflectionAngle
                const rightAngle = parentAngle + deflectionAngle

                const leftVelocity = Vec2.fromAngle(leftAngle).scale(childSpeed)
                const rightVelocity = Vec2.fromAngle(rightAngle).scale(childSpeed)

                createAsteroid(nextScale, asteroid.pos, leftVelocity)
                createAsteroid(nextScale, asteroid.pos, rightVelocity)
            }
        })

        onCollide("ship", "asteroid", (ship, asteroid) => {
            destroy(asteroid)
            shake(10)
            lives -= 1

            if (lives == 0) {
                go("gameOver")
            }
        })

        onDestroy("asteroid", () => {
            wait(0, () => {
                if (get("asteroid").length === 0) {
                    go("game", level + 1);
                }
            });
        });

    })
}