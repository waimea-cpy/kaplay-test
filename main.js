import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs"

import { createSplashScene } from "./scenes/splash.js"
import { createGameScene } from "./scenes/game.js"
import { createGameOverScene } from "./scenes/gameOver.js"

kaplay({
    background: [0, 0, 0],
})

const isMobile = isTouchscreen() && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

createSplashScene(isMobile)
createGameScene(isMobile)
createGameOverScene(isMobile)

go("splash")

