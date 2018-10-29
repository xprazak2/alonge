class Person {
  constructor (first, last) {
    this.rename(first, last);
  }
  fullName () {
    return this.firstName + " " + this.lastName;
  }
  rename (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
}

const misterRogers = new Person('Fred', 'Rogers');
misterRogers.fullName()
  //=> Fred Rogers

class Manager extends Person {
  constructor (first, last) {
    super(first, last)
  }
  addReport (report) {
    this.reports().add(report);
    return this;
  }
  removeReport (report) {
    this.reports().delete(report);
    return this;
  }
  reports () {
    return this._reports || (this._reports = new Set());
  }
}

class Worker extends Person {
  constructor (first, last) {
    super(first, last);
  }
  setManager (manager) {
    this.removeManager();
    this.manager = manager;
    manager.addReport(this);
    return this;
  }
  removeManager () {
    if (this.manager) {
      this.manager.removeReport(this);
      this.manager = undefined;
    }
    return this;
  }
}

//

const HasManager = {
  function setManager (manager) {
    this.removeManager();
    this.manager = manager;
    manager.addReport(this);
    return this;
  },
  function removeManager () {
    if (this.manager) {
      this.manager.removeReport(this);
      this.manager = undefined;
    }
    return this;
  }
};

class Manager extends Person {
  constructor (first, last) {
    super(first, last)
  }
  addReport (report) {
    this.reports().add(report);
    return this;
  }
  removeReport (report) {
    this.reports().delete(report);
    return this;
  }
  reports () {
    return this._reports || (this._reports = new Set());
  }
}

class MiddleManager extends Manager {
  constructor (first, last) {
    super(first, last);
  }
}
Object.assign(MiddleManager.prototype, HasManager);

class Worker extends Person {
  constructor (first, last) {
    super(first, last);
  }
}
Object.assign(Worker.prototype, HasManager);

//

class Todo {
  constructor (name) {
    this.name = name || 'Untitled';
    this.done = false;
  }
  do () {
    this.done = true;
    return this;
  }
  undo () {
    this.done = false;
    return this;
  }
}

const Coloured = {
  setColourRGB ({r, g, b}) {
    this.colourCode = {r, g, b};
    return this;
  },
  getColourRGB () {
    return this.colourCode;
  }
};

Object.assign(Todo.prototype, Coloured);

new Todo('test')
  .setColourRGB({r: 1, g: 2, b: 3})
  //=> {"name":"test","done":false,"colourCode":{"r":1,"g":2,"b":3}}

const Coloured = (target) =>
  Object.assign(target, {
    setColourRGB ({r, g, b}) {
      this.colourCode = {r, g, b};
      return this;
    },
    getColourRGB () {
      return this.colourCode;
    }
  });

Coloured(Todo.prototype);

const FunctionalMixin = (behaviour) =>
  target => Object.assign(target, behaviour);

const Coloured = FunctionalMixin({
  setColourRGB ({r, g, b}) {
    this.colourCode = {r, g, b};
    return this;
  },
  getColourRGB () {
    return this.colourCode;
  }
});

//

Coloured(Todo.prototype)

const urgent = new Todo("finish blog post");
urgent.setColourRGB({r: 256, g: 0, b: 0});

for (let property in urgent) console.log(property);
  // =>
    name
    done
    colourCode
    setColourRGB
    getColourRGB

const FunctionalMixin = (behaviour) =>
  function (target) {
    for (let property of Reflect.ownKeys(behaviour)) {
      if (!target[property]) {
        Object.defineProperty(target, prototype, {
          value: behaviour[property],
          writable: true
        });
      }
    }
    return target;
  }

//

class Todo {
  constructor (name) {
    this.name = name || Todo.DEFAULT_NAME;
    this.done = false;
  }
  do () {
    this.done = true;
    return this;
  }
  undo () {
    this.done = false;
    return this;
  }
}

Todo.DEFAULT_NAME = 'Untitled';

// If we are sticklers for read-only constants, we could write:
// Object.defineProperty(Todo, 'DEFAULT_NAME', {value: 'Untitled'});

// mixin with constants

function FunctionalMixin (behaviour, sharedBehaviour = {}) {
  const instanceKeys = Reflect.ownKeys(behaviour);
  const sharedKeys = Reflect.ownKeys(sharedBehaviour);

  function mixin(target) {
    for (let property of instanceKeys) {
      if (!target[property]) {
        Object.defineProperty(target, property, {
          value: behaviour[property],
          writable: true
        });
      }
    }
    return target;
  }

  for (let property of sharedKeys) {
    Object.defineProperty(mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property)
    });
  }

  return mixin;
}

