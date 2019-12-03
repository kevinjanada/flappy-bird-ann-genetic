import * as tf from '@tensorflow/tfjs'

class Brain {
  model: tf.Sequential
  inputNum: number
  hiddenNum: number
  outputNum: number
  constructor(inputNum: number, hiddenNum: number, outputNum: number) {
    this.inputNum = inputNum
    this.hiddenNum = hiddenNum
    this.outputNum = outputNum
    this.createModel()
  }

  createModel() {
    this.model = tf.sequential()
    const hidden = tf.layers.dense({
      units: this.hiddenNum,
      inputShape: [this.inputNum],
      activation: 'sigmoid'
    })
    this.model.add(hidden)
    const output = tf.layers.dense({
      units: this.outputNum,
      activation: 'softmax'
    })
    this.model.add(output)
  }

  predict(input: Array<number>) {
    const xs = tf.tensor2d([input])
    const ys = this.model.predict(xs) as tf.Tensor
    const outputs = ys.dataSync()
    console.log(outputs)
    return outputs
  }
}

export default Brain
