const fib = (n) =>
  n < 2
    ? n
    : fib(n - 2) + fib(n - 1);

const memoize = (fn) => {
  const lookupTable = {};

  return function (...args) {
    const key = JSON.stringify(this, args);

    return lookupTable[key] || (lookupTable[key] = fn.apply(this, args));
  }
}

const memoize = (fn, keymaker = JSON.stringify) => {
  const lookupTable = {};

  return function (...args) {
    const key = keymaker.apply(this, args);

    return lookupTable[key] || (lookupTable[key] = fn.apply(this, args));
  }
}

const getWith = (attr) => (object) => object[attr]

const inventories = [
  { apples: 0, oranges: 144, eggs: 36 },
  { apples: 240, oranges: 54, eggs: 12 },
  { apples: 24, oranges: 12, eggs: 42 }
];

mapWith(getWith('oranges'))(inventories);

mapWith(maybe(getWith('oranges')))

//

const pluckWith = (attr) => mapWith(getWith(attr));

const pluckWith = compose(mapWith, getWith)

pluckWith('eggs')(inventories)

const report =
  [ [ { price: 1.99, id: 1 },
    { price: 4.99, id: 2 },
    { price: 7.99, id: 3 },
    { price: 1.99, id: 4 },
    { price: 2.99, id: 5 },
    { price: 6.99, id: 6 } ],
  [ { price: 5.99, id: 21 },
    { price: 1.99, id: 22 },
    { price: 1.99, id: 23 },
    { price: 1.99, id: 24 },
    { price: 5.99, id: 25 } ],
  [ { price: 7.99, id: 221 },
    { price: 4.99, id: 222 },
    { price: 7.99, id: 223 },
    { price: 10.99, id: 224 },
    { price: 9.99, id: 225 },
    { price: 9.99, id: 226 } ] ];

const deepMapWith = (fn) =>
  function innerDeepMapWith (tree) {
    return Array.prototype.map.call(tree, (element) =>
      Array.isArray(element)
        ? innerDeepMapWith(element)
        : fn(element)
    )
  }

deepMapWith(getWith('price'))(report);

