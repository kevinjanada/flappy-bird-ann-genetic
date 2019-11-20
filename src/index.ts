import * as Phaser from 'phaser'
import Rocket from './objects/Rocket'

function setup() {
  const screenWidth = window.innerWidth - 20;
  const screenHeight = window.innerHeight - 20;
  function preload () {
    const remoteURL = 'http://labs.phaser.io'

    this.load.image('sky', remoteURL + '/assets/skies/space3.png');
    this.load.image('red', remoteURL + '/assets/particles/red.png');

    this.load.image(Rocket.textureKey, Rocket.image)
  }

  function create () {
    this.add.image(screenWidth/2, screenHeight/2, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    //const rocket = this.physics.add.sprite(400, 100, 'rocket');
    const rocket = new Rocket(this, {x: 400, y: 100});
    rocket.setVelocity(100, 200);
    emitter.startFollow(rocket);
  }

  function update () {
  }

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
    scene: {
      preload: preload,
      create: create,
      update: update,
    }
  };
  var game = new Phaser.Game(config);
}


setup();
