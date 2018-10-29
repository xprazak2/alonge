const map = (list, fn) => list.map(fn);

const mapWith = (fn) => (list) => list.map(fn);

const squaresOf = mapWith(n => n * n);

const squaresOf = callRight(map, (n => n * n));

//

const mapWith = (fn) => (list) => map(list, fn);

const mapWith = (first) => (second) => map(second, first);

const wrapper = (fn) =>
  (first) => (second) => fn(second, first);

const flipAndCurry = (fn) =>
  (first) => (second) => fn(second, first);

const flip = (fn) =>
  (first, second) => fn(second, first);

const mapWith = flipAndCurry(map);

//

const flip = (fn) =>
  function (first, second) {
    if (arguments.length === 2) {
      return fn(second, first);
    }
    else {
      return function(second) {
        return fn(second, first);
      }
    }
  }

//

const flipAndCurry = (fn) =>
  (first) =>
    function (second) {
      return fn.call(this, second, first);
    }

const flip = (fn) =>
  function(first, second) {
    return fn.call(this, second, first);
  }

const flip = (fn) =>
  function (first, second) {
    if (arguments.length === 2) {
      return fn.call(this, second, first);
    }
    else {
      return function (second) {
        return fn.call(this, second, first);
      }
    }
  }

const Y = (f) =>
  (x => f(v => x(x)(v)) )(x => f(v => x(x)(v)) );

const factorial = Y(function(fac) {
  return function (n) {
    return (n === 0 ? 1 : n * fac(n - 1));
  }
});


const Y = (f) => {
  const something = x => f(v => x(x)(v));

  return something(something);
}