const Coloured = FunctionalMixin({
  setColourRGB ({r, g, b}) {
    this.colourCode = {r, g, b};
    return this;
  },
  getColourRGB () {
    return this.colourCode;
  }
}, {
  RED:   { r: 255, g: 0,   b: 0   },
  GREEN: { r: 0,   g: 255, b: 0   },
  BLUE:  { r: 0,   g: 0,   b: 255 },
});

Coloured(Todo.prototype)

const urgent = new Todo("finish blog post");
urgent.setColourRGB(Coloured.RED);

urgent.getColourRGB()
  //=> {"r":255,"g":0,"b":0}

// mixin methods

urgent instanceof Todo
  //=> true

urgent instanceof Coloured
  //=> false

Coloured[Symbol.hasInstance] = (instance) => true;

urgent instanceof Coloured
  //=> true
{} instanceof Coloured
  //=> true

function FunctionalMixin (behaviour, sharedBehaviour = {}) {
  const instanceKeys = Reflect.ownKeys(behaviour);
  const sharedKeys = Reflect.ownKeys(sharedBehaviour);
  const typeTag = Symbol("isA");

  function mixin (target) {
    for (let property of instanceKeys)
      if (!target[property])
        Object.defineProperty(target, property, {
          value: behaviour[property],
          writable: true
        })
    target[typeTag] = true;
    return target;
  }
  for (let property of sharedKeys)
    Object.defineProperty(mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property)
    });
  Object.defineProperty(mixin, Symbol.hasInstance, { value: (instance) => !!instance[typeTag] });
  return mixin;
}

urgent instanceof Coloured
  //=> true
{} instanceof Coloured
  //=> false

// simulating multiple inheritance

class Todo {
  constructor (name) {
    this.name = name || 'Untitled';
    this.done = false;
  }

  do () {
    this.done = true;
    return this;
  }

  undo () {
    this.done = false;
    return this;
  }

  toHTML () {
    return this.name; // highly insecure
  }
}

let Coloured = FunctionalMixin({
  setColourRGB ({r, g, b}) {
    this.colourCode = {r, g, b};
    return this;
  },

  getColourRGB () {
    return this.colourCode;
  }
});

let ColouredTodo = Coloured(class extends Todo {});

let yellow = {r: 'FF', g: 'FF', b: '00'},
    red    = {r: 'FF', g: '00', b: '00'},
    green  = {r: '00', g: 'FF', b: '00'},
    grey   = {r: '80', g: '80', b: '80'};

let oneDayInMilliseconds = 1000 * 60 * 60 * 24;

class TimeSensitiveTodo extends ColouredTodo {
  constructor (name, deadline) {
    super(name);
    this.deadline = deadline;
  }

  getColourRGB () {
    let slack = this.deadline - Date.now();

    if (this.done) {
      return grey;
    }
    else if (slack <= 0) {
      return red;
    }
    else if (slack <= oneDayInMilliseconds){
      return yellow;
    }
    else return green;
  }

  toHTML () {
    let rgb = this.getColourRGB();

    return `<span style="color: #${rgb.r}${rgb.g}${rgb.b};">${super.toHTML()}</span>`;
  }
}

let task = new TimeSensitiveTodo('Finish JavaScript Allongé', Date.now() + oneDayInMilliseconds);

task.toHTML()
  //=> <span style="color: #FFFF00;">Finish JavaScript Allongé</span>

// subclass factories

const SubclassFactory = (behaviour) => {
  let mixBehaviourInto = FunctionalMixin(bahaviour);

  return (superclazz) => mixBehaviourInto(class extends superclazz {});
}

const ColouredAsWellAs = SubclassFactory({
  setColourRGB ({r, g, b}) {
    this.colourCode = {r, g, b};
    return this;
  },

  getColourRGB () {
    return this.colourCode;
  }
});

class TimeSensitiveTodo extends ColouredAsWellAs(Todo) {
  constructor (name, deadline) {
    super(name);
    this.deadline = deadline;
  }

