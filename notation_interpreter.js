/*
* Author: Jack Kilrain
* Version: 1.1
* Licensing: All Rights Reserved
* Language: JavaScript
*
* Description: Interpets Dirac Bra-Ket notation into qcomp notation
*/

const zero = [1,0];
const one = [0,1];

module.exports = {

  // Evaluate a Dirac Bra-Ket notation equation into an array of one and zero
  evalBraKet: function evalBraKet(expression) {
    if (typeof expression !== "string") {
      // Check if the expression is not a string and throw an error
      // Only strings can be evalutated
      throw new Error(`Error: Expression must be of type String`);
    } else {
      var eval_exp = new Array();
      // Iterate through the expression and convert '0' -> zero '1' -> one
      for (var i in expression) {
        if (expression.charAt(i) === '0') {
          eval_exp.push(zero);
        } else if (expression.charAt(i) === '1') {
          eval_exp.push(one);
        }
      }
      // Return an array of zero and one
      return eval_exp;
    }
  }

}
