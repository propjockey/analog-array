![James0x57](https://img.shields.io/badge/James0x57%20%F0%9F%91%BD-I%20made%20a%20thing!-blueviolet.svg?labelColor=222222)

# AnalogArray by PropJockey

`npm i analog-array`

## Importing

### npm and StealJS:
```js
// any method:
import AnalogArray from "analog-array";
// or
const AnalogArray = require("analog-array");
// or
define(["analog-array"], function(AnalogArray){});
```

### npm and CJS:
```js
const AnalogArray = require("analog-array");
```

### AMD:
```js
require.config({
  packages: [{
    name: 'analog-array',
    location: 'node_modules/analog-array/dist/amd',
    main: 'analog-array'
  }]
});
// ...
define(["analog-array"], function(AnalogArray){});
```

### Global/Standalone:
```html
<script src="dist/global/analog-array.js"></script>
<!-- or -->
<script src="dist/global/analog-array.min.js"></script>

<script>
  const analogArray = new AnalogArray([10, 8, 999, 20000])
</script>
```

## Usage

```js
  let analogArray = new AnalogArray([10, 8, 16])

  Array.isArray(analogArray) // true

  // overflow access returns highest or lowest available index respectively:
  analogArray[999] // 16
  analogArray[-0.5] // 10

  // index values accessed like a normal array:
  analogArray[1] // 8
```

#### splitIndex values "slide" between the value at index = Math.floor(splitIndex) and the next index
```js
  let analogArray = new AnalogArray([10, 8, 16])
  analogArray[0.5] // 9 (half way between index 0 and index 1)
  analogArray[1.25] // 10 (1/4 past the value at index 1 towards the value at index 2)
  analogArray[1.50] // 12 (1/2 past the value at index 1 towards the value at index 2)
  analogArray[1.75] // 14 (3/4 past the value at index 1 towards the value at index 2)
  analogArray[2.00] // 16 (the value at index 2)
```

#### a custom slide function can be specified
```js
  analogArray = new AnalogArray([10, 8, 16], mySlideFn) // at init
  analogArray.slide = mySlideFn // or later
```

Slide functions take 3 arguments, `(from, to, amount)`
`from` is the value at the index `Math.floor(splitIndex)`
`to` is the value at the index `Math.floor(splitIndex) + 1`
`amount` is the scalar = `splitIndex - fromIndex`, which will be a value in the range `(0, 1)`
(amounts 0 and 1 will access the array directly without sliding, otherwise the range would have been [0, 1])

Examples:
```js
  let floorIndexValuesOnly = (from, to, amount) => {
    console.log(from, to, amount)
    return from
  }
  analogArray = new AnalogArray([10, 8, 16])

  analogArray[1.50] // 12
  analogArray.slide = floorIndexValuesOnly
  analogArray[1.50] // returns: 8, logs: 8 16 0.5
```

The values in the analogArray can be anything if you provide a way to slide between them.


#### Slide functions AnalogArray.slideNumber (the default slide) and AnalogArray.slideColor are included

These slide functions can be used directly outside of the implicit use in an AnalogArray instance if needed.

#### AnalogArray.slideColor

Accepts hex colors in the form "#RRGGBB". If "RRGGBB" is used (without "#") at Math.floor(splitIndex), the result will also omit "#".
```js
let colorsAnalogArray = new AnalogArray(["#ff00ff", "888888", "#00ff00"], AnalogArray.slideColor)

colorsAnalogArray[0] // "#ff00ff"
colorsAnalogArray[0.5] // "#c444c4"
colorsAnalogArray[1] // "888888"
colorsAnalogArray[1.5] // "44c444"
colorsAnalogArray[2] // "#00ff00"
```

It will also slide hex colors in the form "#RRGGBBAA" and "RRGGBBAA" with similar results.
