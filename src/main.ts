import Game from "./core/Game"

const mode = new URLSearchParams(window.location.search).get("mode") || "singleplayer"

const canvas = document.getElementById("game-view-main") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

canvas.addEventListener("contextmenu", event => {
    event.preventDefault()
})

const game = new Game(canvas, ctx, mode)
game.start()
