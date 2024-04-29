export class Toucher {
  constructor(e) {
    var t = this,
      i = {
        radius: 50,
        deceleration: 0.1,
        container: document.body,
        onChange: function () {},
      }
    e = Object.assign(i, e)
    ;(t.config = e),
      (t.lat = t.lon = 0),
      (t.lastX = t.lastY = 0),
      (t.deltaX = t.deltaY = 0),
      (t.lastDistance = 0),
      (t.startX = this.startY = 0),
      (t.speed = { lat: 0, lon: 0 }),
      (t.factor = 50 / t.config.radius),
      (t.enabled = !0)
    var n = function (e) {
        e.preventDefault(),
          t.config.container.addEventListener('mousemove', s, {
            passive: !1,
          }),
          t.config.container.addEventListener('mouseup', r, {
            passive: !1,
          }),
          t.config.container.addEventListener('mouseout', r, {
            passive: !1,
          })
      },
      s = function (e) {
        var i = e.movementX || e.mozMovementX || e.webkitMovementX || 0,
          o = e.movementY || e.mozMovementY || e.webkitMovementY || 0
        ;(t.deltaX = 0.3 * -i),
          (t.deltaY = 0.3 * o),
          (t.lon += this.deltaX),
          (t.lat += this.deltaY),
          t.config.onChange({
            X: t.lon,
            Y: t.lat,
            deltaY: t.deltaY,
            deltaX: t.deltaX,
          })
      },
      r = function e(i) {
        t.config.container.removeEventListener('mousemove', s),
          t.config.container.removeEventListener('mouseup', e),
          t.config.container.removeEventListener('mouseout', e)
      },
      l = function (e) {
        var i = e.changedTouches[0]
        ;(t.startX = t.lastX = i.clientX),
          (t.startY = t.lastY = i.clientY),
          (t.startTime = Date.now()),
          (t.speed = { lat: 0, lon: 0 }),
          (t.lastDistance = void 0)
      },
      c = function (e) {
        e.preventDefault()
        var i = e.changedTouches[0]
        switch (e.changedTouches.length) {
          case 1:
            t.lastDistance ||
              ((t.deltaX = (t.lastX - i.clientX) * t.factor),
              (t.deltaY = (i.clientY - t.lastY) * t.factor),
              (t.lon += t.deltaX),
              (t.lat += t.deltaY),
              (t.lastX = i.clientX),
              (t.lastY = i.clientY),
              t.config.onChange({
                X: t.lon,
                Y: t.lat,
                deltaY: t.deltaY,
                deltaX: t.deltaX,
              }))
            break
        }
      },
      h = function (e) {
        return (
          0 !== e &&
            (e > 0
              ? ((e -= t.config.deceleration), e < 0 && (e = 0))
              : ((e += t.config.deceleration), e > 0 && (e = 0))),
          e
        )
      },
      d = function e() {
        var i = t.speed
        ;(i.lat = h(i.lat)),
          (i.lon = h(i.lon)),
          (t.deltaY = -i.lat),
          (t.deltaX = i.lon),
          (t.lat += t.deltaY),
          (t.lon += t.deltaX),
          t.config.onChange({
            isUserInteracting: !1,
            speed: i,
            X: t.lon,
            Y: t.lat,
            deltaY: t.deltaY,
            deltaX: t.deltaX,
          }),
          0 === i.lat && 0 === i.lon
            ? (t._intFrame && cancelAnimationFrame(t._intFrame),
              (t._intFrame = 0))
            : (t._intFrame = requestAnimationFrame(e))
      },
      m = function (e) {
        var i = (Date.now() - t.startTime) / 3
        ;(t.speed = {
          lat: (t.startY - t.lastY) / i,
          lon: (t.startX - t.lastX) / i,
        }),
          d()
      }
    ;(this.connect = function () {
      t.config.container.addEventListener('mousedown', n, { passive: !1 }),
        t.config.container.addEventListener('touchstart', l, {
          passive: !1,
        }),
        t.config.container.addEventListener('touchmove', c, {
          passive: !1,
        }),
        t.config.container.addEventListener('touchend', m, { passive: !1 })
    }),
      (this.reset = function () {
        t.config.container.removeEventListener('mousemove', s),
          t.config.container.removeEventListener('mouseup', r),
          t.config.container.removeEventListener('mouseout', r)
      }),
      this.connect()
  }
}
