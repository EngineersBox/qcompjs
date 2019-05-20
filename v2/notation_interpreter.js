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

}