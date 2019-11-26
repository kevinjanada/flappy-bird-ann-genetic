import * as Phaser from 'phaser'
import * as rocketImg from '../assets/rocket.png' // Importing image need to use *

type coordinates = { x: number, y: number }
class Rocket {
  static textureKey = 'ROCKET'
  static image = rocketImg
  gameObj: Phaser.Physics.Arcade.Sprite
  speed: number
  scene: Phaser.Scene
  id: number | string
  constructor(Scene: Phaser.Scene, position: { x: number, y: number }, speed: number, id?: string | number) {
    this.scene = Scene
    this.gameObj = Scene.physics.add.sprite(position.x, position.y, Rocket.textureKey)
    this.gameObj.scale = 0.2
    this.gameObj.angle = 90
    this.gameObj.setBounce(0, 1);
    this.gameObj.setCollideWorldBounds(true);
    this.speed = speed;
    if (id) this.id = id
  }
  moveUp() {
    this.gameObj.setVelocityY(-1 * this.speed)
  }
  moveDown() {
    this.gameObj.setVelocityY(this.speed)
  }
  calculateDistance(pos1: coordinates, pos2: coordinates): number {
    const horizontal = Math.abs(pos2.x - pos1.x)
    const vertical = Math.abs(pos2.y - pos1.y)
    const distance = Math.sqrt(Math.pow(horizontal, 2) + Math.pow(vertical, 2))
    return distance
  }
  detectAsteroids(asteroids: Array<Phaser.GameObjects.Image>) {
    const currPos = { x: this.gameObj.x, y: this.gameObj.y }
    asteroids.forEach(asteroid => {
      const asteroidPos = { x: asteroid.x, y: asteroid.y }
      const distance = this.calculateDistance(currPos, asteroidPos)
    })
  }
}

export default Rocket
