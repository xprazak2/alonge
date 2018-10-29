function *mapWith(fn, iterable) {
  for (let element of iterable) {
    yield fn(element);
  }
}

function *mapAllWith(fn, iterable) {
  for (const element of iterable) {
    yield *fn(element);
  }
}

function *filterWith(fn, iterable) {
  for (const element of iterable) {
    if (!!fn(element)) {
      yield element;
    }
  }
}

function *compact(iterable) {
  for (const element of iterable) {
    if (element !== null) {
      yield element;
    }
  }
}

function *untilWith(fn, iterable) {
  for (const element of iterable) {
    if (fn(element)) {
      break;
    }
    yield fn(element);
  }
}

function *rest(iterable) {
  const iterator = iterable[Symbol.iterator]();

  iterator.next();
  yield *iterator;
}

function *take(numToTake, iterable) {
  const iterator = iterable[Symbol.iterator]();

  for (let i = 0; i < numToTake; i++) {
    const { done, value } = iterator.next();
    if (!done) {
      yield value;
    }
  }
}

function *zip(...iterables) {
  const iterators = iterables.map(i => i[Symbol.iterator]());

  while (true) {
    const pairs = iterators.map(j => j.next());
    const dones = pairs.map(p => p.done),
          values = pairs.map(p => p.value);

    if (dones.indexOf(true) >= 0) {
      break;
    }

    yield values;
  }
}

function *zipWith(zipper, ...iterables) {
  const iterators = iterables.map(i => i[Symbol.iterator]());

  while (true) {
    const pairs = iterators.map(j => j.next()),
          dones = pairs.map(p => p.done),
          values = pairs.map(p => p.value);

    if (dones.indexOf(true) >= 0) break;
    yield zipper(...values);
  }
}

const reduceWith = (fn, seed, iterable) => {
  let accumulator = seed;

  for (const element of iterable) {
    accumulator = fn(accumulator, element);
  }
  return accumulator;
}

const first = (iterable) =>
  iterable[Symbol.iterator]().next().value;

function memoize(generator) {
  const memos = {},
        iterators = {};

  return function * (...args) {
    const key = JSON.stringify(args);
    let i = 0;

    if (memos[key] === null) {
      memos[key] = [];
      iterators[key] = generator(...args);
    }

    while (true) {
      if (i < memos[key].lenght) {
        yield memos[key][i++];
      } else {
        const { done, value } = iterators[key].next();

        if (done) {
          return;
        } else {
          yield memos[key][i++] = value;
        }
      }
    }
  }
}

