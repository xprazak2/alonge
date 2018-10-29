const someObject = {
  someFunction () {
    return this;
  }
}

someObject.someFunction() === someObject
// true

const someFunction = someObject.someFunction;

someFunction === someObject.someFunction;
// true

const anotherObject = {
  someFunction: someObject.someFunction
}

anotherObject.someFunction === someObject.someFunction;
// true

anotherObject.someFunction() === anotherObject;
// true

anotherObject.someFunction === someObject;
// false

const returnThis = function () { return this };

const thirdObject = {
  someFunction () {
    return returnThis();
  }
}

returnThis() === this;
// true

thirdObject.someFunction() === this;
// true

returnThis.call(thirdObject) === thirdObject;
// true

anotherObject.someFunction.call(someObject) === someObject;
// true

const contextualize = (fn, context) =>
  (...args) =>
    fn.apply(context, args)

const a = [1, 2, 3];
const accreate2 = contextualize(a.concat, a);

let fourthObject = {}

fourthObject.uncontextualized = returnThis;
fourthObject.contextualized = contextualize(returnThis, fourthObject)

fourthObject.contextualized() === fourthObject;
// true
fourthObject.uncontextualized() === fourthObject;
// true
// both were called with explicit reciever

const uncontextualized = fourthObject.uncontextualized,
      contextualized = fourthObject.contextualized;

uncontextualized() === fourthObject;
// false

contextualized() === fourthObject;
// true

const maybe = (fn) =>
  x => x != null ? fn(x) : x;
// This version doesn’t preserve the context,
// so it can’t be used as a method decorator.
// Instead, we have to convert the decoration
// from a fat arrow to a function function

const maybe = (fn) =>
  function (x) {
    return x != null ? fn.call(this, x) : x;
  }

const maybe = (fn) =>
  function (...args) {
    for (const i in args) {
      if (args[i] === null) return args[i];
    }
    return fn.apply(this, args);
  }

const someObject = {
  setSize: maybe(function (size) {
    this.size = size;
  })
}
