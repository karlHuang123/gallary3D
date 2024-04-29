import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import GUI from 'lil-gui'
import { Sky } from 'three/examples/jsm/objects/Sky'

import EventEmitter from './Utils/EventEmitter.js'
import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'

import MouseManager from './MouseManager.js'
import Resources from './Resources.js'
import Renderer from './Renderer.js'
import Camera from './Camera.js'
import World from './World.js'

import assets from './assets.js'

export default class Experience extends EventEmitter {
  static instance

  constructor(_options = {}) {
    super()
    if (Experience.instance) {
      return Experience.instance
    }
    Experience.instance = this

    // Options
    this.targetElement = _options.targetElement

    if (!this.targetElement) {
      // console.warn("Missing 'targetElement' property")
      // return
      const div = document.createElement('div')
      div.className = 'experience'
      this.targetElement = div
    }

    this.clock = new THREE.Clock()
    this.time = new Time()
    this.sizes = new Sizes()
    this.setConfig()
    this.setScene()
    this.setResources()
    this.initSky()
    this.setWorld()
    this.setMouseManager()
    this.sizes.on('resize', () => {
      this.resize()
    })

    this.update()
  }

  mount(domElement) {
    domElement.appendChild(this.targetElement)
  }

  unmount() {
    this.targetElement.parentNode?.removeChild(this.targetElement)
  }

  setMouseManager() {
    this.mouseManager = new MouseManager()
    this.mouseManager.on('wallclick', (wall) => {
      this.trigger('wallclick', [wall.userData.workIndex])
      const moved = this.camera.go(wall)
      if (!moved) {
        this.trigger('workclick', [wall.userData.work])
      }
    })
    this.mouseManager.on('dhbclick', async (dhb) => {
      this.trigger('dhbclick', [dhb])
      this.camera.go(dhb)
    })
  }

  onActiveIndexChange(index) {
    const wall = this.world.walls[index]
    this.camera.go(wall)
  }

  setGyroscopeEnabled(enabled) {
    this.camera.setGyroscopeEnabled(enabled)
  }

  setDOC() {
    this.camera.setDOC()
  }

  setConfig() {
    this.config = {}

    // Debug
    this.config.debug = window.location.hash === '#debug'

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    // Width and height
    this.config.width = window.innerWidth
    this.config.height = window.innerHeight
  }

  setScene() {
    this.scene = new THREE.Scene()
    // this.scene.fog = new THREE.FogExp2(0xe6e6e6, 0.018)
    this.camera = new Camera()
    this.renderer = new Renderer({ scene: this.scene, camera: this.camera })
    this.targetElement.appendChild(this.renderer.instance.domElement)
    //
    const environment = new RoomEnvironment()
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer.instance)
    pmremGenerator.compileEquirectangularShader()
    this.scene.background = null
    this.scene.environment = pmremGenerator.fromScene(environment, 0.04).texture
  }

  setResources() {
    this.resources = new Resources(assets)
    this.resources.on('groupEnd', (_group) => {
      if (_group.name === 'base') {
        this.loaded = true
        this.trigger('loaded')
      }
    })
  }

  setWorld() {
    this.world = new World()
  }

  initSky() {
    const { scene, renderer } = this
    // Add Sky
    const sky = new Sky()
    this.sky = sky
    sky.scale.setScalar(450000)
    scene.add(sky)

    const sun = new THREE.Vector3()
    this.sun = sun

    /// GUI

    const effectController = {
      turbidity: 5.5,
      rayleigh: 0.755,
      mieCoefficient: 0.016,
      mieDirectionalG: 0.828,
      elevation: 11.5,
      azimuth: -94.4,
    }

    const uniforms = sky.material.uniforms
    uniforms['turbidity'].value = effectController.turbidity
    uniforms['rayleigh'].value = effectController.rayleigh
    uniforms['mieCoefficient'].value = effectController.mieCoefficient
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
    const theta = THREE.MathUtils.degToRad(effectController.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    uniforms['sunPosition'].value.copy(sun)
  }

  update() {
    if (this.stats) this.stats.update()

    this.camera.update()

    this.mouseManager.update()

    if (this.world) this.world.update()

    if (this.renderer) this.renderer.update()

    window.requestAnimationFrame(() => {
      this.update()
    })
  }

  resize() {
    // Config
    this.config.width = window.innerWidth
    this.config.height = window.innerHeight

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    if (this.camera) this.camera.resize()

    if (this.renderer) this.renderer.resize()

    if (this.world) this.world.resize()
  }

  destroy() {}
}
