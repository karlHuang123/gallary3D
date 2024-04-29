import * as THREE from 'three'
import gsap from 'gsap'
import { EPS } from '@/utils/constants'
import { Orienter } from './Orienter'
import { Toucher } from './Toucher'

const _pA = new THREE.Vector3()
const _pB = new THREE.Vector3()
const ease = 'power1.out'

export default class MyCameraControls {
  constructor(camera, element) {
    const t = this
    t._camera = camera
    t._element = element
    t.target = new THREE.Vector3()
    t.isMove = false
    t.fix = { lat: 0, lon: 0 }
    t.lastlat = 0
    t.lastlon = 0
    this.ortr = new Orienter({
      onChange: function (e) {
        void 0 !== e &&
          void 0 !== e.deltaLat &&
          void 0 !== e.deltaLon &&
          ((t.fix.lat += e.deltaLat * 1),
          (t.fix.lat = Math.max(-50, Math.min(30, t.fix.lat))),
          (t.fix.lon += e.deltaLon * 1))
      },
    })
    this.oribit = new Toucher({
      container: element,
      deceleration: 0.1,
      onChange: function (e) {
        void 0 !== e &&
          void 0 !== e.deltaX &&
          void 0 !== e.deltaY &&
          ((t.fix.lat += e.deltaY * 0.2),
          (t.fix.lat = Math.max(-50, Math.min(30, t.fix.lat))),
          (t.fix.lon += e.deltaX * 0.2))
      },
    })
  }

  enableOrient(enabled) {
    this.ortr.enabled = enabled
  }

  connectDOC() {
    this.ortr.connect()
  }

  _updateFix() {
    const t = this
    var e,
      i,
      o = t._camera.position,
      a = new THREE.Vector3()
    ;(a.x = t.target.x - o.x),
      (a.y = t.target.y - o.y),
      (a.z = t.target.z - o.z),
      a.x > 0
        ? ((e = (180 * Math.atan(a.z / a.x)) / Math.PI),
          (i = (180 * Math.asin(a.y / a.length())) / Math.PI),
          (t.fix = { lat: i, lon: e }))
        : a.x < 0
        ? ((e = (180 * Math.atan(a.z / a.x)) / Math.PI - 180),
          (i = (180 * Math.asin(a.y / a.length())) / Math.PI),
          (t.fix = { lat: i, lon: e }))
        : ((e = a.z * 90),
          (i = (180 * Math.asin(a.y / a.length())) / Math.PI),
          (t.fix = { lat: i, lon: e }))
  }

  go(pos, target, enableTransition = true) {
    const t = this
    if (t.isMove) return false
    if (!enableTransition) {
      t._camera.position.copy(pos)
      t.target.copy(target)
      t._updateFix()
      return false
    }
    // 判断是否需要动
    if (
      approxEquals(pos.x, t._camera.position.x, 0.01) &&
      approxEquals(pos.y, t._camera.position.y, 0.01) &&
      approxEquals(pos.z, t._camera.position.z, 0.01) &&
      approxEquals(target.x, t.target.x, 0.01) &&
      approxEquals(target.y, t.target.y, 0.01) &&
      approxEquals(target.z, t.target.z, 0.01)
    ) {
      return false
    }
    gsap.to(t._camera.position, {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      ease,
      duration: 1,
    })
    gsap.to(t.target, {
      x: target.x,
      y: target.y,
      z: target.z,
      ease,
      duration: 1,
      onStart() {
        t.isMove = true
      },
      onComplete() {
        t.isMove = false
      },
      onUpdate() {
        t._updateFix()
      },
    })
    return true
  }

  update() {
    const t = this
    ;(Object.is(t.fix.lat, NaN) || Object.is(t.fix.lon, NaN)) &&
      ((t.fix.lat = t.lastlat), (t.fix.lon = t.lastlon))
    var e = t.fix.lat,
      i = t.fix.lon
    ;(t.lastlat = e),
      (t.lastlon = i),
      (e = Math.max(-50, Math.min(30, e))),
      (e = THREE.MathUtils.degToRad(e)),
      (i = THREE.MathUtils.degToRad(i))

    t._camera.getWorldPosition(_pA)
    _pB
      .set(Math.cos(e) * Math.cos(i), Math.sin(e), Math.cos(e) * Math.sin(i))
      .normalize()
      .add(_pA)
    t.target.copy(_pB)
    t._camera.lookAt(t.target)
  }
}

function approxZero(number, error = EPS) {
  return Math.abs(number) < error
}

function approxEquals(a, b, error = EPS) {
  return approxZero(a - b, error)
}
