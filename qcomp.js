/*
* Author: Jack Kilrain
* Version: 1.9
* Licensing: All Rights Reserved
* Language: JavaScript
*
* Description: Qubit representation and assosciated logic gates
*/

// Library imports
const math = require('mathjs');
const inter = require('./notation_interpreter.js');
const form = require('./qubit_formatter.js');

const posi = math.complex(0, 1);
const negi = math.complex('-i');
const zero = [1,0];
const one = [0,1];

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

class Helpers {

  constructor() {}

  // add key value pair to a dictionary with incremental key name
  static dictAppend(dict, value) {
    var len = Object.keys(dict).length;
    var key = "bit" + (len + 1);
    dict[key] = value;
  }

  // Return an array of values matching 1/n (inversely proportional to the count)
  static createProbs(qubit, regCount) {
    var c_amps = [];
    const n = Math.pow(2, regCount);
    for (let i = 0; i < n; i++) {
      c_amps.push([parseInt(i.toString(2), 10), 1/n])
    }
    return c_amps;
  }

  // Return a zero if the approximation is extremely close (rounding errors)
  static retZero(value) {
    if (value == 6.123233995736766*10**-17 | value == 1.2246467991473532*10**-16 | value == -1.2246467991473532*10**-16) {
      return 0;
    } else {
      return value;
    }
  }
}

class QC {

  constructor() {
    // Stores all actively used qubits
    this.bits = {};
  }

  /*
  * Initialise n new qubits with values
  * E.g:
  * q(1) -> |0>
  * q(2) -> |00>
  * q(n) -> |000...00>
  */
  qreg(registerCount) {
    this.value = form.nKron(Array(registerCount).fill(zero));
    console.log("Initial value: [" + this.value + "]")
    this.amplitudes = [];
    return this;
  }

  // Apply the quantum equivalent of NOT to a qubit
  // A.K.A rotate around the x-axis pi/2 radians
  x(qubit) {
    this.paulix = [[0,1],
                  [1,0]];
    qubit.value =  math.multiply(qubit.value, this.paulix);
    return qubit;
  }
  // Rotate around the y-axis by pi radians
  y(qubit) {
    this.pauliy = [[0,negi],
                  [posi, 0]];
    qubit.value = math.multiply(qubit,value, this.pauliy);
    return qubit;
  }

  // Rotate around the z-axis by pi radians
  z(qubit) {
    this.pauliz = [[1, 0],
                  [0, -1]];
    qubit.value = math.multiply(qubit.value, this.pauliz);
    return qubit;
  }

  sqrtx(qubit) {
    this.sqrtx = math.multiply(0.5, [[posi, negi],
                                    [negi, posi]]);
    qubit.value = math.multiply(qubit.value, this.sqrtx);
    return qubit;
  }

  // Shift along the relative horizontal cirle on the Bloch sphere by theta radians
  phase(theta, qubit) {
    this.phase = [[1, 0],
              [0, Math.exp(math.multiply(posi, theta))]];
    qubit.value = math.multiply(qubit.value, this.phase);
    return qubit;
  }

  t(qubit) {
    this.t = [[1, 0],
              [0, math.e ** (posi * (math.pi/4))]]
    qubit.value = math.multiply(qubit.value, this.t);
    return qubit;
  }

  // Rotate around the x-axis theta radians
  rx(theta, qubit) {
    this.rx = [[math.cos(theta/2), math.multiply(negi, math.complex(math.sin(theta/2)))],
              [math.multiply(negi, math.complex(math.sin(theta/2))), math.cos(theta/2)]];
    switch (theta) {
      // Return the inverted qubit if theta is pi radians
      case math.pi:
        qubit.value = math.multiply(qubit.value, [[0,1],
                                                  [1,0]])
        break;
      // Return the qubit if theta is 2*pi radians
      case (math.pi*2):
        qubit.value = qubit.value;
        break;
      // Apply the transformation to any other rotation
      default:
        qubit.value = math.multiply(qubit.value, this.rx);
        break;
    }
    return qubit;
  }

