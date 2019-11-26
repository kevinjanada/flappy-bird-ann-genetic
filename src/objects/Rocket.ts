import * as Phaser from 'phaser'
import * as rocketImg from '../assets/rocket.png' // Importing image need to use *
import * as _ from 'lodash'
import * as tf from '@tensorflow/tfjs'

const ASTEROIDS_NUM = 5
const INPUT_NUM = (1 + (ASTEROIDS_NUM * 2)) // rocket's y and each asteroid's x,y
const HIDDEN_NUM = 4
const OUTPUT_NUM = 2


type Weights = {
  hiddenWeights: tf.Tensor2D,
  outputWeights: tf.Tensor2D
}
type Biases = {
  hiddenBiases: tf.Tensor,
  outputBiases: tf.Tensor
}
type BrainInput = {
  y: number,
  asteroidsPositions: Array<{x: number, y: number}>
}
class Brain {
  inputs: tf.Tensor
  hidden: tf.Tensor
  hiddenWeights: tf.Tensor2D 
  outputWeights: tf.Tensor2D
  hiddenBiases: tf.Tensor
  outputBiases: tf.Tensor
  constructor(weights?: Weights, biases?: Biases) {
    if (weights) {
      this.hiddenWeights = weights.hiddenWeights;
      this.outputWeights = weights.outputWeights;
    }
    if (biases) {
      this.hiddenBiases = biases.hiddenBiases;
      this.outputBiases = biases.outputBiases;
    }
    if (!weights && !biases) {
      this.hiddenWeights = tf.randomUniform([INPUT_NUM, HIDDEN_NUM])
      this.outputWeights = tf.randomUniform([HIDDEN_NUM, OUTPUT_NUM])
      this.hiddenBiases = tf.randomUniform([HIDDEN_NUM])
      this.outputBiases = tf.randomUniform([OUTPUT_NUM])
    }
  }
  compute(brainInput: BrainInput) {
    const input = [brainInput.y]
    brainInput.asteroidsPositions.forEach(pos => {
      input.push(pos.x)
      input.push(pos.y)
    })
    const tensorInput = tf.tensor1d(input)
    
    // TODO: how to multiply tensors????
    let hidden = tf.add(tf.matMul(this.hiddenWeights, tensorInput), this.hiddenBiases)
  }
}

type coordinates = { x: number, y: number }
type brainOutput = [number, number]
class Rocket {
  static textureKey = 'ROCKET'
  static image = rocketImg
  gameObj: Phaser.Physics.Arcade.Sprite
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
    this.scene = Scene
    this.gameObj = Scene.physics.add.sprite(position.x, position.y, Rocket.textureKey)
    this.gameObj.scale = 0.2
    this.gameObj.angle = 90
    this.gameObj.setBounce(0, 1);
    this.gameObj.setCollideWorldBounds(true);
    this.speed = speed;
    if (id) this.id = id
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
    })
  }
  makeDecision (brainOutput: brainOutput) {
    const up = [1,0]
    const down = [0,1]
    const stay = [0,0]
    if (_.isEqual(brainOutput, up)) {
      this.currentDecision = 'UP'
    }
    if (_.isEqual(brainOutput, down)) {
      this.currentDecision = 'DOWN'
    }
    if (_.isEqual(brainOutput, stay)) {
      this.currentDecision = 'STAY'
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
    this.gameObj.setVelocityY(-1 * this.speed)
  }
  moveDown () {
    this.gameObj.setVelocityY(this.speed)
  }
}

export default Rocket
