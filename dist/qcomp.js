'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Author: Jack Kilrain
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Version: 2.1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Licensing: All Rights Reserved
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Language: JavaScript (ES6)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Description: Qubit representation and assosciated logic gates
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _mathjs = require('mathjs');

var math = _interopRequireWildcard(_mathjs);

var _notation_interpreter = require('./notation_interpreter');

var _notation_interpreter2 = _interopRequireDefault(_notation_interpreter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var one = [0, 1];
var zero = [1, 0];
var posi = math.complex('0+1');
var negi = math.complex('0-1');

// Check if the method already exists
if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals");

// Add the equals() function/method to the prototype of array
Array.prototype.equals = function (array) {
  // Return false if the argument is not an array
  if (!array) return false;

  // Return false if the array lengths are different
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if there are nested arrays and apply recursion to them
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i])) return false;
      // Check if there are two object instances
    } else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
};

Object.defineProperty(Array.prototype, "equals", { enumerable: false });

var QC = function () {
  function QC(amplitudes) {
    _classCallCheck(this, QC);

    this.values = _notation_interpreter2.default.evalBraKet(amplitudes);
    var fillRange = function fillRange(start, end) {
      return Array(end - start + 1).fill().map(function (item, index) {
        return start + index;
      });
    };
    this.ALL = fillRange(0, this.values.length - 1);
  }

  _createClass(QC, [{
    key: 'applyOperatorToBits',
    value: function applyOperatorToBits(operation, bits) {
      if (this.ALL.equals(bits)) {
        this.values = this.values.map(function (val) {
          return math.multiply(val, operation);
        });
      } else {
        for (var i in bits) {
          this.values[bits[i]] = math.multiply(this.values[bits[i]], operation);
        }
      }
      return this.values;
    }
  }, {
    key: 'applyControlledOperatorToBits',
    value: function applyControlledOperatorToBits(operation, cBits, tBits) {
      if (this.ALL.equals(cBits)) {
        throw new Error("Error: Control bits cannot be ALL");
      } else if (this.ALL.equals(tBits)) {
        this.values = this.values.map(function (val) {
          return math.multiply(val, operation);
        });
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
  }, {
    key: 'X',
    value: function X(bits) {
      this.paulix = [[0, 1], [1, 0]];
      this.values = this.applyOperatorToBits(this.paulix, bits);
      return this;
    }
  }, {
    key: 'Y',
    value: function Y(bits) {
      this.pauliy = [[0, negi], [posi, 0]];
      this.values = this.applyOperatorToBits(this.pauliy, bits);
      return this;
    }
  }, {
    key: 'Z',
    value: function Z(bits) {
      this.pauliz = [[1, 0], [0, -1]];
      this.values = this.applyOperatorToBits(this.pauliz, bits);
      return this;
    }
  }, {
    key: 'sqrtx',
    value: function sqrtx(bits) {
      this.sqrtx = math.multiply(0.5, [[posi, negi], [negi, posi]]);
      this.values = this.applyOperatorToBits(this.sqrtx, bits);
      return this;
    }
  }, {
    key: 'phase',
    value: function phase(theta, bits) {
      this.phase = [[1, 0], [0, Math.exp(math.multiply(posi, theta))]];
      this.values = this.applyOperatorToBits(this.phase, bits);
      return this;
    }
  }, {
    key: 'T',
    value: function T(bits) {
      this.t = [[1, 0], [0, math.e ** (posi * (math.pi / 4))]];
      this.values = this.applyOperatorToBits(this.t, bits);
      return this;
    }
  }, {
    key: 'H',
    value: function H(bits) {
      this.h = math.multiply(1 / math.sqrt(2), [[1, 1], [1, -1]]);
      this.values = this.applyOperatorToBits(this.h, bits);
      return this;
    }
  }, {
    key: 'swap',
    value: function swap(firstBit, secondBit) {
      var cbit = this.values[firstBit];
      var tbit = this.values[secondBit];
      this.values[firstBit] = tbit;
      this.values[secondBit] = cbit;
      return this;
    }
  }, {
    key: 'cnot',
    value: function cnot(controlBits, targetBits) {
      this.not = [[0, 1], [1, 0]];
      this.values = this.applyControlledOperatorToBits(this.not, controlBits, targetBits);
      return this;
    }
  }, {
    key: 'cswap',
    value: function cswap(controlBits, targetBits) {
      if (targetBits.length != 2) throw new Error("Error: Must have 2 target bits");
      var isTrue = true;
      for (var i in controlBits) {
        isTrue = isTrue && this.values[controlBits[i]].equals(one);
      }
      if (isTrue) {
        this.values = this.swap(targetBits[0], targetBits[1]).values;
      }
      return this;
    }
  }, {
    key: 'rx',
    value: function rx(theta, targetBits) {
      this.rx = [[math.cos(theta / 2), math.multiply(negi, math.complex(math.sin(theta / 2)))], [math.multiply(negi, math.complex(math.sin(theta / 2))), math.cos(theta / 2)]];
      switch (theta) {
        // Return the inverted qubit if theta is pi radians
        case math.pi:
          this.value = this.applyOperatorToBits([[0, 1], [1, 0]], targetBits);
          break;
        // Return the qubit if theta is 2*pi radians
        case math.pi * 2:
          this.values = this.values;
          break;
        // Apply the transformation to any other rotation
        default:
          this.values = this.applyOperatorToBits(this.rx, targetBits);
          break;
      }
      return this;
    }
  }, {
    key: 'ry',
    value: function ry(theta, targetBits) {
      this.ry = [[math.cos(theta / 2), math.multiply(-1, math.complex(math.sin(theta / 2)))], [math.complex(math.sin(theta / 2)), math.cos(theta / 2)]];
      switch (theta) {
        // Return the inverted qubit if theta is pi radians
        case math.pi:
          this.values = this.applyOperatorToBits([[0, 1], [1, 0]], targetBits);
          break;
        // Return the qubit if theta is 2*pi radians
        case math.pi * 2:
          this.values = this.values;
          break;
        // Apply the transformation to any other rotation
        default:
          this.values = this.applyOperatorToBits(this.ry, targetBits);
          break;
      }
      return this;
    }
  }, {
    key: 'rz',
    value: function rz(theta, targetBits) {
      this.rz = [[Math.exp(math.multiply(math.complex('0-1i'), theta / 2)), 0], [0, Math.exp(math.multiply(math.complex('0+1i'), theta / 2))]];
      this.values = this.applyOperatorToBits(this.rz, targetBits);
      return this;
    }
  }]);

  return QC;
}();

exports.default = QC;


var qc = new QC("|01001>");
console.log(qc.values);
console.log(qc.rx(math.fraction(math.pi, 3), [0, 1]).values);