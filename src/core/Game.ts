import { Renderer } from "./Renderer"
import { Tile } from "./Tile"
import Player from "./Player"

export default class Game {
    private renderer: Renderer | null = null
    private lastTime: number = 0

    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D,
        private mode: string,
        private player: Player = new Player("Guest", { type: "color", value: "#FFFFFF" }, 0, 0, 50, 50, { x: 0, y: 0 })
    ) {}

    async start() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        const playerTile = this.player.get()

        let map: Tile[] = []

        if (this.mode === "singleplayer") {
            const mapUrl = "/src/built-in-server/map.txt"
            const width = 50
            const height = 50

            const mapData = await this.fetchMapData(mapUrl)
            map = this.parseMapData(mapData, width, height)
        }

        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
        })

        const playerSpeed = 5

        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "a":
                    this.player.setVelocityX(-playerSpeed)
                    break
                case "d":
                    this.player.setVelocityX(playerSpeed)
                    break
                case "w":
                    this.player.setVelocityY(-playerSpeed)
                    break
                case "s":
                    this.player.setVelocityY(playerSpeed)
                    break
            }
        })

        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "a":
                case "d":
                    this.player.setVelocityX(0)
                    break
                case "w":
                case "s":
                    this.player.setVelocityY(0)
                    break
            }
        })

        this.renderer = new Renderer(this.canvas, this.ctx, map, playerTile)
        this.renderer.startRenderLoop()
        this.gameLoop()
    }

    private async gameLoop() {
        const now = performance.now()
        const deltaTime = now - this.lastTime

        this.lastTime = now
        this.player.x += this.player.velocity.x
        this.player.y += this.player.velocity.y
        this.renderer?.setTiles([ ...this.parseMapData(await this.fetchMapData("/src/built-in-server/map.txt"), 50, 50), this.player.get() ])
        requestAnimationFrame(() => this.gameLoop())
    }

    private async fetchMapData(url: string): Promise<string> {
        try {
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Failed to fetch map data from ${url}`)
            }

            return await response.text()
        } catch (error) {
            console.error(error)
            return ""
        }
    }

    private parseMapData(mapData: string, tileWidth: number, tileHeight: number): Tile[] {
        const tiles: Tile[] = []
        const rows = mapData.split("\n")

        let y = 0

        rows.forEach((row) => {
            const tileList = row.trim().split(" ")

            let x = 0

            tileList.forEach((tileType) => {
                tiles.push({
                    fillData: {
                        type: "image",
                        value: `/src/tiles/${tileType}.png`,
                    },
                    x,
                    y,
                    width: tileWidth,
                    height: tileHeight,
                })

                x += tileWidth
            })

            y += tileHeight
        })

        return tiles
    }
}
