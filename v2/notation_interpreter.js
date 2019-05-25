/*
* Author: Jack Kilrain
* Version: 1.3
* Licensing: All Rights Reserved
* Language: JavaScript (ES6)
*
* Description: Interpets Dirac Bra-Ket notation into qcomp notation
*/

const one = [0,1];
const zero = [1,0];

export default class format {

  static evalBraKet(expression) {
    if (typeof expression !== "string") {
      // Check if the expression is not a string and throw an error
      // Only strings can be evalutated
      throw new Error(`Error: Expression must be of type String`);
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

  static convetResultToString(expression) {
    return JSON.stringify(expression.values);
  }

}
