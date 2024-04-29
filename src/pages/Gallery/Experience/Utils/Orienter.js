export class Orienter {
  constructor(e) {
    var t = this
    t.enabled = true
    ;(t.config = e),
      (t.lon = t.lat = t.deltaLon = t.deltaLat = 0),
      (t.moothFactor = 10),
      (t.boundary = 320),
      (t.direction = window.orientation || 0),
      (t.isFixed = !1)
  }

  bindChange(e) {
    this.deviceOrientation = e
  }

  onChange = (e) => {
    const t = this
    if (!t.enabled) return
    var i = e.alpha ? e.alpha : 0,
      o = e.beta ? e.beta : 0,
      a = e.gamma ? e.gamma : 0
    switch (t.direction) {
      case 0:
        ;(t.lon = -(i + a)), (t.lat = o - 90)
        break
      case 90:
        ;(t.lon = Math.abs(o) - i), (t.lat = a < 0 ? -90 - a : 90 - a)
        break
      case -90:
        ;(t.lon = -(i + Math.abs(o))), (t.lat = a > 0 ? a - 90 : 90 + a)
        break
    }
    ;(t.lon = t.lon > 0 ? t.lon % 360 : (t.lon % 360) + 360),
      t.isFixed || ((t.lastLat = t.lat), (t.lastLon = t.lon), (t.isFixed = !0)),
      (t.lat = t.n(t.lat, t.lastLat)),
      (t.lon = t.n(t.lon, t.lastLon)),
      (t.deltaLat = t.lat - t.lastLat),
      (t.deltaLon = t.lon - t.lastLon),
      t.deltaLon < -300 && (t.deltaLon += 360),
      t.deltaLon > 300 && (t.deltaLon -= 360),
      (t.lastLat = t.lat),
      (t.lastLon = t.lon),
      t.config.onChange({
        lon: t.lon,
        lat: t.lat,
        deltaLon: t.deltaLon,
        deltaLat: t.deltaLat,
      })
  }

  onOrient = () => {
    const t = this
    if (!t.enabled) return
    this.direction = window.orientation || 0
  }

  connect() {
    const t = this
    if (
      'function' === typeof window.DeviceOrientationEvent?.requestPermission
    ) {
      window.DeviceMotionEvent.requestPermission()
        .then(function (e) {
          if ('granted' === e) {
            window.addEventListener('deviceorientation', t.onChange)
            window.addEventListener('orientationchange', t.onOrient)
          }
        })
        .catch(console.error)
      return
    }
    window.addEventListener('deviceorientation', t.onChange)
    window.addEventListener('orientationchange', t.onOrient)
  }

  disconnect() {
    const t = this
    window.removeEventListener('deviceorientation', t.onChange, {
      passive: !1,
    })
    window.removeEventListener('orientationchange', t.onOrient, {
      passive: !1,
    })
  }

  n(e, i) {
    const t = this
    if (void 0 === i) return e
    var o = 0
    return (
      Math.abs(e - i) > t.boundary
        ? i > t.boundary
          ? ((o = 360 + e - i),
            (e = i + o / t.moothFactor),
            e > 360 && (e -= 360))
          : ((o = 360 - e + i),
            (e = i - o / t.moothFactor),
            e < 0 && (e += 360))
        : (e = i + (e - i) / t.moothFactor),
      e
    )
  }
}
