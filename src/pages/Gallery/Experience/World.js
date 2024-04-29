import { queryClient } from '@/components/ReactQueryProvider'
import { fetchGalleryFn } from '@/services/getWorks.ts'
import Experience from './Experience.js'
import { drawWall, drawDHB } from './Wall/drawWall.js'

export default class World {
  constructor(_options) {
    this.experience = new Experience()
    this.clock = this.experience.clock
    this.config = this.experience.config
    this.camera = this.experience.camera
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.walls = []

    this.resources.on('groupEnd', (_group) => {
      if (_group.name === 'base') {
        this.prepare()
      }
    })
  }

  async prepare() {
    const { works } = await queryClient.fetchQuery(['gallery'], fetchGalleryFn)
    this.works = works
    this.setHall()
    this.camera.go(this.dhbs[0], false)
  }

  setHall() {
    const { hall } = this.resources.items
    // console.log(hall)
    const g = hall.scene.getObjectByName('zhanbanzu')
    if (!g) return
    // 按照 mesh name 排序 (和展板位置有关)
    const walls = [...g.children]
    const getMeshNo = ({ name }) => parseInt(name.slice(7))
    walls.sort((a, b) => getMeshNo(a) - getMeshNo(b))
    walls.forEach((mesh, i) => {
      const wallIndex = i
      const workIndex = i % this.works.length
      const work = { ...this.works[workIndex], wallIndex, workIndex }
      drawWall(mesh, work)
    })
    this.walls = walls
    // 大海报
    const dhbs = [...hall.scene.getObjectByName('dazhanbanzu').children]
    dhbs.forEach((mesh) => {
      drawDHB(mesh)
    })
    this.dhbs = dhbs
    /*
    // 背景板
    const bjb = hall.scene.getObjectByName('Arc002')
    bjb.material.roughness = 0
    bjb.material.metalness = 0

    // 墙体和地面
    // const qiangbi = hall.scene.getObjectByName('qiangbi')
    // bake.flipY = false
    // bake.encoding = THREE.sRGBEncoding
    // qiangbi.material.map = bake
    // qiangbi.material.roughness = 0
    // qiangbi.material.metalness = 0
    */
    // 文字
    this.animationText = hall.scene.getObjectByName('wenzi')
    this.animationText.userData.helper = false
    // this.animationText.material = orangeMat
    // this.animationText.layers.enable(BLOOM_SCENE)
    /*
    // 吊线
    const line1 = hall.scene.getObjectByName('line026')
    const line2 = hall.scene.getObjectByName('line027')
    line1.userData.helper = false
    line2.userData.helper = false
    // line1.layers.enable(BLOOM_SCENE)
    // line2.layers.enable(BLOOM_SCENE)
    line1.material = orangeMat
    line2.material = orangeMat
    */
    this.scene.add(hall.scene)
  }

  resize() {}

  update() {
    if (this.animationText) {
      const nextRad = (this.animationText.rotation.y - 0.01) % (Math.PI * 2)
      this.animationText.rotation.y = nextRad
    }
  }

  destroy() {}
}
