import * as Phaser from 'phaser'
import * as rocketImg from '../assets/Rocket.png' // Importing image need to use *
import * as _ from 'lodash'
import Brain from './Brain'
import {NUM_OF_ASTEROIDS} from '../config'

/**
* @inputNum
* - rocket's y location (1 node)
* - distance of asteroids (number of asteroids * 2 nodes)
*/
const inputNum = 1 + (NUM_OF_ASTEROIDS * 2)
const hiddenNum = 20
const outputNum = 2

type coordinates = { x: number, y: number }
type brainOutput = [number, number]

class Rocket extends Phaser.Physics.Arcade.Sprite {
  static textureKey = 'ROCKET'
  static image = rocketImg
  speed: number
  scene: Phaser.Scene
  id: number | string
  /**
   * @brain - {Neural Network}
   * @inputs
   * - rocket's y location (1 node)
   * - distance of asteroids (number of asteroids * 2 nodes)
   * @hidden
   * - ??
   * @output
   * - go up / go down / stay still (2 nodes)
   *   e.g [1,0] = go up, [0,1] = go down, [0,0] = stay still
   */
  brain: any // FIXME: this is the type of neural network
  currentDecision: 'UP' | 'DOWN' | 'STAY'
  constructor(Scene: Phaser.Scene, position: { x: number, y: number }, speed: number, id?: string | number) {
    super(Scene, position.x, position.y, Rocket.textureKey)
    this.scale = 0.8
    Scene.add.existing(this)
    Scene.physics.add.existing(this)
    this.setCollideWorldBounds(true, 0, 0.1)
    this.speed = speed;
    this.brain = new Brain(inputNum, hiddenNum, outputNum)
    if (id) this.id = id
  }
  calculateDistance(pos1: coordinates, pos2: coordinates): number {
    const horizontal = Math.abs(pos2.x - pos1.x)
    const vertical = Math.abs(pos2.y - pos1.y)
    const distance = Math.sqrt(Math.pow(horizontal, 2) + Math.pow(vertical, 2))
    return distance
  }
  detectAsteroids(asteroids: Array<Phaser.GameObjects.Image>) {
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
