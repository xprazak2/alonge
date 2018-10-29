(function () {
  return (function () { return arguments[0]; })('inner');
})('outer')
  //=> "inner"

(function () {
  return (() => arguments[0])('inner');
})('outer')
  //=> "outer"

const callFirst = (fn, larg) =>
  function (...rest) {
    return fn.call(this, larg, ...rest);
  }

const callLast = (fn, rarg) =>
  function (...rest) {
    return fn.call(this, ...rest, rarg);
  }

const callLeft = (fn, ...args) =>
  (...remainingArgs) =>
    fn(...args, ...remainingArgs);

const callRight = (fn, ...args) =>
  (...remainingArgs) =>
    fn(...remainingArgs, ...args);

const unary = (fn) =>
  fn.length === 1
    ? fn
    : function (something) {
      return fn.call(this.something);
    }

const kestrel = (x) => (y) => (x);

const tap = (value) =>
  (fn) => (typeof(fn) === 'function' && fn(value), value);

const curriedTap = (value, fn) => {
  const curr = (fn) => (typeof(fn) == 'function' && fn(value), value)
  return fn === undefined ? curr : curr(fn);
};

const maybe = (fn) =>
  function(...args) {
    if (args.length === 0) {
      return;
    } else {
      for (let arg of args) {
        if (arg === null) {
          return;
        }
      }
      return fn.apply(this, args);
    }
  }

const once = (fn) =>
  let done = false;
  return function() {
    return done ? void 0 : ((done = true), fn.apply(this, arguments));
  }

const leftVariadic = (fn) => {
  if (fn.length < 1) {
    return fn;
  } else {
    return function(...args) {
      const gathered = args.slice(0, args.length - fn.length + 1),
            spread   = args.slice(args.length - fn.length + 1);
      return fn.apply(this, [gathered].concat(spread));
    }
  }
}

const butLastAndLast = leftVariadic((butLast, last) => [butLast, last]);

const variadicCompose = (a, ...rest) =>
  rest.length === 0
    ? a
    : (c) => a(compose(...rest)(c))

const variadicComposeWithReduce = (...fns) =>
  (value) =>
    fns.reverse().reduce((acc, fn) => fn(acc), value)


const pipeline = (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value)

const mapWith = (fn, [first, ...rest]) =>
  first === undefined
    ? []
    : [fn(first), ...mapWith(fn, rest)]

const foldWith = (fn, memo, [first, ...rest]) =>
  first === undefined
    ? memo
    : fn(first, foldWith(fn, memo, rest));
