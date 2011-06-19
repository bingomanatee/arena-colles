
  keys = [];
  for (var value = -50; value <= 50; value += 10){
  if (value > 0){
    keys.push( {label:  'up' + value, value: value});
  } else if (value < 0){
    keys.push( {label: 'down' + (-1 * value), value: value});
  } else {
    keys.push( {label: 'flat', value: 0});
  }
  }
  
  module.exports = keys;