import * as Phaser from 'phaser'
import Rocket from '../Rocket'
import * as asteroidImg from '../assets/asteroid.svg'
import * as backgroundImg from '../assets/background.jpg'
import {NUM_OF_ROCKETS, NUM_OF_ASTEROIDS} from '../config'

class PlayScene extends Phaser.Scene {
  BACKGROUND: Phaser.GameObjects.TileSprite
  ASTEROIDS: Array<Phaser.GameObjects.Sprite> = []
  ASTEROIDS_SPEED: number = 6
  ROCKETS: Array<Rocket> = []
  constructor() {
    super('PlayScene')
  }
  preload () {
    this.load.image('background', backgroundImg);
    this.load.image(Rocket.textureKey, Rocket.image)
    this.load.image('asteroid', asteroidImg)
  }
  create () {
    // FIXME: Background bikin yang low res. krn performance nya slow
    //this.createBackground()
    this.createRockets(NUM_OF_ROCKETS)
    this.createAsteroids(NUM_OF_ASTEROIDS)
    this.handleCollision()
  }
  update () {
    this.ASTEROIDS.forEach(asteroid => this.moveAsteroid(asteroid, this.ASTEROIDS_SPEED))
    // FIXME: Sementara matiin background, tggu fix createBackground
    //this.moveBackground()
    this.moveRockets()
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
  createRockets (numOfRockets: number) {
    const rocketSpeed = 500
    for (let i = 0; i < numOfRockets; i++) {
      let randomY = Phaser.Math.Between(0, window.innerHeight - 20)
      const rocket = new Rocket(this, {x: 300, y: randomY}, rocketSpeed, `Rocket-${i}`)
      this.ROCKETS.push(rocket)
    }
  }
  /*
   * Create Astoroids
   * @param numOfAsteroids {number}
   */
  createAsteroids (numOfAsteroids: number) {
    for (let i = 0; i < numOfAsteroids; i++) {
      const asteroid = this.physics.add.sprite(
        Phaser.Math.Between(window.innerWidth + 50, window.innerWidth + 1500),
        Phaser.Math.Between(0, window.innerHeight),
        'asteroid'
      )
      this.ASTEROIDS.push(asteroid)
    }
  }
  handleCollision () {
    function onCollision (rocket: Phaser.GameObjects.Sprite, asteroid: Phaser.GameObjects.Sprite) {
      rocket.destroy()
    }
    this.physics.add.collider(this.ROCKETS.map(r => r.gameObj), this.ASTEROIDS, onCollision)
  }
  moveBackground () {
    this.BACKGROUND.tilePositionX += 0.5
  }
  moveRockets () {
    this.ROCKETS.forEach(r => r.detectAsteroids(this.ASTEROIDS))
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
}

export default PlayScene
