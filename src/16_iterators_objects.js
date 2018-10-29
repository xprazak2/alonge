const Numbers = {
  [Symbol.iterator] () {
    let n = 0;

    return {
      next: () =>
        ({ done: false, value: n++ })
    }
  }
}

const mapWith = (fn, collection) =>
({
  [Symbol.iterator]() {
    const iterator = collection[Symbol.iterator]();

    return {
      next () {
        const { done, value } = iterator.next();

        return ({ done, value: done ? undefined : fn(value) });
      }
    }
  }
});

const Evens = mapWith((x) => 2 * x, Numbers);

const filterWith = (fn, iterable) =>
  ({
    [Symbol.iterator] () {
      const iterator = iterable[Symbol.iterator]();

      return {
        next () {
          do {
            const { done, value } = iterator.next();
          } while (!done && !fn(value));
          return { done, value };
        }
      }
    }
  })

const untilWith = (fn, iterable) =>
  ({
    [Symbol.iterator] () {
      const iterator = iterable[Symbol.iterator]();

      return {
        next () {
          let { done, value } = iterator.next();

          done = done || fn(value);

          return ({ done, value: done ? undefined : value })
        }
      }
    }
  })

const Squares = mapWith((x) => x * x, Numbers);
const EndWithOne = filterWith((x) => x % 10 === 1, Squares)
const UpTo100 = untilWith((x) => (x > 1000), EndWithOne)

[...UpTo100]
// [1, 81, 121, ...]

const first = (iterable) =>
  iterable[Symbol.iterator]().next().value;

const rest = (iterable) =>
  ({
    [Symbol.iterator] () {
      const iterator = iterable[Symbol.iterator]();

      iterator.next();
      return iterator;
    }
  })

Stack3.from = function (iterable) {
  const stack = this();

  for (let element of iterable) {
    stack.push(element);
  }
  return stack;
}

Pair1.from = (iterable) =>
  (function iterationToList(iteration) {
    const { done, value } = iteration.next();

    return done ? EMPTY : Pair1(value, iterationToList(iteration));
  })(iterable[Symbol.iterator]())

const numberList = Pair1.from(untilWith((x) => x > 10, Numbers));

Pair1.from(Squares);
  //=> {"first":0,
        // "rest":{"first":1,
                // "rest":{"first":4,
                        // "rest":{ ...

// Generation
const isIterable = (something) =>
  !!something[Symbol.iterator];

const generate = (iterable) => {
  for (let element of iterable) {
    if(isIterable(element)) {
      generate(element);
    }
    else {
      console.log(element);
    }
  }
}

generate([1, [2, [3, 4], 5]])
//=>
// 1
// 2
// 3
// 4
// 5

// Iteration

const treeIterator = (iterable) => {
  const iterators = [iterable[Symbol.iterator]()];

  return () => {
    while (!!iterators[0]) {
      const iterationResult = iterators[0].next();

      if (iterationResult.done) {
        iterators.shift();
      }
      else if (isIterable(iterationResult.value)) {
        iterators.unshift(iterationResult.value[symbol.iterator]());
      }
      else {
        return iterationResult.value;
      }
    }
    return;
  }
}

const i = treeIterator([1, [2, [3, 4], 5]]);
let n;

while (n = i()) {
  console.log(n)
}
//=>
// 1
// 2
// 3
// 4
// 5

// Iteration
let a, b, state = 0;

const fibonacci = () => {
  switch (state) {
    case 0:
      state = 1;
      return a = 0;
    case 1:
      state = 2;
      return b = 1;
    case 2:
      [a, b] = [b, a + b];
      return b;
  }
}

// To write a generator, we write a function, but we make two changes:

// We declare the function using the function * syntax. Not a fat arrow. Not a plain function.
// We don’t return values or output them to console.log. We “yield” values using the yield keyword.

function * empty () {};

empty().next();
// { 'done': true }

function * only (something) {
  yield something;
}

only('you').next()
// { 'done': false, 'value': 'you' }

// invoking only more than once gives us fresh iterator each time

const oneTwoThree = function * () {
  yield 1;
  yield 2;
  yield 3;
};
oneTwoThree().next()
    // {"done":false, value: 1}

oneTwoThree().next()
    // {"done":false, value: 1}

oneTwoThree().next()
    // {"done":false, value: 1}

const iterator = oneTwoThree();

iterator.next()
    // {"done":false, value: 1}

iterator.next()
    // {"done":false, value: 2}

iterator.next()
    // {"done":false, value: 3}

iterator.next()
    // {"done":true}

const oneTwoThree = function () {
  let state = 'newborn';

  return {
    next () {
      switch (state) {
        case 'newborn':
          state = 1;
          return {value: 1};
        case 1:
          state = 2;
          return {value: 2}
        case 2:
          state = 3;
          return {value: 3}
        case 3:
          return {done: true};
      }
    }
  }
};

const ThreeNums = {
  [Symbol.iterator]: function * () {
    yield 1;
    yield 2;
    yield 3;
  }
}

const ThreeNumbers = {
   *[Symbol.iterator] () {
     yield 1;
     yield 2;
     yield 3
   }
 }

const Numbers = {
  *[Symbol.iterator] () {
    let i = 0;

    while (true) {
      yield i++;
    }
  }
};

const Fib = {
  *[Symbol.iterator] () {
    let a, b;

    yield a = 0;

    yield b = 1;

    while (true) {
      [a, b] = [b, a + b];
      yield b;
    }
  }
}

const isIterable = (something) =>
  !!something[Symbol.iterator];

const TreeIterable = (iterable) =>
  ({
    [Symbol.iterator]: function * () {
      for (const e of iterable) {
        if (isIterable(e)) {
          for (const ee of TreeIterable(e)) {
            yield ee;
          }
        }
        else {
          yield e;
        }
      }
    }
  })

for (const i of TreeIterable([1, [2, [3, 4], 5]])) {
  console.log(i);
}
//

function * append (...iterables) {
  for (const iterable of iterables) {
    for (const element of iterable) {
      yield element;
    }
  }
}

const lyrics = append(["a", "b", "c"], ["one", "two", "three"], ["do", "re", "me\
"]);

for (const word of lyrics) {
  console.log(word);
}
//

function * append (...iterables) {
  for (const iterable of iterables) {
    yield * iterable;
  }
}

//

const isIterable = (something) =>
  !!something[Symbol.iterator];

function * tree (iterable) {
  for (const e of iterable) {
    if (isIterable(e)) {
      yield * tree(e);
    }
    else {
      yield e;
    }
  }
};
//
const mapWith = (fn, iterable) =>
  ({
    [Symbol.iterator]: () => {
      const iterator = iterable[Symbol.iterator]();

      return {
        next: () => {
          const {done, value} = iterator.next();

          return ({done, value: done ? undefined : fn(value)});
        }
      }
    }
  });


function * mapWith(fn, iterable) {
  for (const element of iterable) {
    yield fn(element);
  }
}

function * filterWith(fn, iterable) {
  for (const element of iterable) {
    if (!!fn(element)) {
      yield element;
    }
  }
}

function * untilWith(fn, iterable) {
  for (const element of iterable) {
    if (fn(element)) {
      break;
    }
    yield fn(element);
  }
}

function * rest(iterable) {
  const iterator = iterable[Symbol.iterator]();

  iterator.next();
  yield * iterator;
}