  getColourRGB () {
    let slack = this.deadline - Date.now();

    if (this.done) {
      return grey;
    }
    else if (slack <= 0) {
      return red;
    }
    else if (slack <= oneDayInMilliseconds){
      return yellow;
    }
    else return green;
  }

  toHTML () {
    let rgb = this.getColourRGB();

    return `<span style="color: #${rgb.r}${rgb.g}${rgb.b};">${super.toHTML()}</span>`;
  }
}

// property conflicts

class Person {
  constructor (first, last) {
    this.rename(first, last);
  }
  fullName () {
    return this.firstName + " " + this.lastName;
  }
  rename (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
};

class Bibliophile extends Person {
  addToCollection (name) {
    this.collection().push(name);
    return this;
  },
  collection () {
    return this._books || (this._books = []);
  }
}

class Author extends Bibliophile {
  // ...
}
// could be ok,
// mixins could cause a clash

const IsBibliophile = {
  addToCollection (name) {
    this.collection().push(name);
    return this;
  },
  collection () {
    return this._books || (this._books = []);
  }
};

const IsAuthor = {
  addBook (name) {
    this.books().push(name);
    return this;
  },
  books () {
    return this._books || (this._books = []);
  }
};

// oops
class BookLovingAuthor extends Person {
}

Object.assign(BookLovingAuthor.prototype, IsBibliophile, IsAuthor);

new BookLovingAuthor('Isaac', 'Asimov')
  .addBook('I Robot')
  .addToCollection('The Mysterious Affair at Styles')
  .collection()
    //=> ["I Robot","The Mysterious Affair at Styles"]

// use symbols to prevent clashes

class Person {
  constructor (first, last) {
    this.rename(first, last);
  }
  fullName () {
    return this.firstName + " " + this.lastName;
  }
  rename (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
};

const IsAuthor = (function () {
  const books = Symbol();

  return {
    addBook (name) {
      this.books().push(name);
      return this;
    },
    books () {
      return this[books] || (this[books] = []);
    }
  };
})();

const IsBibliophile = (function () {
  const books = Symbol();

  return {
    addToCollection (name) {
      this.collection().push(name);
      return this;
    },
    collection () {
      return this[books] || (this[books] = []);
    }
  };
})();

class BookLovingAuthor extends Person {
}

Object.assign(BookLovingAuthor.prototype, IsBibliophile, IsAuthor);

new BookLovingAuthor('Isaac', 'Asimov')
  .addBook('I Robot')
  .addToCollection('The Mysterious Affair at Styles')
  .collection()
    //=> ["The Mysterious Affair at Styles"]
  .books().
    //=> ["I Robot"]

// decoupling properties

class Person {
  constructor (first, last) {
    this.rename(first, last);
  }
  fullName () {
    return this.firstName + " " + this.lastName;
  }
  rename (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
}

class Bibliophile extends Person {
  constructor (first, last) {
    super(first, last);
    this._books = [];
  }
  addToCollection (name) {
    this._books.push(name);
    return this;
  }
  hasInCollection (name) {
    return this._books.indexOf(name) >= 0;
  }
}

const bezos = new Bibliophile('jeff', 'bezos')
  .addToCollection("The Everything Store: Jeff Bezos and the Age of Amazon")
  .hasInCollection("Matthew and the Wellington Boots")
    //=> false

bezos
  .hasInCollection("The Everything Store: Jeff Bezos and the Age of Amazon")
    //=> true

class BookGlutten extends Bibliophile {
  buyInBulk (...names) {
    this.books().push(...names);
    return this;
  }
}

// refactor to use set

class Bibliophile extends Person {
  constructor (first, last) {
    super(first, last);
    this._books = new Set();
  }
  addToCollection (name) {
    this._books.add(name);
    return this;
  }
  hasInCollection (name) {
    return this._books.has(name);
  }
}

// and with symbols

const Bibliophile = (function () {
  const books = Symbol("books");

  return class Bibliophile extends Person {
    constructor (first, last) {
      super(first, last);
      this[books] = [];
    }
    addToCollection (name) {
      this[books].push(name);
      return this;
    }
    hasInCollection (name) {
      return this[books].indexOf(name) >= 0;
    }
  }
})();

class BookGlutten extends Bibliophile {
  buyInBulk (...names) {
    for (let name of names) {
      this.addToCollection(name);
    }
    return this;
  }
}

