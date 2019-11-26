import * as Phaser from 'phaser'
import Rocket from '../objects/Rocket'
import * as asteroidImg from '../assets/asteroid.svg'
import * as backgroundImg from '../assets/background.jpg'

class PlayScene extends Phaser.Scene {
  ASTEROIDS: Array<Phaser.GameObjects.Image> 
  BACKGROUND: Phaser.GameObjects.TileSprite
  NUM_OF_ASTEROIDS: number
  ROCKET: Rocket
  constructor() {
    super('PlayScene')
    this.ASTEROIDS = []
    this.NUM_OF_ASTEROIDS = 6
  }
  preload () {
    this.load.image('background', backgroundImg);
    this.load.image(Rocket.textureKey, Rocket.image)
    this.load.image('asteroid', asteroidImg)
  }
  create () {
    this.createBackground()
    this.createRocket()
    this.createAsteroids(5)
  }
  update () {
    this.ASTEROIDS.forEach(asteroid => this.moveAsteroid(asteroid, this.NUM_OF_ASTEROIDS))
    this.moveBackground()
  }
  /**
   * Add sky background to scene
   */
  createBackground () {
    const screenWidth = window.innerWidth - 20;
    const screenHeight = window.innerHeight - 20;
    this.BACKGROUND = this.add.tileSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight, 'background');
  }
  /**
   * Create a rocket
   */
  createRocket () {
    this.ROCKET = new Rocket(this, {x: 400, y: 100});
    this.ROCKET.setVelocity(100, 200);
  }
  /*
   * Create Astoroids
   * @param numOfAsteroids {number}
   */
  createAsteroids (numOfAsteroids: number) {
    for (let i = 0; i < numOfAsteroids; i++) {
      const asteroid = this.add.image(
        Phaser.Math.Between(window.innerWidth + 50, window.innerWidth + 1500),
        Phaser.Math.Between(0, window.innerHeight),
        'asteroid'
      )
      this.ASTEROIDS.push(asteroid)
    }
  }
  /* 
   * Moves asteroid from right to left with random y position
   *
   * @function moveAsteroid
   * @param asteroid {Phaser.GameObjects.Image}
   * @param speed {number}
   * */
  moveAsteroid (asteroid: Phaser.GameObjects.Image, speed: number) {
    asteroid.x -= speed // move left
    if (asteroid.x < -50) {
      // Reset Position
      asteroid.x = window.innerWidth + 20
      asteroid.y = Phaser.Math.Between(0, window.innerHeight)
    }
  }
  moveBackground () {
    this.BACKGROUND.tilePositionX += 0.5
  }
}

export default PlayScene
