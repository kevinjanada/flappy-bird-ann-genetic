import * as Phaser from 'phaser'
import Rocket from '../Rocket'
import Brain from '../Rocket/Brain'
import * as asteroidImg from '../assets/Asteroid.png'
import * as backgroundImg from '../assets/Space.png'
import {NUM_OF_ROCKETS, NUM_OF_ASTEROIDS, SCENE_WIDTH, SCENE_HEIGHT} from '../config'

class PlayScene extends Phaser.Scene {
  BACKGROUND: Phaser.GameObjects.TileSprite
  ASTEROIDS: Array<Phaser.GameObjects.Sprite> = []
  ASTEROIDS_SPEED: number = 10
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
      this.createNextGenerationRockets()
      // console.log(this.ROCKET_COUNT)
      // console.log(this.ROCKETS)
      // this.scene.stop()
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
   * GA - Step 1 - INITIALIZE
   * Create rockets.
   * These rockets have their neural networks weights randomized
   */
  createRockets (numOfRockets: number) {
    
    for (let i = 0; i < numOfRockets; i++) {
      
      const rocket = new Rocket(this, i)
      this.handleCollision(rocket)
      this.ROCKETS[i] = rocket
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

  /**
   * Move Rockets,
   * detect asteroids, 
   * increment score if still alive
   */
  moveRockets () {
    this.ROCKETS.forEach(r => {
      if (r.active) {
        r.score++
        r.detectAsteroidsAndMove(this.ASTEROIDS)
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

  /**
   * Get the highest scoring rockets
   * @param numOfRockets how many rockets do you want
   */
  // getFittestRockets(numOfRockets: number): Array<Rocket> {
  //   const rockets = this.ROCKETS.map(r => r).sort((a, b) => a.fitness - b.fitness)
  //   let highestScoringRockets = []
  //   for (let i = 0; i < numOfRockets; i++) {
  //     highestScoringRockets[i] = rockets[i]
  //   }
  //   return highestScoringRockets
  // }

  /**
   * Create a new set of rockets with improved brains
   */
  createNextGenerationRockets() {
    const newRockets = []
    for (let i = 0; i < NUM_OF_ROCKETS; i++) {
      newRockets[i] = this.pickFitRocket(i)
    }
    Brain.crossOver(newRockets[0].brain, newRockets[1].brain) // FIXME: INI ngetes aja
    this.scene.stop();
    this.ROCKETS = newRockets
    this.ROCKET_COUNT = newRockets.length
  }

  /**
   * GA - Step 2 - SELECTION
   * Evaluate the normalized fitness of each element of population
   */
  pickFitRocket(id: number) {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r = r - this.ROCKETS[index].fitness;
      index++;
    }
    index--;
    let rocket = this.ROCKETS[index];
    let child = new Rocket(this, id, rocket.brain);
    // TODO:
    child.brain.mutate();
    this.handleCollision(child)
    return child;
  }

  calculateRocketFitness() {
    let totalFitness = 0
    this.ROCKETS.forEach(r => totalFitness += r.score)
    this.ROCKETS.forEach(r => r.fitness = Math.pow(r.score / totalFitness, 2))
  }
}

export default PlayScene
