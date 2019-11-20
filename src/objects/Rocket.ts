import * as Phaser from 'phaser'
import * as rocketImg from '../assets/rocket.png' // Importing image need to use *

class Rocket extends Phaser.Physics.Arcade.Sprite {
  static textureKey = 'ROCKET'
  static image = rocketImg
  constructor(Scene: Phaser.Scene, position: { x: number, y: number }) {
    super(Scene, position.x, position.y, Rocket.textureKey)
    const rocket = Scene.physics.add.sprite(position.x, position.y, Rocket.textureKey)
    rocket.scale = 0.2
    rocket.angle = 90
    rocket.setBounce(1, 1);
    rocket.setCollideWorldBounds(true);
    return rocket
  }
}

export default Rocket
