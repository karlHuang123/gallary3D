import * as THREE from 'three'
import Experience from './Experience.js'
import CameraControls from './Utils/CameraControls'
import { EPS } from '@/utils/constants'

export default class Camera {
  constructor(_options) {
    // Options
    this.experience = new Experience()
    this.world = this.experience.world
    this.config = this.experience.config
    this.time = this.experience.time
    this.sizes = this.experience.sizes
    this.targetElement = this.experience.targetElement
    this.scene = this.experience.scene
    this.clock = this.experience.clock

    this.setInstance()
  }

  setInstance() {
    // Set up
    this.instance = new THREE.PerspectiveCamera(
      60,
      this.config.width / this.config.height,
      0.001,
      75
    )
    // this.instance.rotation.reorder('YXZ')
    // in order to archive FPS look, set EPSILON for the distance to the center
    this.instance.position.set(0, 0, EPS)

    this.scene.add(this.instance)

    this.setControls()

    this.p1 = new THREE.Vector3()
    this.p2 = new THREE.Vector3()
    this.p3 = new THREE.Vector3()
  }

  setControls() {
    const cameraControls = new CameraControls(this.instance, this.targetElement)
    cameraControls.update(this.clock.getDelta())
    this.controls = cameraControls
  }

  setDOC() {
    this.controls?.connectDOC()
  }

  setGyroscopeEnabled(enabled) {
    this.controls?.enableOrient(enabled)
  }

  go(wall, enableTransition = true) {
    wall.getObjectByName('cameraPositionCube').getWorldPosition(this.p2)
    wall.getWorldPosition(this.p1)
    this.p3.subVectors(this.p1, this.p2).normalize().add(this.p2)
    return this.controls.go(this.p2, this.p3, enableTransition)
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls?.update(this.clock.getDelta())
    this.instance.updateMatrixWorld() // To be used in projection
  }

  destroy() {}
}
