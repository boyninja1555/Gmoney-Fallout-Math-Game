import { Tile } from "./Tile"

export default class Player implements Tile {
    fillData: {
        type: "image" | "color"
        value: string
    }
    x: number
    y: number
    width: number
    height: number
    velocity: {
        x: number
        y: number
    }

    constructor(
        private name: string = "Guest",
        fillData: {
            type: "image" | "color"
            value: string
        } = {
            type: "color",
            value: "#FFFFFF"
        },
        x: number = 0,
        y: number = 0,
        width: number = 50,
        height: number = 50,
        velocity: {
            x: number,
            y: number
        }
    ) {
        this.fillData = fillData
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocity = velocity
    }

    setVelocityX(xVel: number) {
        this.velocity.x = xVel
    }

    setVelocityY(yVel: number) {
        this.velocity.y = yVel
    }

    get(): Tile {
        return {
            fillData: this.fillData,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }
}
