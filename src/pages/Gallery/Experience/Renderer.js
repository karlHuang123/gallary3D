import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { BLOOM_SCENE } from '../../../utils/constants'

const vertexshader = `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
  `

const fragmentshader = `
			uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;
			varying vec2 vUv;
			void main() {
				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
			}
  `

const bloomLayer = new THREE.Layers()
bloomLayer.set(BLOOM_SCENE)
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' })
const materials = {}

function darkenNonBloomed(obj) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material
    obj.material = darkMaterial
  }
}

function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid]
    delete materials[obj.uuid]
  }
}

export default class Renderer {
  constructor({ scene, camera }) {
    this.experience = new Experience()
    this.config = this.experience.config
    this.debug = this.experience.debug
    // this.stats = this.experience.stats
    this.time = this.experience.time
    this.sizes = this.experience.sizes
    this.scene = scene
    this.camera = camera

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('renderer')
    }

    this.usePostprocess = false

    this.setInstance()
    this.setPostProcess()
  }

  setInstance() {
    const currentRenderer = new THREE.WebGLRenderer({ antialias: true })
    // currentRenderer.outputEncoding = THREE.LinearEncoding
    currentRenderer.outputEncoding = THREE.sRGBEncoding
    currentRenderer.physicallyCorrectLights = false
    currentRenderer.shadowMap.enabled = true
    currentRenderer.shadowMap.type = THREE.PCFShadowMap //1
    currentRenderer.toneMapping = THREE.NoToneMapping
    currentRenderer.toneMappingExposure = 1
    currentRenderer.setClearColor(0xaaaaaa)
    // this.clearColor = '#333333'
    // this.clearColor = '#010101'

    // Renderer
    this.instance = currentRenderer
    this.instance.domElement.style.position = 'absolute'
    this.instance.domElement.style.top = 0
    this.instance.domElement.style.left = 0
    this.instance.domElement.style.width = '100%'
    this.instance.domElement.style.height = '100%'

    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)
  }

  setPostProcess() {}
  // setPostProcess() {
  //   return
  //   this.postProcess = {}

  //   this.renderTarget = new THREE.WebGLRenderTarget(
  //     this.config.width,
  //     this.config.height,
  //     {
  //       generateMipmaps: false,
  //       minFilter: THREE.LinearFilter,
  //       magFilter: THREE.LinearFilter,
  //       format: THREE.RGBFormat,
  //       encoding: THREE.sRGBEncoding,
  //       samples: 2,
  //     }
  //   )

  //   /**
  //    * Render pass
  //    */
  //   this.postProcess.renderPass = new RenderPass(
  //     this.scene,
  //     this.camera.instance
  //   )

  //   /**
  //    * Bloom pass
  //    */
  //   this.postProcess.bloomPass = new UnrealBloomPass(
  //     new THREE.Vector2(this.config.width, this.config.height),
  //     0.5,
  //     0,
  //     1
  //   )
  //   // this.postProcess.bloomPass.threshold = 0
  //   // this.postProcess.bloomPass.strength = 0.2
  //   // this.postProcess.bloomPass.radius = 0

  //   /**
  //    * bloom composer
  //    */
  //   this.postProcess.bloomComposer = new EffectComposer(
  //     this.instance,
  //     this.renderTarget
  //   )
  //   this.postProcess.bloomComposer.renderToScreen = false
  //   this.postProcess.bloomComposer.addPass(this.postProcess.renderPass)
  //   this.postProcess.bloomComposer.addPass(this.postProcess.bloomPass)

  //   /**
  //    * final pass
  //    */
  //   this.postProcess.finalPass = new ShaderPass(
  //     new THREE.ShaderMaterial({
  //       uniforms: {
  //         baseTexture: { value: null },
  //         bloomTexture: {
  //           value: this.postProcess.bloomComposer.renderTarget2.texture,
  //         },
  //       },
  //       vertexShader: vertexshader,
  //       fragmentShader: fragmentshader,
  //       defines: {},
  //     }),
  //     'baseTexture'
  //   )
  //   this.postProcess.finalPass.needsSwap = true
  //   this.postProcess.finalComposer = new EffectComposer(
  //     this.instance,
  //     this.renderTarget
  //   )
  //   this.postProcess.finalComposer.addPass(this.postProcess.renderPass)
  //   this.postProcess.finalComposer.addPass(this.postProcess.finalPass)
  //   ;[(this.postProcess.bloomComposer, this.postProcess.finalComposer)].forEach(
  //     (composer) => {
  //       composer.setSize(this.config.width, this.config.height)
  //       composer.setPixelRatio(this.config.pixelRatio)
  //     }
  //   )
  // }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    // Post process
    // ;[(this.postProcess.bloomComposer, this.postProcess.finalComposer)].forEach(
    //   (composer) => {
    //     composer.setSize(this.config.width, this.config.height)
    //     composer.setPixelRatio(this.config.pixelRatio)
    //   }
    // )
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender()
    }

    if (this.usePostprocess) {
      this.scene.traverse(darkenNonBloomed)
      this.postProcess.bloomComposer.render()
      this.scene.traverse(restoreMaterial)
      this.postProcess.finalComposer.render()
    } else {
      this.instance.render(this.scene, this.camera.instance)
    }

    if (this.stats) {
      this.stats.afterRender()
    }
  }

  destroy() {
    this.instance.renderLists.dispose()
    this.instance.dispose()
    this.renderTarget.dispose()
    this.postProcess.composer.renderTarget1.dispose()
    this.postProcess.composer.renderTarget2.dispose()
  }
}
