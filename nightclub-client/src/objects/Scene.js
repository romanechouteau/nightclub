import { Group, Clock } from 'three';
import Floor from './Floor/Floor.js';
import Stickman from './Stickman/Stickman.js';
import BasicLights from './Lights.js';

export default class SeedScene extends Group {
  constructor() {
    super();

    this.clock = new Clock()

    const floor = new Floor();
    this.stickman = new Stickman();
    this.lights = new BasicLights();

    this.add(floor,this.stickman,this.lights);
  }

  update(timeStamp) {
    if (this.stickman.mixer) {
      this.stickman.mixer.update(this.clock.getDelta())
    }
    this.rotation.y = timeStamp / 10000;
    this.lights.red.position.x = Math.sin( timeStamp * 0.001 ) * 4;
    this.lights.red.position.y = Math.cos( timeStamp * 0.001 ) * 4;
    this.lights.red.position.z = Math.cos( timeStamp * 0.001 ) * 4;

    this.lights.green.position.x = Math.cos( timeStamp * 0.001 ) * 3;
    this.lights.green.position.y = Math.sin( timeStamp * 0.001 ) * 3;
    this.lights.green.position.z = Math.sin( timeStamp * 0.001 ) * 3;

    this.lights.blue.position.x = - Math.sin( timeStamp * 0.001 ) * 5;
    this.lights.blue.position.y = - Math.cos( timeStamp * 0.001 ) * 5;
    this.lights.blue.position.z = Math.sin( timeStamp * 0.001 ) * 5;
  }

  dance(bpm) {
    this.stickman.dancing(bpm)
  }

  stopDance() {
    this.stickman.stopDancing()
  }
}