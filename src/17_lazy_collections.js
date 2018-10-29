const extend = function (consumer, ...providers) {
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];

    for (let key in provider) {
      consumer[key] = provider[key];
    }
  }
  return consumer;
}

const LazyCollection = {
  map(fn) {
    return Object.assign({
      [Symbol.iterator]: () => {
        const iterator = this[Symbol.iterator];

        return {
          next: () => {
            const { done, value } = iterator.next();

            return ({ done, value: done ? undefined : fn(value) });
          }
        }
      }
    }, LazyCollection)
  },

  reduce(fn, seed) {
    const iterator = this[Symbol.iterator]();
    let iterationResult,
        accumulator = seed;

    while ((iterationResult = iterator.next(), !iterationResult.done)) {
      accumulator = fn(accumulator, iterationResult.value);
    }
    return accumulator;
  },

  find(fn) {
    return Object.assign({
      [Symbol.iterator]: () => {
        const iterator = this[Symbol.iterator]();

        return {
          next: () => {
            let { done, value } = iterator.next();

            done = done || fn(value);
            return ({ done, value: done ? undefined : value });
          }
        }
      }
    }, LazyCollection)
  },

  until(fn) {
    return Object.assign({
      [Symbol.iterator]: () => {
        const iterator = this[Symbol.iterator]();

        return {
          next: () => {
            let { done, value } = iterator.next();

            done = done || fn(value);

            return ({ done, value: done ? undefined : value });
          }
        }
      }
    }, LazyCollection)
  },

  first() {
    return this[Symbol.iterator]().next().value;
  },

  rest() {
    return Object.assign({
      [Symbol.iterator]: () => {
        const iterator = this[Symbol.iterator]();

        iterator.next();
        return iterator;
      }
    }, LazyCollection)
  },

  take(numToTake) {
    return Object.assign({
      [Symbol.iterator]: () => {
        const iterator = this[Symbol.iterator]();
        let remainingElements = numToTake;

        return {
          next: () => {
            let { done, value } iterator.next();

            done = done || remainingElements-- <= 0;

            return ({ done, value: done ? undefined : value })
          }
        }
      }
    }, LazyCollection)
  }
}

const Numbers = Object.assign({
  [Symbol.iterator]: () => {
    let n = 0;

    return {
      next: () =>
        ({ done: false, value: n++ })
    }
  }
}, LazyCollection);

const EMPTY = {
  isEmpty: () => true
}

const isEmpty = (node) => node === EMPTY;

const Pair = (car, cdr = EMPTY) =>
  Object.assign({
    car,
    cdr,
    isEmpty: () => false,
    [Symbol.iterator]: function () {
      let currentPair = this;

      return {
        next: () => {
          if (currentPair.isEmpty()) {
            return { done: true }
          }
          else {
            const value = currentPair.car;
            currentPair = currentPair.cdr;
            return { done: false,  value };
          }
        }
      }
    }
  }, LazyCollection);

Pair.from = (iterable) =>
  (function iterationToList(iteration) {
    const { done, value } = iteration.next();

    return done ? EMPTY : Pair(value, iterationToList(iteration));
  })(iterable[Symbol.iterator]());

const Stack = () =>
  Object.assign({
    array: [],
    index: -1,
    push: function (value) {
      return this.array[this.index += 1] = value;
    },
    pop: function () {
      const value = this.array[this.index];

      this.array[this.index] = undefined;
      if (this.index >= 0) {
        this.index -= 1;
      }
      return value;
    },
    isEmpty: function () {
      return this.index < 0;
    },
    [Symbol.iterator]: function () {
      let iterationIndex = this.index;

      return {
        next: () => {
          if (iterationIndex > this.index) {
            iterationIndex = this.index;
          }
          if (iterationIndex < 0) {
            return { done: true };
          }
          else {
            return { done: false, value: this.array[iterationIndex--] };
          }
        }
      }
    }
  }, LazyCollection);

Stack.from = function (iterable) {
  const stack = this();

  for (let element of iterable) {
    stack.push(element);
  }
  return stack;
}

Stack.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .map((x) => x * x)
  .filter((x) => x % 2 == 0)
  .first()

//=> 100

Pair.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .map((x) => x * x)
  .filter((x) => x % 2 == 0)
  .reduce((seed, element) => seed + element, 0)

//=> 220

Stack.from([ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
            10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29])
  .map((x) => {
    console.log(`squaring ${x}`);
    return x * x
  })
  .filter((x) => {
    console.log(`filtering ${x}`);
    return x % 2 == 0
  })
  .first()


[ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
  .reverse()
  .map((x) => {
    console.log(`squaring ${x}`);
    return x * x
  })
  .filter((x) => {
    console.log(`filtering ${x}`);
    return x % 2 == 0
  })[0]

const Numbers = Object.assign({
  [Symbol.iterator]: () => {
    let n = 0;

    return {
      next: () =>
        ({done: false, value: n++})
    }
  }
}, LazyCollection);

const firstCubeOver1234 =
  Numbers
    .map((x) => x * x * x)
    .filter((x) => x > 1234)
    .first()
