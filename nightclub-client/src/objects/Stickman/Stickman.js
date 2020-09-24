import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import MODEL_PATH from './scene.glb'
import TEXTURE_PATH from './Texture.png'

export default class Stickman extends THREE.Group {
  constructor() {
    const loader = new GLTFLoader()

    super();

    this.name = 'stickman';

    const stickman_txt = new THREE.TextureLoader().load(TEXTURE_PATH)

    stickman_txt.flipY = false

    const stickman_mtl = new THREE.MeshPhongMaterial({
      map: stickman_txt,
      color: 0xffffff,
      skinning: true
    })


    loader.load(
      MODEL_PATH, (gltf) => {
        // A lot is going to happen here
        const model = gltf.scene
        const fileAnimations = gltf.animations

        model.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true
            o.receiveShadow = true
            o.material = stickman_mtl
          }
        })
        model.scale.set(1, 1, 1)
        model.position.y = 0

        this.mixer = new THREE.AnimationMixer(model)
        this.idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'breathing')
        this.danceAnimSlow = THREE.AnimationClip.findByName(fileAnimations, 'snake hip hop')
        this.danceAnimMedium = THREE.AnimationClip.findByName(fileAnimations, 'step hip hop')
        this.danceAnimFast = THREE.AnimationClip.findByName(fileAnimations, 'dancing running')
        this.sadAnim = THREE.AnimationClip.findByName(fileAnimations, 'sad')
        this.idle = this.mixer.clipAction(this.idleAnim)
        this.danceSlow = this.mixer.clipAction(this.danceAnimSlow)
        this.danceMedium = this.mixer.clipAction(this.danceAnimMedium)
        this.danceFast = this.mixer.clipAction(this.danceAnimFast)
        this.sad = this.mixer.clipAction(this.sadAnim)
        this.idle.play()

        this.add(model)
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error)
      }
    )
  }

  dancing(bpm) {
    const animDuration = 60 / bpm

    let dance = this.danceFast
    let scale = (dance._clip.duration / 14) / animDuration
    if (bpm < 100) {
      dance = this.danceSlow
      scale = (dance._clip.duration / 24) / animDuration
    } else if (bpm < 160) {
      dance = this.danceMedium
      scale = (dance._clip.duration / 12) / animDuration
    }

    if (this.sad.isRunning()) {
      dance.stop()
      dance.crossFadeFrom(this.sad, 0.2).play()
    } else if (this.idle.isRunning()) {
      dance.stop()
      dance.crossFadeFrom(this.idle, 0.2).play()
    }
    dance.timeScale = scale
  }

  stopDancing() {
    if (this.danceFast.isRunning()) {
      this.sad.stop()
      this.sad.crossFadeFrom(this.danceFast, 0.2).play()
    } else if (this.danceMedium.isRunning()) {
      this.sad.stop()
      this.sad.crossFadeFrom(this.danceMedium, 0.2).play()
    } else if (this.danceSlow.isRunning()) {
      this.sad.stop()
      this.sad.crossFadeFrom(this.danceSlow, 0.2).play()
    }
  }
}