import { Tile } from "./Tile"

class Renderer {
    private preloadedImages: Map<string, HTMLImageElement> = new Map()

    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D,
        private tiles: Tile[],
        private playerTile: Tile
    ) {
        this.preloadImages()
    }

    private preloadImages() {
        this.tiles
            .filter(tile => tile.fillData.type === "image")
            .forEach(tile => {
                const { value } = tile.fillData

                if (!this.preloadedImages.has(value)) {
                    const image = new Image()
                    image.src = value
                    image.onload = () => {
                        this.preloadedImages.set(value, image)
                    }
                    image.onerror = () => {
                        console.error(`Failed to load image: ${value}`)
                    }
                }
            })
    }

    startRenderLoop() {
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.tiles.forEach(tile => {
            const { type, value } = tile.fillData

            if (type === "image") {
                const image = this.preloadedImages.get(value)

                if (image) {
                    this.ctx.drawImage(image, tile.x, tile.y, tile.width, tile.height)
                }
            } else {
                this.ctx.fillStyle = value
                this.ctx.fillRect(tile.x, tile.y, tile.width, tile.height)
            }
        })

        if (this.playerTile.fillData.type === "image") {
            const image = this.preloadedImages.get(this.playerTile.fillData.value)

            if (image) {
                this.ctx.drawImage(image, this.playerTile.x, this.playerTile.y, this.playerTile.width, this.playerTile.height)
            }
        } else {
            this.ctx.fillStyle = this.playerTile.fillData.value
            this.ctx.fillRect(this.playerTile.x, this.playerTile.y, this.playerTile.width, this.playerTile.height)
        }

        requestAnimationFrame(this.startRenderLoop.bind(this))
    }

    setTiles(newTiles: Tile[]) {
        this.tiles = newTiles
        this.preloadImages()
    }

    addTile(tile: Tile) {
        this.tiles.push(tile)

        if (tile.fillData.type === "image") {
            const { value } = tile.fillData

            if (!this.preloadedImages.has(value)) {
                const image = new Image()
                image.src = value
                image.onload = () => {
                    this.preloadedImages.set(value, image)
                }
                image.onerror = () => {
                    console.error(`Failed to load image: ${value}`)
                }
            }
        }
    }

    removeTile(index: number) {
        this.tiles.splice(index, 1)
    }
}

export { Renderer }
