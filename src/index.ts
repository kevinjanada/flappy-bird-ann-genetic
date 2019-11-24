import * as Phaser from 'phaser'
import PlayScene from './scenes/PlayScene'

let game

function main() {
  const screenWidth = window.innerWidth - 20;
  const screenHeight = window.innerHeight - 20;
  var config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    },
    scene: [PlayScene]
  };
  game = new Phaser.Game(config);
}


main();
