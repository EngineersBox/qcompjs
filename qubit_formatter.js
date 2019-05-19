/*
* Author: Jack Kilrain
* Version: 1.2
* Licensing: All Rights Reserved
* Language: JavaScript
*
* Description: Interpets Dirac Bra-Ket notation into qcomp notation
*/

// Library imports
const math = require('mathjs');
const inter = require('./notation_interpreter.js');

const zero = [1,0];
const one = [0,1];

module.exports = {

  entangle: function entangle(qubit) {
    var p1_amps = [];
    var p2_amps = [];
    const comb_particles = nKron(qubits.value);

    comb_particles.forEach(function(i) {
      if (i == zero) {
        p1_amps.push(qubit.values[i]);
      } else if (i == one) {
        p2_amps.push(qubit.values[i]);
      } else {
        continue;
      }
    })
    return p1_amps + p2_amps;
  },

  // Collapse a superposition to display or directly display a qubit(s) value
  measure: function measure(qubit) {
    var amp_size = qubit.amplitudes.length;
    if (amp_size > 0) {
      // If there is a superposition, collpase it and return the results and probabilities
      var prob = Math.floor(Math.random() * amp_size)
      return "\nCollapsed State: " + qubit.amplitudes[prob][0] + "\nProbability: " + qubit.amplitudes[prob][1] + "\n";
    } else {
      // If there is no superposition, return the results
      return qubit.value;
    }
  },

  // Return the stored qubit value
  displayValue: function displayValue(qubit) {
    return qubit.value;
  },

  // Create a multi-qubit matrix (nKron qubits)
  nKron: function nKron(arglist) {
    if (arglist.length == 1) {
      // If there is only one value then return it
      return arglist[0]
    } else {
      // Generate the identity matrix that matches the arglist length
      var value = math.identity(2 ** arglist.length);
      var str_val_line = "";
      arglist.forEach(function(i) {
        if (i.equals(zero) === true) {
          str_val_line += "0";
        } else if (i.equals(one) === true) {
          str_val_line += "1";
        }
      })
      // Return the row in the identity matrix that matches the combined argument list
      return value._data[parseInt(str_val_line, 2)]
    }
  },

  // Return a pattern of one and zero vectors that match the nKron value
  unKron: function unKron(arglist) {
    // Find the index of the 1
    var index_value = arglist.indexOf(1);
    var str_val_line = "";
    // Check if there are zeros before the one and add them
    if (index_value < Math.log2(arglist.length)) {
      for (var i = 0; i < Math.log2(arglist.length) - index_value; i++) {
        str_val_line += "0";
      }
    }
    str_val_line += index_value.toString(2);
    // Return the notation evaluated string
    return inter.evalBraKet(str_val_line);
  },

  /*REVIEW: If not valid, then delete*/
  stateChange: function stateChange(qubit) {
    var amps = qubit.amplitudes;
    var state = [];
    qubit.value.forEach(function(i) {
      if ((Array.isArray(i)) && ((i.equals(zero)) || (i.equals(one)))) {
        state.push(math.multiply([[0, 1],[1, 0]], i));
      }
    })
    if (amps != state) return state
  }

}
