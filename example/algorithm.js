
/*
  just test the differences between algorithms
  */

console.time('COST');
console.log('\tLUCAS FIBONACCI DAYAN ARITHMETIC_PROCESSION');
var maxAttempts = 20;
for (var i = 1; i <= maxAttempts; i++) {
  console.log('\t', lucas(i), '\t', fibonacci(i), '\t', dayanseries(i), '\t', arithmetic_procession(i));
}
console.timeEnd('COST');

function arithmetic_procession(n) {
  return n * 2 - 1;
}
function dayanseries(n) {
  return (n * n - n % 2) / 2;
}
function fibonacci(n) {
  var gh5 = Math.sqrt(5);
  return Math.round((Math.pow((1 + gh5), n) - Math.pow((1 - gh5), n)) / (Math.pow(2, n) * gh5));
}
function lucas(n) {
  var gh5 = Math.sqrt(5);
  return Math.round(Math.pow((1 + gh5) / 2, n) + Math.pow((1 - gh5) / 2, n));
}
