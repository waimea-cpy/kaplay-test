import { createShip } from "../entities/ship.js"
import { createBullet } from "../entities/bullet.js"
import { createAsteroid } from "../entities/asteroid.js"

const ASTEROID_COUNT_BASE  = 6
const ASTEROID_SPAWN_DELAY = 2.0
const ASTEROID_START_SCALE = 2.0
const ASTEROID_MIN_SCALE   = 0.5
const ASTEROID_SCALE_MULT  = 0.5
const ASTEROID_SPEED_MULT  = 1.5
const ASTEROID_MIN_SPREAD  = 15
const ASTEROID_MAX_SPREAD  = 45

const START_LIVES = 3

export function createGameScene() {
    scene("game", (level = 1, lives = START_LIVES, score = 0) => {
        const [ship, flame] = createShip()

        const asteroidsToSpawn = level + ASTEROID_COUNT_BASE - 1
        const startingScale = ASTEROID_START_SCALE

        wait(ASTEROID_SPAWN_DELAY, () => {
            for (let i = 0; i < asteroidsToSpawn; i++) {
                createAsteroid(startingScale)
            }
        })

        const levelLabel = add([
            text(`Level ${level}`, { size: 20 }),
            pos(20, 20),
            anchor("topleft"),
            color(WHITE),
            fixed(),
        ])

        const scoreLabel = add([
            text(score.toString(), { size: 40 }),
            pos(width() / 2, 20),
            anchor("top"),
            color(WHITE),
            fixed(),
        ])

        const livesLabel = add([
            text(`Lives ${lives}`, { size: 20 }),
            pos(width() - 20, 20),
            anchor("topright"),
            color(WHITE),
            fixed(),
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

            const asteroidScore = Math.floor(5 / asteroid.scaleFactor) * 10
            score += asteroidScore
            scoreLabel.text = score.toString()

            const nextScale = asteroid.scaleFactor * ASTEROID_SCALE_MULT;

            if (nextScale >= ASTEROID_MIN_SCALE) {
                const parentVelocity = asteroid.vel
                const parentSpeed = parentVelocity.len()
                const parentAngle = parentVelocity.angle()

                const childSpeed = parentSpeed * ASTEROID_SPEED_MULT

                const deflectionAngle = rand(ASTEROID_MIN_SPREAD, ASTEROID_MAX_SPREAD)
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
            livesLabel.text = `Lives: ${lives}`

            if (lives == 0) {
                go("gameOver", level, score)
            }
        })

        onDestroy("asteroid", () => {
            wait(0, () => {
                if (get("asteroid").length === 0) {
                    go("game", level + 1, lives + 1, score);
                }
            });
        });

    })
}