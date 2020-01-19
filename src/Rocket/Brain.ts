import * as tf from '@tensorflow/tfjs'
import {NUM_OF_ASTEROIDS} from '../config'

export const defaultConfig = {
inputNum: 1 + (NUM_OF_ASTEROIDS * 2),
hiddenNum: 20,
outputNum: 2,
}

class Brain {
  model: tf.Sequential
  inputNum: number
  hiddenNum: number
  outputNum: number
  constructor(inputNum: number, hiddenNum: number, outputNum: number, model?: tf.Sequential)
  constructor(inputNum?: number, hiddenNum?: number, outputNum?: number, model?: tf.Sequential) {
    this.inputNum = inputNum
    this.hiddenNum = hiddenNum
    this.outputNum = outputNum
    if (model) {
      this.model = model
    } else {
      this.model = this.createModel()
    }
  }

  createModel(): tf.Sequential {
    const model = tf.sequential()
    const hidden = tf.layers.dense({
      units: this.hiddenNum,
      inputShape: [this.inputNum],
      activation: 'sigmoid'
    })
    model.add(hidden)
    const output = tf.layers.dense({
      units: this.outputNum,
      activation: 'softmax'
    })
    model.add(output)
    return model
  }

  predict(input: Array<number>) {
    const xs = tf.tensor2d([input])
    const ys = this.model.predict(xs) as tf.Tensor
    const outputs = ys.dataSync()
    return outputs
  }

  copy(): Brain {
    const modelCopy = this.createModel()
    const weights = this.model.getWeights()
    modelCopy.setWeights(weights)
    return new Brain(null, null, null, modelCopy)
  }

  mutate() {
    //console.log('TODO: Need to implement brain mutate function')
  }

  /**
   * Crossover between brains, return a new Brain
   */
  static crossOver(brainOne: Brain, brainTwo: Brain): Brain {
    const brainOneWeights = brainOne.model.getWeights()
    const brainTwoWeights = brainTwo.model.getWeights()
    const b1_inputToHiddenWeights = brainOneWeights[0]
    const b1_hiddenBias = brainOneWeights[1]
    const b1_hiddenToOutputWeights = brainOneWeights[2]
    const b1_outputBias = brainOneWeights[3]

    const b2_inputToHiddenWeights = brainTwoWeights[0]
    const b2_hiddenBias = brainTwoWeights[1]
    const b2_hiddenToOutputWeights = brainTwoWeights[2]
    const b2_outputBias = brainTwoWeights[3]

    console.log(brainOneWeights)

    const new_inputToHiddenWeights = tf.concat([
      b1_inputToHiddenWeights.slice([0,0], [4,20]),
      b2_inputToHiddenWeights.slice([3, 0], [3, 20])
    ])

    const new_hiddenBias = tf.concat([
      b1_hiddenBias.slice([0], [10]),
      b2_hiddenBias.slice([10], [10])
    ])

    const new_hiddenToOutputWeights = tf.concat([
      b1_hiddenToOutputWeights.slice([0,0], [10, 2]),
      b2_hiddenToOutputWeights.slice([10,0], [10, 2])
    ])

    const new_outputBias = tf.concat([
      b1_outputBias.slice([0], [1]),
      b2_outputBias.slice([1], [1])
    ])

    const newWeights = [
      new_inputToHiddenWeights,
      new_hiddenBias,
      new_hiddenToOutputWeights,
      new_outputBias,
    ]

    const { inputNum, hiddenNum, outputNum } = defaultConfig
    
    const newBrain =  new Brain(inputNum, hiddenNum, outputNum)
    newBrain.model.setWeights(newWeights)
    return newBrain
  }
}

export default Brain
