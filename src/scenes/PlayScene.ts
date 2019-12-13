import * as Phaser from 'phaser'
import Rocket from '../Rocket'
import * as asteroidImg from '../assets/Asteroid.png'
import * as backgroundImg from '../assets/Space.png'
import {NUM_OF_ROCKETS, NUM_OF_ASTEROIDS, SCENE_WIDTH, SCENE_HEIGHT} from '../config'
import { connect } from 'http2'

class PlayScene extends Phaser.Scene {
  BACKGROUND: Phaser.GameObjects.TileSprite
  ASTEROIDS: Array<Phaser.GameObjects.Sprite> = []
  ASTEROIDS_SPEED: number = 6
  ROCKETS: Array<Rocket> = []
  ROCKET_COUNT: number = 0
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
    this.createBackground()
    this.createRockets(NUM_OF_ROCKETS)
    this.createAsteroids(NUM_OF_ASTEROIDS)
  }
  update () {
    this.moveAsteroids(this.ASTEROIDS_SPEED)
    // FIXME: Sementara matiin background, tggu fix createBackground
    this.moveBackground()
    this.moveRockets()
    if(this.ROCKET_COUNT === 0) {
      this.createRockets(NUM_OF_ROCKETS)
    }
  }
  /**
   * Add sky background to scene
   */
  createBackground () {
    this.BACKGROUND = this.add.tileSprite(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2,
      SCENE_WIDTH,
      SCENE_HEIGHT,
      'background'
    );
  }
  /**
   * Create a rocket
   */
  createRockets (numOfRockets: number) {
    const rocketSpeed = 500
    for (let i = 0; i < numOfRockets; i++) {
      let randomY = Phaser.Math.Between(0, SCENE_HEIGHT - 20)
      const rocket = new Rocket(this, {x: 300, y: randomY}, rocketSpeed, i)
      this.handleCollision(rocket)
      this.ROCKETS.push(rocket)
      this.ROCKET_COUNT++
    }
  }
  /*
   * Create Astoroids
   * @param numOfAsteroids {number}
   */
  createAsteroids (numOfAsteroids: number) {
    for (let i = 0; i < numOfAsteroids; i++) {
      const asteroid = this.physics.add.sprite(
        Phaser.Math.Between(SCENE_HEIGHT + 50, SCENE_WIDTH + 1500),
        Phaser.Math.Between(0, SCENE_HEIGHT),
        'asteroid'
      )
      asteroid.body.immovable = true
      this.ASTEROIDS.push(asteroid)
    }
  }

  handleCollision(rocket: Rocket) {
    const context = this
    function onCollision (rocket: Phaser.GameObjects.Sprite, asteroid: Phaser.GameObjects.Sprite) {
      rocket.destroy()
      context.ROCKET_COUNT--
    }
    this.physics.add.collider(rocket, this.ASTEROIDS, onCollision)
  }

  moveBackground () {
    this.BACKGROUND.tilePositionX += 0.5
  }

  moveRockets () {
    this.ROCKETS.forEach(r => {
      if (r.active) {
        r.detectAsteroids(this.ASTEROIDS)
      }
    })
  }

  /* 
   * Moves asteroid from right to left with random y position
   *
   * @function moveAsteroid
   * @param asteroid {Phaser.GameObjects.Image}
   * @param speed {number}
   * */
  moveAsteroids (speed: number) {
    this.ASTEROIDS.forEach(asteroid => {
      asteroid.x -= speed // move left
      if (asteroid.x < -50) {
        // Reset Position
        asteroid.x = SCENE_WIDTH + 20
        asteroid.y = Phaser.Math.Between(0, SCENE_HEIGHT)
      }
    })
  }
}

export default PlayScene
