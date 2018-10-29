const Stack1 = () =>
  ({
    array: [],
    index: -1,
    push(value) {
      return this.array[this.index += 1] = value;
    },
    pop() {
      const value = this.array[this.index] = undefined;
      if (this.index >= 0) {
        this.index -= 1;
      }
      return value;
    },
    isEmpty() {
      return this.index < 0;
    },
    iterator() {
      let iterationIndex = this.index;

      return () => {
        if (iterationIndex > this.index) {
          iterationIndex = this.index;
        }
        if (iterationIndex < 0) {
          return { done: true };
        }
        else {
          return { done: false, value: this.array[iterationIndex--] }
        }
      }
    }
  })

const iteratorSum = (iterator) => {
  let eachIteration,
      sum = 0;

  while((eachIteration = iterator, !eachIteration.done)) {
    sum += eachIteration.value;
  }
  return sum;
}

const stact = Stack1();
stack.push(1)
stack.push(2)
stack.push(3)

iteratorSum(stack.iterator())

const collectionSum = (collection) => {
  const iterator = collection.iterator();

  let eachIteration,
      sum = 0;

  while ((eachIteration = iterator(), !eachIteration.done)) {
    sum += eachIteration.value;
  }
  return sum;
}


const Stack2 = () =>
  ({
    array: [],
    index: -1,
    push(value) {
      return this.array[this.index += 1] = value;
    },
    pop() {
      const value = this.array[this.index] = undefined;
      if (this.index >= 0) {
        this.index -= 1;
      }
      return value;
    },
    isEmpty() {
      return this.index < 0;
    },
    iterator() {
      let iterationIndex = this.index;

      return {
        next() {
          if (iterationIndex > this.index) {
            iterationIndex = this.index;
          }
          if (iterationIndex < 0) {
            return { done: true }
          }
          else {
            return { done: false, value: this.array[iterationIndex--] }
          }
        }
      }
    }
  })

const stack = Stack2();

stack.push(2000);
stack.push(10);
stack.push(5)

const collectionSum = (collection) => {
  const iterator = collection.iterator();

  let eachIteration,
      sum = 0;

  while ((eachIteration = iterator.next(), !eachIteration.done)) {
    sum += eachIteration.value;
  }
  return sum
}

collectionSum(stack)

const Stack3 = () =>
  ({
    array: [],
    index: -1,
    push (value) {
      return this.array[this.index += 1] = value;
    },
    pop () {
      const value = this.array[this.index];

      this.array[this.index] = undefined;
      if (this.index >= 0) {
        this.index -= 1
      }
      return value
    },
    isEmpty () {
      return this.index < 0
    },
    [Symbol.iterator] () {
      let iterationIndex = this.index;

      return {
        next () {
          if (iterationIndex > this.index) {
            iterationIndex = this.index;
          }
          if (iterationIndex < 0) {
            return {done: true};
          }
          else {
            return {done: false, value: this.array[iterationIndex--]}
          }
        }
      }
    }
  });

const stack = Stack3();

stack.push(2000);
stack.push(10);
stack.push(5)

const collectionSum = (collection) => {
  const iterator = collection[Symbol.iterator]();

  let eachIteration,
      sum = 0;

  while ((eachIteration = iterator.next(), !eachIteration.done)) {
    sum += eachIteration.value;
  }
  return sum
}

collectionSum(stack)

const iterableSum = (iterable) => {
  let sum = 0;

  for (const num of iterable) {
    sum += num;
  }
  return sum
}

iterableSum(stack)

// The for...of loop works directly with any object that is iterable,
// meaning it works with any object that has a Symbol.iterator method
// that returns an object iterator.

const EMPTY = {
  isEmpty: () => true
};

const isEmpty = (node) => node === EMPTY;

const Pair1 = (first, rest = EMPTY) =>
  ({
    first,
    rest,
    isEmpty () { return false },
    [Symbol.iterator] () {
      let currentPair = this;

      return {
        next () {
          if (currentPair.isEmpty()) {
            return {done: true}
          }
          else {
            const value = currentPair.first;

            currentPair = currentPair.rest;
            return {done: false, value}
          }
        }
      }
    }
  });

const list = (...elements) => {
  const [first, ...rest] = elements;

  return elements.length === 0
    ? EMPTY
    : Pair1(first, list(...rest))
}

const someSquares = list(1, 4, 9, 16, 25);

iterableSum(someSquares)

//

const Numbers = {
  [Symbol.iterator]() {
    let n = 0;

    return {
      next: () =>
        ({ done: false, value: n++ })
    }
  }
}

const RandomNumbers = {
  [Symbol.iterator]: () =>
    ({
      next() {
        return { value: Math.random() }
      }
    })
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