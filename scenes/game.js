import { createShip } from "../entities/ship.js"
import { createBullet } from "../entities/bullet.js"
import { createAsteroid } from "../entities/asteroid.js"

const ASTEROIDS_TO_CLEAR = 8    // destroy this many to advance to the next level
const BASE_SPAWN_INTERVAL = 1.5 // seconds between spawns on level 1

export function createGameScene() {
  scene("game", (level = 1) => {
    const ship = createShip()
    const spawnInterval = Math.max(BASE_SPAWN_INTERVAL - (level - 1) * 0.3, 0.5)
    let cleared = 0

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
    })

    onKeyPress("space", () => {
      createBullet(ship)
    })

    onUpdate(() => {
      ship.pos = ship.pos.add(ship.vel.scale(dt()))
      ship.vel = ship.vel.scale(ship.drag)

      // Screen wrap - the ship stays in play forever
      if (ship.pos.x < 0) ship.pos.x = width()
      if (ship.pos.x > width()) ship.pos.x = 0
      if (ship.pos.y < 0) ship.pos.y = height()
      if (ship.pos.y > height()) ship.pos.y = 0
    })

    // All bullets move the same way, so handle them together by tag -
    // this is the ECS pattern: entities hold data, systems (here) act on it
    onUpdate("bullet", (bullet) => {
      bullet.pos = bullet.pos.add(bullet.vel.scale(dt()))
    })

    onUpdate("asteroid", (asteroid) => {
      asteroid.pos = asteroid.pos.add(asteroid.vel.scale(dt()))
    })

    loop(spawnInterval, createAsteroid)

    onCollide("bullet", "asteroid", (bullet, asteroid) => {
      destroy(bullet)
      destroy(asteroid)

      cleared += 1
      if (cleared >= ASTEROIDS_TO_CLEAR) {
        go("game", level + 1)
      }
    })

    onCollide("ship", "asteroid", () => {
      go("gameOver")
    })
  })
}