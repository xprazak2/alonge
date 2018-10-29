const lengthDelaysWork = ([first, ...rest], numberToAdd) =>
  first === undefined
    ? numberToAdd
    : lengthDelaysWork(rest, 1 + numberToAdd);

const callLast = (fn, ...args) =>
  (...remainingArgs) =>
    fn(...remainingArgs, args)

const length = (n) => lengthDelaysWork(n, 0);

const lengthAgain = callLast(lengthDelaysWork, 0);

const mapWithDelaysWork = (fn, [first, ...rest], prepend) =>
  first === undefined
    ? prepend
    : mapWithDelaysWork(fn, rest, [...prepend, fn(first)])

const mapWith = callLast(mapWithDelaysWork, []);

const delayedFactorial = (n, delayed) =>
  n === 1
    ? delayed
    : delayedFactorial(n - 1, n * delayed);

const factorial = (n) =>
  delayedFactorial(n, 1);