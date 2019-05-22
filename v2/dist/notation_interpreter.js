'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var one = [0, 1];
var zero = [1, 0];

var format = function () {
  function format() {
    _classCallCheck(this, format);
  }

  _createClass(format, null, [{
    key: 'evalBraKet',
    value: function evalBraKet(expression) {
      if (typeof expression !== "string") {
        // Check if the expression is not a string and throw an error
        // Only strings can be evalutated
        throw new Error('Error: Expression must be of type String');
      } else {
        var eval_exp = new Array();
        // Remove any of the syntactic sugar from the Bra-Ket notation
        var expr = expression.replace(/^\|/, '').replace(/>$/, '');
        // Iterate through the expression and convert '0' -> zero '1' -> one
        for (var i in expr) {
          if (expr.charAt(i) === '0') {
            eval_exp.push(zero);
          } else if (expr.charAt(i) === '1') {
            eval_exp.push(one);
          }
        }
        // Return an array of zero and one
        return eval_exp;
      }
    }
  }]);

  return format;
}();

exports.default = format;