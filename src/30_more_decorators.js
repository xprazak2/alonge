const requireAll = (fn) =>
  function (...args) {
    if (args.length < fn.length) {
      throw new Error('missing required args');
    } else {
      return fn(...args);
    }
  };

const requireAll = (fn) =>
  function (...args) {
    if (args.length < fn.length) {
      throw new Error('missing required args');
    } else {
      return fn.apply(this, args);
    }
  }

const once = (fn) => {
  let hasRun = false;

  return function (...args) {
    if (hasRun) {
      return;
    }
    hasRun = true;
    return fn.apply(this, args);
  }
};

class Person {
  setName (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
  fullName () {
    return this.firstName + " " + this.lastName;
  }
};

Object.defineProperty(Person.prototype, 'setName', { value: once(Person.prototype.setName) });

const logician = new Person()
                   .setName('Raymond', 'Smullyan')
                   .setName('Haskell', 'Curry');

logician.fullName()
  //=> Raymond Smullyan

const logician = new Person()
                   .setName('Raymond', 'Smullyan');

const musician = new Person()
                   .setName('Miles', 'Davis');

logician.fullName()
  //=> Raymond Smullyan

musician.fullName()
  //=> Raymond Smullyan

// ??? - method in prototype decorated

const once = (fn) => {
  let invocations = new WeakSet();

  return function (...args) {
    if (invocations.has(this)) return;
    invocations.add(this);
    return fn.apply(this, args);
  }
}

const logician = new Person()
                   .setName('Raymond', 'Smullyan');

logician.setName('Haskell', 'Curry');

const musician = new Person()
                   .setName('Miles', 'Davis');

logician.fullName()
  //=> Raymond Smullyan

musician.fullName()
  //=> Miles Davis

//

const once = (fn) => {
  let invocations = new WeakSet(),
      undefinedContext = Symbol('undefined-context');

  return function (...args) {
    const context = this === undefined
                    ? undefinedContext
                    : this;
    if (invocations.has(context)) return;
    invocations.add(context);
    return fn.apply(this, args);
  }
}

