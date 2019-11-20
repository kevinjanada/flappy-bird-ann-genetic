import * as Phaser from 'phaser'
import * as rocketImg from './assets/rocket.png' // Importing image need to use *

function setup() {
  console.log('hahaha')
  const screenWidth = window.innerWidth - 20;
  const screenHeight = window.innerHeight - 20;
  function preload () {
    //this.load.setBaseURL('http://labs.phaser.io');
    const remoteURL = 'http://labs.phaser.io'

    this.load.image('sky', remoteURL + '/assets/skies/space3.png');
    this.load.image('red', remoteURL + '/assets/particles/red.png');
    //this.load.image('logo', 'assets/sprites/phaser3-logo.png');

    this.load.image('rocket', rocketImg)
  }

  function create () {
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'rocket');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
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
      create: create
    }
  };
  var game = new Phaser.Game(config);
}


setup();
