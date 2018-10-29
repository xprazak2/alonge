const EMPTY = null;

const isEmpty = (node) => node === EMPTY;

const pair = (first, rest = EMPTY) => ({ first, rest });

const list = (...elements) => {
  const [first, ...rest] = elements;

  return elements.length === 0
    ? EMPTY
    : pair(first, list(...rest));
};

const print = (aPair) =>
  isEmpty(aPair)
    ? ""
    : `${aPair.first} ${print(aPair.rest)}`

const listIterator = (aPair) =>
  () => {
    const done = isEmpty(aPair);
    if (done) {
      return { done };
    }
    else {
      const { first, rest } = aPair;
      aPair = aPair.rest;
      return { done, value: first };
    }
  }

const iteratorSum = (iterator) => {
  let eachIteration,
      sum  = 0;

  while ((eachIteration = iterator(), !eachIteration.done)) {
    sum += eachIteration.value;
  }

  return sum;
}

const aListIterator = listIterator(list(1,2,3,4));