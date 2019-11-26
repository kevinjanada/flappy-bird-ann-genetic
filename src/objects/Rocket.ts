import * as Phaser from 'phaser'
import * as rocketImg from '../assets/rocket.png' // Importing image need to use *

type coordinates = { x: number, y: number }
class Rocket {
  static textureKey = 'ROCKET'
  static image = rocketImg
  handle: Phaser.Physics.Arcade.Sprite
  speed: number
  constructor(Scene: Phaser.Scene, position: { x: number, y: number }, speed: number) {
    this.handle = Scene.physics.add.sprite(position.x, position.y, Rocket.textureKey)
    this.handle.scale = 0.2
    this.handle.angle = 90
    this.handle.setBounce(0, 1);
    this.handle.setCollideWorldBounds(true);
    this.speed = speed;
  }
  moveUp() {
    this.handle.setVelocityY(-1 * this.speed)
  }
  moveDown() {
    this.handle.setVelocityY(this.speed)
  }
  calculateDistance(pos1: coordinates, pos2: coordinates): number {
    const horizontal = Math.abs(pos2.x - pos1.x)
    const vertical = Math.abs(pos2.y - pos1.y)
    const distance = Math.sqrt(Math.pow(horizontal, 2) + Math.pow(vertical, 2))
    return distance
  }
  detectAsteroids(asteroids: Array<Phaser.GameObjects.Image>) {
    const currPos = { x: this.handle.x, y: this.handle.y }
    asteroids.forEach(asteroid => {
      const asteroidPos = { x: asteroid.x, y: asteroid.y }
      const distance = this.calculateDistance(currPos, asteroidPos)
      if (distance < 300) {
        console.log('Asteroid distance: ', distance)
      }
    })
  }
}

export default Rocket
