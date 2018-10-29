const arraySum = ([first, ...rest], accumulator = 0) =>
  first === undefined
    ? accumulator
    : arraySum(rest, first + accumulator);

const callLeft = (fn, ...args) =>
  (...remainingArgs) =>
    fn(...args, remainingArgs);

const foldArrayWith = (fn, terminalValue, [first, ...rest]) =>
  first === undefined
  ? terminalValue
  : fn(first, foldArrayWith(fn, terminalValue, rest));

const sumArray = callLeft(foldArrayWith, (a, b) => a + b, 0);
//
const callRight = (fn, ...args) =>
  (...remainingArgs) =>
    fn(...remainingArgs, ...args);

const foldArray = (array) => callRight(foldArrayWith, array);

const sumFoldable = (folder) => folder((a, b) => a + b, 0);

sumFoldable(foldArray([1,2,3,4,5]));
//

const foldTreeWith = (fn, terminalValue, [first, ...rest]) =>
  first === undefined
  ? terminalValue
  : Array.isArray(first)
    ? fn(foldTreeWith(fn, terminalValue, first), foldTreeWith(fn, terminalValue, rest))
    : fn(first, foldTreeWith(fn, terminalValue, rest));

const foldTree = (tree) => callRight(foldTreeWith, tree);

sumFoldable(foldTree([1, [4, [9, 16]], 25]));
