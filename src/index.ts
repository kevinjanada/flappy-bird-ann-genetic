import * as Phaser from 'phaser'
import * as tf from '@tensorflow/tfjs'
import PlayScene from './scenes/PlayScene'


const BACKGROUND_HEIGHT = 800
const BACKGROUND_WIDTH = 450

let game

function main() {
  // Tensorflow setup
  tf.setBackend('cpu')

  // Game Setup
  var config = {
    type: Phaser.AUTO,
    width: BACKGROUND_HEIGHT,
    height: BACKGROUND_WIDTH,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }
      }
    },
    scene: [PlayScene]
  };
  game = new Phaser.Game(config);
}


main();