  // Rotate around the y-axis theta radians
  ry(theta, qubit) {
    this.rx = [[math.cos(theta/2), math.multiply(-1, math.complex(math.sin(theta/2)))],
              [math.complex(math.sin(theta/2)), math.cos(theta/2)]];
    switch (theta) {
      // Return the inverted qubit if theta is pi radians
      case math.pi:
        qubit.value = math.multiply(qubit.value, [[0,1],
                                                  [1,0]])
        break;
      // Return the qubit if theta is 2*pi radians
      case (math.pi*2):
        qubit.value = qubit.value;
        break;
      // Apply the transformation to any other rotation
      default:
        qubit.value = math.multiply(qubit.value, this.ry);
        break;
    }
    return qubit;
  }

  // Rotate around the z-axis theta radians
  rz(theta, qubit) {
    this.rx = [[Math.exp(math.multiply(math.complex('0-1i'), theta/2)), 0],
              [0, Math.exp(math.multiply(math.complex('0+1i'), theta/2))]];
    qubit.value = math.multiply(qubit.value, this.rx);
    return qubit;
  }

  // One or Two qubits

  // Apply a quantum Fourier transform to a qubit(s)
  h(qubits) {
    if (qubits.value.length == 4) {
      this.h2 = math.multiply((1 / math.sqrt(2)), [[1, 0, 1, 0],
                                                    [0, 1, 0, 1],
                                                    [1, 0, -1, 0],
                                                    [0, 1, 0, -1]]);
      qubits.amplitudes = Helpers.createProbs(qubits, 2);
      qubits.value = math.multiply(qubits.value, this.h2);
      return qubits;

    } else if (qubits.value.length == 2) {

      this.h = math.multiply((1 / math.sqrt(2)), [[1, 1],
                                                  [1, -1]]);
      qubits.amplitudes = Helpers.createProbs(qubits, 1);
      qubits.value = math.multiply(qubits.value, this.h);
      return qubits;

    } else {
      throw new Error(`Error: Maximum 2 qubits`);
    }
  }

  /* Two Qubit Gates */
  // Swap the values of two qubits
  swap(qubits) {
    this.swap = [[1, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 1]];
    qubits.value = math.multiply(qubits.value, this.swap);
    return qubits;
  }

  // Half way two qubit swap
  sqrtswap(qubits) {
    this.sqrtswap = [[1, 0, 0, 0],
                    [0, math.multiply(0.5, math.complex(1, 1)), math.multiply(0.5, math.complex('1-1i')), 0],
                    [0, math.multiply(0.5, math.complex('1-1i')), math.multiply(0.5, math.complex(1, 1)), 0],
                    [0, 0, 0, 1]];
    qubits.value = math.multiply(qubits.value, this.sqrtswap);
    return this;
  }

  // Rotate pi radians on the x-axis if the first qubit is one
  cx(qubits) {
    this.cnot = [[1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 1],
                [0, 0, 1, 0]];
    qubits.value = math.multiply(this.cnot, qubits.value);
    return qubits;
  }

  // Rotate pi radians on the y-axis if the first qubit is one
  cy(qubits) {
    this.cy = [[1, 0, 0 ,0],
              [0, 1, 0, 0],
              [0, 0, 0, negi],
              [0, 0, posi, 0]];
    qubits.value = math.multiply(qubits.value, this.cy);
    return this;
  }

  // Rotate pi radians on the z-axis if the first qubit is one
  cz(qubits) {
    this.cz = [[1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, -1]];
    qubits.value = math.multiply(qubits.value, this.cz);
    return this;
  }

  /* Three Qubit Gates */
  // Rotate pi radians on the x-axis if the first and second qubits are one
  ccnot(qubits) {
    this.toffoli = [[1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1],
                    [0, 0, 0, 0, 0, 0, 1, 0]];
    qubits.value = math.multiply(qubits.value, this.toffoli);
    return this;
  }

  // Swap the second and third qubit values if the first is one
  cswap(qubits) {
    this.cswap = [[1, 0, 0, 0, 0, 0, 0, 0],
                  [0, 1, 0, 0, 0, 0, 0, 0],
                  [0, 0, 1, 0, 0, 0, 0, 0],
                  [0, 0, 0, 1, 0, 0, 0, 0],
                  [0, 0, 0, 0, 1, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 1, 0],
                  [0, 0, 0, 0, 0, 1, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 1]];
    qubits.value = math.multiply(qubits.value, this.cswap);
    return this;
  }

}

var qc = new QC();
var newBit = qc.qreg(2);

console.log(form.unKron(form.nKron(inter.evalBraKet("|100>"))));
console.log(form.nKron(inter.evalBraKet("|01>")));
console.log(form.displayValue(qc.cx(qc.h(newBit))));
