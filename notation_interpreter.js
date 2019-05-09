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

  evalBraKet: function evalBraKet(expression) {
    if (typeof expression !== "string") {
      throw new Error(`Error: Expression must be of type String`);
    } else {
      var eval_exp = new Array();
      for (var i in expression) {
        if (expression.charAt(i) === '0') {
          eval_exp.push(zero);
        } else if (expression.charAt(i) === '1') {
          eval_exp.push(one);
        }
      }
      return eval_exp;
    }
 }

}
