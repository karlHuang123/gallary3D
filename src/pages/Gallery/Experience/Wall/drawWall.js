import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

const textureLoader = new THREE.TextureLoader()

const highlightMaterial = new THREE.MeshBasicMaterial({
  color: 0xff685d,
})

const placeholderGeo = new THREE.BoxBufferGeometry(1, 1, 1)
const placeholderMat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  visible: false,
})

const posterWidth = 24
const posterHeight = 18
const posterGeo = new THREE.BoxBufferGeometry(posterWidth, posterHeight, 0.2)
const highlightGeo = new THREE.PlaneBufferGeometry(
  posterWidth + 1.2,
  posterHeight + 1.2
)

export function drawWall(mesh, work) {
  // wall
  mesh.userData.work = work
  mesh.userData.wallIndex = work.wallIndex
  mesh.userData.workIndex = work.workIndex
  work.mesh = mesh

  mesh.material.visible = false

  // two poster each side
  const posterAspect = posterWidth / posterHeight
  const posterTexture = textureLoader.load(work.livePicUrl, (bgTexture) => {
    const imageAspect = bgTexture.image
      ? bgTexture.image.width / bgTexture.image.height
      : 1
    const aspect = imageAspect / posterAspect
    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1
    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect
  })
  posterTexture.encoding = THREE.sRGBEncoding
  const posterMaterial = new THREE.MeshBasicMaterial({
    map: posterTexture,
  })
  const posterMesh = new THREE.Mesh(posterGeo, posterMaterial)
  const posterMesh1 = posterMesh.clone()
  posterMesh.position.set(0, 0, 0.1)
  posterMesh1.position.set(0, 0, -2)
  posterMesh1.rotateY(Math.PI)
  posterMesh.userData.wall = mesh
  posterMesh1.userData.wall = mesh
  mesh.add(posterMesh)
  mesh.add(posterMesh1)
  const highlightMesh = new THREE.Mesh(highlightGeo, highlightMaterial)
  highlightMesh.name = 'posterHighlight'
  highlightMesh.visible = false
  highlightMesh.position.set(0, 0, 0.1)
  const hm1 = highlightMesh.clone()
  hm1.name = 'posterHighlight1'
  hm1.visible = false
  hm1.position.set(0, 0, -2)
  hm1.rotateY(Math.PI)
  mesh.add(highlightMesh)
  mesh.add(hm1)

  // text content
  drawText(work.studentName).then((myText) => {
    myText.position.set(0, -12.5, 0.2)
    myText.scale.set(7, 7, 7)
    mesh.add(myText)
  })

  drawText(work.name).then((myText) => {
    myText.position.set(0, -11, 0.2)
    myText.scale.set(9, 9, 9)
    mesh.add(myText)
  })

  // camera position
  const cameraPositionCube = new THREE.Mesh(placeholderGeo, placeholderMat)
  cameraPositionCube.name = 'cameraPositionCube'
  cameraPositionCube.position.set(0, 0, 54)
  mesh.add(cameraPositionCube)
}

const loader = new FontLoader()
const fontPromise = loader.loadAsync('/FZKai-Z03S_Regular.json')
const color = new THREE.Color(0x111111)
const matLite = new THREE.MeshStandardMaterial({
  color: color,
  // side: THREE.DoubleSide,
})

async function drawText(message) {
  const font = await fontPromise
  const shapes = font.generateShapes(message, 0.1)
  const geometry = new THREE.ShapeBufferGeometry(shapes)
  geometry.computeBoundingBox()
  const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
  geometry.translate(xMid, 0, 0)
  const text = new THREE.Mesh(geometry, matLite)
  return text
}

export function drawDHB(mesh) {
  mesh.userData.isDHB = true
  mesh.material.visible = false
  const posterWidth = 120
  const posterHeight = 180

  // two poster each side
  const posterAspect = posterWidth / posterHeight
  const posterTexture = textureLoader.load(
    'http://skd-gallery.oss-cn-shanghai.aliyuncs.com/gallery/poster.png',
    (bgTexture) => {
      const imageAspect = bgTexture.image
        ? bgTexture.image.width / bgTexture.image.height
        : 1
      const aspect = imageAspect / posterAspect
      bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0
      bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1
      bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2
      bgTexture.repeat.y = aspect > 1 ? 1 : aspect
    }
  )
  posterTexture.encoding = THREE.sRGBEncoding
  const posterMaterial = new THREE.MeshBasicMaterial({
    map: posterTexture,
  })
  const posterMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(posterWidth, posterHeight),
    posterMaterial
  )

  posterMesh.scale.set(mesh.name === 'dazhanban02' ? -1 : 1, 1, 1)
  posterMesh.position.set(0, 0, 0.1)
  mesh.add(posterMesh)
  const cameraPositionCube = new THREE.Mesh(placeholderGeo, placeholderMat)
  cameraPositionCube.name = 'cameraPositionCube'
  cameraPositionCube.position.set(0, 0, 260)
  mesh.add(cameraPositionCube)
}
