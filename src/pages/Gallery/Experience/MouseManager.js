import * as THREE from 'three'
import Experience from './Experience.js'
import EventEmitter from './Utils/EventEmitter.js'
import { isMobile } from '@/utils/device'

export default class MouseManager extends EventEmitter {
  constructor(_options) {
    super()
    this.experience = new Experience()
    this.config = this.experience.config
    this.scene = this.experience.scene
    this.renderer = this.experience.renderer
    this.camera = this.experience.camera
    this.resources = this.experience.resources
    this.world = this.experience.world

    this.circleQuaternion = new THREE.Quaternion()
    this.centerPoint = new THREE.Vector3()

    this.resources.on('groupEnd', (_group) => {
      if (_group.name === 'base') {
        this.drawHelper()
      }
    })

    this.mouse = { x: 0, y: 0 }
    this.raycaster = new THREE.Raycaster()
    this.clickDuration = 0
    this.mousedownTimestamp = 0
    this.experience.targetElement.addEventListener('mousemove', (e) => {
      this.handleMousemove(e)
    })
    this.experience.targetElement.addEventListener('mousedown', (e) => {
      this.mousedownTimestamp = e.timeStamp
    })
    this.experience.targetElement.addEventListener('mouseup', (e) => {
      if (!this.mousedownTimestamp) {
        return
      }
      const duration = e.timeStamp - this.mousedownTimestamp
      this.mousedownTimestamp = 0
      if (duration < 150) {
        this.raycastClick(e)
      }
    })
  }

  raycastClick(e) {
    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    this.mouse.x = (e.clientX / this.config.width) * 2 - 1
    this.mouse.y = -(e.clientY / this.config.height) * 2 + 1

    //2. set the picking ray from the camera position and mouse coordinates
    this.raycaster.setFromCamera(this.mouse, this.camera.instance)

    //3. compute intersections
    const intersects = this.raycaster.intersectObjects(this.scene.children)
    // const a = intersects.find((i) => {
    //   return (i.object.name = 'posterHighlight')
    // })

    for (let i = 0; i < intersects.length; i++) {
      const { object } = intersects[i]
      if (object.userData.wall) {
        this.trigger('wallclick', [object.userData.wall, object])
        break
      }
      if (object.userData.isDHB) {
        this.trigger('dhbclick', [object])
        break
      }
    }
  }

  raycastHighlight() {
    //2. set the picking ray from the camera position and mouse coordinates
    this.raycaster.setFromCamera(this.mouse, this.camera.instance)

    //3. compute intersections
    const intersects = this.raycaster.intersectObjects(this.scene.children)

    // draw point circle
    if (this.helper) {
      const obj = intersects.find((intersect) => {
        const { visible, isMesh, userData } = intersect.object
        return visible && isMesh && userData.helper !== false
      })
      if (obj) {
        const { point, object, face } = obj
        this.helper.position.copy(point)
        const n = face.normal.clone()
        n.transformDirection(object.matrixWorld)
        n.multiplyScalar(10)
        n.add(point)
        this.helper.lookAt(n)
      }
    }

    // mouse over highlight poster
    if (!isMobile) {
      let findOne = false
      for (let i = 0; i < intersects.length; i++) {
        const { object } = intersects[i]

        if (
          object.name === 'posterHighlight' ||
          object.name === 'posterHighlight1'
        ) {
          if (this.currentPointPoster && this.currentPointPoster !== object) {
            this.currentPointPoster.visible = false
            this.currentPointPoster = null
          }
          object.visible = true
          this.currentPointPoster = object
          findOne = true
          break
        }
      }
      if (!findOne) {
        if (this.currentPointPoster) {
          this.currentPointPoster.visible = false
          this.currentPointPoster = null
        }
      }
    }
  }

  updateCircle(point, q) {
    this.circle.position.copy(point)
    this.circle.quaternion.copy(q)
  }

  handleMousemove(e) {
    this.mouse.x = (e.clientX / this.config.width) * 2 - 1
    this.mouse.y = -(e.clientY / this.config.height) * 2 + 1
  }

  drawHelper() {
    if (isMobile) return
    const geo = new THREE.PlaneBufferGeometry(1, 1)
    geo.translate(0, 0, 0.2)
    geo.scale(0.02, 0.02, 0.02)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      map: this.resources.items.helper,
      depthWrite: false,
      transparent: true,
    })
    this.helper = new THREE.Mesh(geo, mat)
    this.helper.name = 'helper'
    this.helper.userData.helper = false
    this.scene.add(this.helper)
  }

  resize() {}

  update() {
    this.raycastHighlight()
  }

  destroy() {}
}
