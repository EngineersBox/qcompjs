'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
var neg9 = math.complex('0-1');

// Check if the method already exists
if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals");

// Add the equals() function/method to the prototype of array
Array.prototype.equals = function (array) {
  // Return false if the argument is not an array
  if (!array) return false;

  // Return false if the array lengths are different
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // Check if there are nested arrays and apply recursion to them
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Check false if there are two object instances
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
    console.log(this.values);

    var fillRange = function fillRange(start, end) {
      return Array(end - start + 1).fill().map(function (item, index) {
        return start + index;
      });
    };
    this.ALL = fillRange(0, this.values.length - 1);
  }

  _createClass(QC, [{
    key: 'x',
    value: function x(bits) {
      this.paulix = [[0, 1], [1, 0]];
      for (var i in bits) {
        this.values[bits[i]] = math.multiply(this.values[bits[i]], this.paulix);
      }
      return this;
    }
  }, {
    key: 'y',
    value: function y(bits) {
      this.pauliy = [[0, negi], [posi, 0]];
      for (var i in bits) {
        this.values[bits[i]] = math.multiply(this.values[bits[i]], this.pauliy);
      }
      return this;
    }
  }, {
    key: 'z',
    value: function z(bits) {
      this.pauliz = [[1, 0], [0, -1]];
      for (var i in bits) {
        this.values[bits[i]] = math.multiply(this.values[bits[i]], this.pauliz);
      }
      return this;
    }
  }, {
    key: 'sqrtx',
    value: function sqrtx(bits) {
      this.sqrtx = math.multiply(0.5, [[posi, negi], [negi, posi]]);
      for (var i in bits) {
        this.values[bits[i]] = math.multiply(this.values[bits[i]], this.sqrtx);
      }
      return this;
    }
  }, {
    key: 'phase',
    value: function phase(theta, bits) {
      this.phase = [[1, 0], [0, Math.exp(math.multiply(posi, theta))]];
      for (var i in bits) {
        this.values[bits[i]] = math.multiply(this.values[bits[i]], this.phase);
      }
      return this;
    }
  }, {
    key: 't',
    value: function t(bits) {
      this.t = [[1, 0], [0, math.e ** (posi * (math.pi / 4))]];
      for (var i in bits) {
        this.values[bits[i]] = math.multiply(this.values[bits[i]], this.t);
      }
      return this;
    }
  }, {
    key: 'h',
    value: function h(bits) {
      var _this = this;

      this.h = math.multiply(1 / math.sqrt(2), [[1, 1], [1, -1]]);
      if (this.ALL.equals(bits)) {
        this.values = this.values.map(function (val) {
          return math.multiply(val, _this.h);
        });
      } else {
        for (var i in bits) {
          this.values[bits[i]] = math.multiply(this.values[bits[i]], this.h);
        }
      }
      return this;
    }
  }, {
    key: 'swap',
    value: function swap(controlBit, targetBit) {
      var cbit = this.values[controlBit];
      var tbit = this.values[targetBit];
      this.values[controlBit] = tbit;
      this.values[targetBit] = cbit;
      return this;
    }
  }]);

  return QC;
}();

exports.default = QC;


var qc = new QC("|01001>");

console.log(qc.x([1, 2]).x([1, 2]).values);