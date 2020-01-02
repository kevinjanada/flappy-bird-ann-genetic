import * as Phaser from 'phaser'
import * as rocketImg from '../assets/Rocket.png' // Importing image need to use *
import * as _ from 'lodash'
import Brain from './Brain'
import {NUM_OF_ASTEROIDS, SCENE_HEIGHT} from '../config'

/**
* @inputNum
* - rocket's y location (1 node)
* - distance of asteroids (number of asteroids * 2 nodes)
*/
const inputNum = 1 + (NUM_OF_ASTEROIDS * 2)
const hiddenNum = 20
const outputNum = 2



type coordinates = { x: number, y: number }
type brainOutput = Float32Array | Int32Array | Uint8Array

class Rocket extends Phaser.Physics.Arcade.Sprite {
  static textureKey = 'ROCKET'
  static image = rocketImg
  speed: number
  scene: Phaser.Scene
  id: number | string
  score: number
  fitness: number
  /**
   * @brain - {Neural Network}
   * @inputs
   * - rocket's y location (1 node)
   * - distance of asteroids (number of asteroids * 2 nodes)
   * @hidden
   * - ??
   * @output
   * - go up / go down / stay still (2 nodes)
   *   e.g [1,0] = go up, [0,1] = go down, [0.5,0.5] = stay still
   */
  brain: Brain
  currentDecision: 'UP' | 'DOWN' | 'STAY'
  constructor(Scene: Phaser.Scene, id?: string | number, brain?: Brain, position?: { x: number, y: number }, speed?: number) {
    let y = position ? position.y : Phaser.Math.Between(0, SCENE_HEIGHT - 20)
    let x = position ? position.x : 300
    super(Scene, x, y, Rocket.textureKey)

    this.scale = 0.8
    Scene.add.existing(this)
    Scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)
    this.speed = speed || 1500;
    if (brain) {
      this.brain = brain
    } else {
      this.brain = new Brain(inputNum, hiddenNum, outputNum)
    }
    if (id) this.id = id
    this.score = 0
  }
  calculateDistance(pos1: coordinates, pos2: coordinates): number {
    const horizontal = Math.abs(pos2.x - pos1.x)
    const vertical = Math.abs(pos2.y - pos1.y)
    const distance = Math.sqrt(Math.pow(horizontal, 2) + Math.pow(vertical, 2))
    return distance
  }
  detectAsteroidsAndMove(asteroids: Array<Phaser.GameObjects.Image>) {
    const brainInputs = []
    const currPos = { x: this.x, y: this.y }
    brainInputs.push(currPos.y)
    asteroids.forEach(asteroid => {
      brainInputs.push(asteroid.x)
      brainInputs.push(asteroid.y)
    })
    const brainOutputs = this.brain.predict(brainInputs)
    this.makeDecision(brainOutputs)
    this.move()
  }
  makeDecision (brainOutput: brainOutput) {
    // brainOutput[0] == probability of moving up
    // brainOutput[1] == probability of moving down
    const diffThreshold = 0.1
    const outputDiff = Math.abs(brainOutput[0] - brainOutput[1])
    if (outputDiff <= diffThreshold) {
      this.currentDecision = 'STAY'
    } else if (brainOutput[0] > brainOutput[1]) {
      this.currentDecision = 'UP'
    } else if (brainOutput[1] > brainOutput[0]) {
      this.currentDecision = 'DOWN'
    }
  }
  move () {
    if (this.currentDecision == 'UP') { 
      this.moveUp()
    }
    if (this.currentDecision == 'DOWN') {
      this.moveDown()
    }
  }
  moveUp () {
    this.setVelocityY(-1 * this.speed)
  }
  moveDown () {
    this.setVelocityY(this.speed)
  }
}

export default Rocket
