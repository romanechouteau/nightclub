import { Group, SpotLight, PointLight, AmbientLight, HemisphereLight, Color,SphereBufferGeometry, Mesh, MeshBasicMaterial } from 'three';

export default class BasicLights extends Group {
  constructor(...args) {
    super(...args);

    this.red = new PointLight(0xFF0000, 2, 50);
    this.blue = new PointLight(0x0000FF, 2, 50);
    this.green = new PointLight(0x00FF00, 2, 50);
    const dir = new SpotLight(0xFFFFFF, 0.8, 7, 0.8, 1, 1);
    const ambi = new AmbientLight( 0x404040 , 0.66);
    const hemi = new HemisphereLight( 0xffffbb, 0x080820, 1.15 )

    dir.position.set(0, 3, 0);
    dir.target.position.set(0,0,0);
    this.red.castShadow = true
    this.green.castShadow = true
    this.blue.castShadow = true

    const sphere = new SphereBufferGeometry( 0.5, 16, 8 )

    this.red.position.set(0, 3, 2);
    // dir.add( new Mesh( sphere, new MeshBasicMaterial( { color: 0xff0000 } ) ) )
    this.green.position.set(0, 5, 1);
    this.blue.position.set(-2, 3, -2);

    this.add(ambi, hemi, dir, this.red, this.blue, this.green);

  }
}
