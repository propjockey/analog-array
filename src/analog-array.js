const getter = function (target, prop, receiver) {
  const propFloat = parseFloat(prop)
  if (!isNaN(propFloat)) {
    if (propFloat < 0) {
      return target[0]
    }
    const leftIndex = ~~propFloat
    const lastIndex = target.length - 1
    if (leftIndex >= lastIndex) {
      return target[lastIndex]
    }
    if (propFloat === leftIndex) {
      return target[propFloat]
    }
    return this.slide(target[leftIndex], target[leftIndex + 1], propFloat - leftIndex)
  } else {
    return Reflect.get(target, prop, receiver)
  }
}

const setter = function (target, prop, value, receiver) {
  if (prop === "slide") {
    this.slide = value
    return value
  }
  return Reflect.set(target, prop, value, receiver)
}

function AnalogArray (array, slide) {
  this.array = array || []
  this.slide = slide || AnalogArray.slideNumber
  return new Proxy(this.array, { get: getter.bind(this), set: setter.bind(this) })
}

Object.assign(AnalogArray, {
  slideNumber: (from, to, amount) => {
    return ((to - from) * amount) + from
  },
  slideByte: (from, to, amount) => {
    const slid = AnalogArray.slideNumber(from & 0xff, to & 0xff, amount)
    return Math.round(Math.min(Math.max(slid, 0), 0xff))
  },
  slideColor: (from, to, amount) => {
    const sb = AnalogArray.slideByte
    const fromLen = from.length
    const color1 = parseInt(from.replace("#", ""), 16)
    const color2 = parseInt(to.replace("#", ""), 16)
    const res = sb(color1, color2, amount) |
    ( sb(color1 >>> 8, color2 >>> 8, amount) << 8 ) |
    ( sb(color1 >>> 16, color2 >>> 16, amount) << 16 ) |
    ( fromLen > 7 ? sb(color1 >>> 24, color2 >>> 24, amount) << 24 : 0 )
    const resStr = (res >>> 0).toString(16).padStart((fromLen | 1) ^ 1, "0")
    return (fromLen & 1) ? "#" + resStr : resStr
  }
})

export { AnalogArray }
export default AnalogArray
