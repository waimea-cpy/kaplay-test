import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs"

import { createSplashScene } from "./scenes/splash.js"
import { createGameScene } from "./scenes/game.js"
import { createGameOverScene } from "./scenes/gameOver.js"

kaplay({ background: [20, 20, 30] })

createSplashScene()
createGameScene()
createGameOverScene()

go("splash")

