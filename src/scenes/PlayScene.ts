import * as Phaser from 'phaser'
import Rocket from '../objects/Rocket'

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  public preload () {
    const remoteURL = 'http://labs.phaser.io'
    this.load.image('sky', remoteURL + '/assets/skies/space3.png');
    this.load.image('red', remoteURL + '/assets/particles/red.png');
    this.load.image(Rocket.textureKey, Rocket.image)
  }
  public create () {
    const screenWidth = window.innerWidth - 20;
    const screenHeight = window.innerHeight - 20;
    this.add.image(screenWidth/2, screenHeight/2, 'sky');
    const rocket = new Rocket(this, {x: 400, y: 100});
    rocket.setVelocity(100, 200);
  }
  public update () {
  }
}

export default PlayScene
