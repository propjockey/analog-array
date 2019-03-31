import QUnit from "steal-qunit"
import AnalogArray from "../src/analog-array.js"

const { test } = QUnit

QUnit.module("AnalogArray by PropJockey", function (hooks) {
  test("import should work", t => {
    t.ok(AnalogArray, "exists")
    t.ok(AnalogArray.slideNumber, "exists")
    t.ok(AnalogArray.slideByte, "exists")
    t.ok(AnalogArray.slideColor, "exists")
  })
  test("AnalogArray instance proxies an array", t => {
    const aa = new AnalogArray()
    t.strictEqual(aa.length, 0, "has correct length")
    t.equal(typeof aa.push, "function", "has push function")
    t.equal(typeof aa.pop, "function", "has pop function")
    t.strictEqual(Array.isArray(aa), true, "Array.isArray returns true")
  })
  test("AnalogArray works on numbers by default", t => {
    const aa = new AnalogArray()
    t.strictEqual(aa[0], undefined, "returns undefined at index 0 if length is 0")
    t.strictEqual(aa[0.5], undefined, "returns undefined for 0.5 if length is 0")
    t.strictEqual(aa[1], undefined, "returns undefined at index 1 if length is 0")
    t.strictEqual(aa[-0.5], undefined, "returns undefined for -0.5 if length is 0")
    t.strictEqual(aa[-1], undefined, "returns undefined for -1 if length is 0")
    aa.push(6)
    t.equal(aa.length, 1, "push increased length")
    t.equal(aa[0], 6, "push added correct value at index 0")
    t.equal(aa[0.5], 6, "returns last value for split index >= length")
    t.equal(aa[-1], 6, "reading negative index returns index 0 value")
    t.equal(aa[-0.5], 6, "reading negative split index returns index 0 value")
    t.equal(aa[1], 6, "reading integer indexes >= length returns the last value")
    aa.splice(0, 0, 0)
    t.equal(aa.length, 2, "splice changed length as expected")
    t.strictEqual(aa[0], 0, "splice inserted correct value")
    t.strictEqual(aa[1], 6, "index 1 is as expected")
    t.strictEqual(aa[-1], 0, "reading negative index still returns index 0 value")
    t.strictEqual(aa[11.125], 6, "reading >= length returns last value in the array")

    t.strictEqual(aa[0.5], 3, "split index between known values slides correctly")
    aa.push(8)
    t.strictEqual(aa[1.25], (8 - 6) * 0.25 + 6, "default slide function returns correct float value")
  })
  test("AnalogArray can be initialized with an array", t => {
    const aa = new AnalogArray([-6, 6, 6.5])
    t.strictEqual(aa[0], -6, "value at 0 is correct")
    t.strictEqual(aa[1], 6, "value at 1 is correct")
    t.strictEqual(aa[2], 6.5, "value at 2 is correct")
    t.strictEqual(aa[0.5], 0, "value at 0.5 is correct")
    t.strictEqual(aa[1.5], 6.25, "value at 1.5 is correct")
  })
  test("AnalogArray can be initialized with a custom slide function for tweening", t => {
    const aa = new AnalogArray([-6, 6, 6.5], (fromVal, toVal, amount0to1) => {
      return fromVal // always return value at Math.floor(index)
    })
    t.strictEqual(aa[0], -6, "value at 0 is correct")
    t.strictEqual(aa[1], 6, "value at 1 is correct")
    t.strictEqual(aa[2], 6.5, "value at 2 is correct")
    t.strictEqual(aa[0.5], -6, "value at 0.5 is correct")
    t.strictEqual(aa[1.5], 6, "value at 1.5 is correct")
  })
  test("AnalogArray can be updated with a custom slide function for tweening", t => {
    const indexesOnly = (fromVal, toVal, amount0to1) => {
      return fromVal // always return value at Math.floor(index)
    }
    const aa = new AnalogArray([-6, 6, 6.5])
    t.strictEqual(aa[2], 6.5, "value at 2 is correct")
    t.strictEqual(aa[0.5], 0, "value at 0.5 is correct")
    t.strictEqual(aa[1.5], 6.25, "value at 1.5 is correct")
    t.strictEqual(aa.slide = indexesOnly, indexesOnly, "slide was set after init")
    t.strictEqual(aa[2], 6.5, "value at 2 is correct")
    t.strictEqual(aa[0.5], -6, "value at 0.5 is correct")
    t.strictEqual(aa[1.5], 6, "value at 1.5 is correct")
  })
  test("AnalogArray can slide #RRGGBB hex color values if correct slide function is specified", t => {
    const aa = new AnalogArray(["ff00ff", "888888", "00ff00"], AnalogArray.slideColor)
    t.strictEqual(aa[0], "ff00ff", "value at 0 is correct")
    t.strictEqual(aa[0.5], "c444c4", "value at 0.5 is correct")
    t.strictEqual(aa[1.5], "44c444", "value at 1.5 is correct")
    aa[0] = "#" + aa[0]
    t.strictEqual(aa[0.5], "#c444c4", "hash symbol will be included in the output if the value at index Math.floor(splitIndex) has one")
  })
  test("AnalogArray can slide #RRGGBBAA color values if correct slide function is specified (same as #RRGGBB)", t => {
    const aa = new AnalogArray(["ff00ffcc", "888888cc", "00ff0022"], AnalogArray.slideColor)
    t.strictEqual(aa[-999], "ff00ffcc", "value at -999 is correct")
    t.strictEqual(aa[0.5], "c444c4cc", "value at 0.5 is correct")
    t.strictEqual(aa[1.5], "44c44477", "value at 1.5 is correct")
    aa[0] = "#" + aa[0]
    t.strictEqual(aa[0.5], "#c444c4cc", "hash symbol will be included in the output if the value at index Math.floor(splitIndex) has one")
  })
})
