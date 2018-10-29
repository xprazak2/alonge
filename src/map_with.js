import _ from 'ramda';

const map = (a, fn) => a.map(fn);

const mapWith = (fn) =>
  (array) => map(array, fn);

const squareAll = mapWith((n) => n * n);

console.log(squareAll([2,4,8]));

