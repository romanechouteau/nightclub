import { Group, PlaneGeometry, MeshPhongMaterial, Mesh  } from 'three';

export default class Floor extends Group {
  constructor() {
    super();

    this.name = 'floor';

    // FLOOR
    const floorGeometry = new PlaneGeometry(10, 10, 1, 1)
    const floorMaterial = new MeshPhongMaterial({
      color: 0x222222,
      shininess: 0,
    })
    const floor = new Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -0.5 * Math.PI
    floor.receiveShadow = true
    floor.position.y = 0

    this.add(floor);
  }
}