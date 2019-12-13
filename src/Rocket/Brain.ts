import * as tf from '@tensorflow/tfjs'

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
    console.log('TODO: Need to implement brain mutate function')
  }

  /**
   * Crossover between brains, return a new Brain
   */
  static crossOver(brains: Array<Brain>): Brain {
    console.log(brains[0].model.getWeights())
    return brains[0] // FIXME:
  }
}

export default Brain
