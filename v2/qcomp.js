import * as math from 'mathjs';
import format from './notation_interpreter';

const one = [0,1];
const zero = [1,0];
const posi = math.complex('0+1');
const negi = math.complex('0-1');

// Check if the method already exists
if(Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals");

// Add the equals() function/method to the prototype of array
Array.prototype.equals = function (array) {
  // Return false if the argument is not an array
  if (!array) return false;

  // Return false if the array lengths are different
  if (this.length != array.length) return false;

  for (var i = 0, l=this.length; i < l; i++) {
    if ((this[i] instanceof Array) && (array[i] instanceof Array)) {
      // Check if there are nested arrays and apply recursion to them
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Check false if there are two object instances
      return false;
    }
  }
  return true;
}

Object.defineProperty(Array.prototype, "equals", {enumerable: false});

export default class QC {

  constructor(amplitudes) {
    this.values = format.evalBraKet(amplitudes);
    const fillRange = (start, end) => {
      return Array(end - start + 1).fill().map((item, index) => start + index);
    };
    this.ALL = fillRange(0, this.values.length - 1);

  }

  applyOperatorToBits(operation, bits) {
    if (this.ALL.equals(bits)) {
      this.values = this.values.map(val => math.multiply(val, operation));
    } else {
      for (var i in bits) {
        this.values[bits[i]] = math.multiply(this.values[bits[i]], operation);
      }
    }
    return this.values;
  }

  applyControlledOperatorToBits(operation, cBits, tBits) {
    if ((this.ALL.equals(tBits)) || (this.ALL.equals(cBits))) {
      throw new Error("Error: Cannot apply control to all bits, must retain one impartial");
    } else {
      var isTrue = true;
      for (var i in cBits) {
        isTrue = isTrue && this.values[cBits[i]].equals(one);
      }
      if (isTrue) {
        this.values = this.applyOperatorToBits(operation, tBits);
      }
    }
    return this.values;
  }

  X(bits) {
    this.paulix = [[0,1],
                  [1,0]];
    this.values = this.applyOperatorToBits(this.paulix, bits);
    return this;
  }

  Y(bits) {
    this.pauliy = [[0,negi],
                  [posi, 0]];
    this.values = this.applyOperatorToBits(this.pauliy, bits);
    return this;
  }

  Z(bits) {
    this.pauliz = [[1, 0],
                  [0, -1]];
    this.values = this.applyOperatorToBits(this.pauliz, bits);
    return this;
  }

  sqrtx(bits) {
    this.sqrtx = math.multiply(0.5, [[posi, negi],
                                    [negi, posi]]);
    this.values = this.applyOperatorToBits(this.sqrtx, bits);
    return this;
  }

  phase(theta, bits) {
    this.phase = [[1, 0],
              [0, Math.exp(math.multiply(posi, theta))]];
    this.values = this.applyOperatorToBits(this.phase, bits);
    return this;
  }

  T(bits) {
    this.t = [[1, 0],
              [0, math.e ** (posi * (math.pi/4))]];
    this.values = this.applyOperatorToBits(this.t, bits);
    return this;
  }

  H(bits) {
    this.h = math.multiply((1 / math.sqrt(2)), [[1, 1],
                                                [1, -1]]);
    this.values = this.applyOperatorToBits(this.h, bits);
    return this;
  }

  swap(firstBit, secondBit) {
    var cbit = this.values[firstBit];
    var tbit = this.values[secondBit];
    this.values[firstBit] = tbit;
    this.values[secondBit] = cbit;
    return this;
  }

  cnot(controlBits, targetBits) {
    this.not = [[0,1],
                [1,0]];
    this.values = this.applyControlledOperatorToBits(this.not, controlBits, targetBits);
    return this;
  }

  cswap(controlBits, targetBits) {
    if (targetBits != 2) throw new Error("Error: Must have 2 target bits");
    var isTrue = true;
    for (var i in controlBits) {
      isTrue = isTrue && this.values[controlBits[i]].equals(one);
    }
    if (isTrue) {
      var cBit = this.values[targetBits[0]];
      var tBit = this.values[targetBits[1]];
      this.values[targetBits[0]] = tBit;
      this.values[targetBits[1]] = cBit;
    }
    return this;
  }
}

const qc = new QC("|01001>");
