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

export function createGameScene(isMobile = false) {
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
            text(score.toString(), { size: 30 }),
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

        const turnLeft  = () => { ship.angle -= ship.turnSpeed * dt() }
        const turnRight = () => { ship.angle += ship.turnSpeed * dt() }

        const thrustOn =  () => {
            const facing = Vec2.fromAngle(ship.angle)
            ship.vel = ship.vel.add(facing.scale(ship.thrust * dt()))
            flame.opacity = 1
        }
        const thrustOff = () => { flame.opacity = 0 }

        const fire = () => { createBullet(ship) }

        let leftButton, rightButton, upButton, fireButton
        let isTouchingButton = () => false

        if (isMobile) {
            const controlSize = (height() + width()) / 20
            const inset = 20

            fireButton = add([
                rect(controlSize * 1.5, controlSize * 1.5, { radius: 30 }),
                pos(width() - (inset + controlSize) * 1.5, height() - (inset + controlSize) * 1.5),
                area(),
                color(WHITE),
                opacity(0.1),
                fixed(),
            ])
            leftButton = add([
                rect(controlSize, controlSize, { radius: 20 }),
                pos(inset, height() - inset - controlSize),
                area(),
                color(WHITE),
                opacity(0.1),
                fixed(),
            ])
            rightButton = add([
                rect(controlSize, controlSize, { radius: 20 }),
                pos(inset + controlSize * 2, height() - inset - controlSize),
                area(),
                color(WHITE),
                opacity(0.1),
                fixed(),
            ])
            upButton = add([
                rect(controlSize, controlSize, { radius: 20 }),
                pos(inset + controlSize, height() - inset - controlSize * 2),
                area(),
                color(WHITE),
                opacity(0.1),
                fixed(),
            ])

            upButton.add([
                text("△", { size: 50 }),
                pos(controlSize * 0.5, controlSize * 0.5),
                anchor("center"),
                opacity(0.2),
            ])
            leftButton.add([
                text("◁", { size: 50 }),
                pos(controlSize * 0.5, controlSize * 0.5),
                anchor("center"),
                opacity(0.2),
            ])
            rightButton.add([
                text("▷", { size: 50 }),
                pos(controlSize * 0.5, controlSize * 0.5),
                anchor("center"),
                opacity(0.2),
            ])
            fireButton.add([
                text("⌖", { size: 50 }),
                pos(controlSize * 0.75, controlSize * 0.75),
                anchor("center"),
                opacity(0.2),
            ])

            fireButton.onClick(fire)

            const activeTouches = new Map()

            onTouchStart((touchPos, touch) => activeTouches.set(touch.identifier, touchPos))
            onTouchMove((touchPos, touch)  => activeTouches.set(touch.identifier, touchPos))
            onTouchEnd((touchPos, touch)   => activeTouches.delete(touch.identifier))

            isTouchingButton = (button) => {
                if (!button) return false

                for (const touchPos of activeTouches.values()) {
                    if (button.hasPoint(touchPos)) return true
                }
                return false
            }
        }

        onKeyPress("z", fire)

        onUpdate(() => {
            const turningLeft  = isKeyDown("left")  || isTouchingButton(leftButton)
            const turningRight = isKeyDown("right") || isTouchingButton(rightButton)
            const thrusting    = isKeyDown("up")    || isTouchingButton(upButton)

            if (turningLeft) turnLeft()
            if (turningRight) turnRight()

            if (thrusting) thrustOn()
            else thrustOff()
        })

        onUpdate(() => {
            ship.pos = ship.pos.add(ship.vel.scale(dt()))
            ship.vel = ship.vel.scale(ship.drag)

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

            const nextScale = asteroid.scaleFactor * ASTEROID_SCALE_MULT

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

            addKaboom(ship.pos)

            if (lives == 0) {
                destroy(ship)
                wait(2.0, () => {
                    go("gameOver", level, score)
                })
            }
        })

        onDestroy("asteroid", () => {
            wait(0, () => {
                if (get("asteroid").length === 0) {
                    wait(2.0, () => {
                        go("game", level + 1, lives + 1, score)
                    })
                }
            })
        })

    })
}