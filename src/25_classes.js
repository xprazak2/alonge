function Ur() {};

new Ur();
//  => {}

Ur.prototype
//  => {}

//
Ur.prototype.language = 'JavaScript';

const continent = new Ur();
  //=> {}
continent.language
  //=> 'JavaScript'

Ur.prototype.isPrototypeOf(continent)
  //=> true

Object.getPrototypeOf(continent) === Ur.prototype
  //=> true

continent.language = 'CoffeeScript';
continent
  //=> {language: 'CoffeeScript'}
continent.language
  //=> 'CoffeeScript'
Ur.prototype.language
  'JavaScript'

continent.constructor
  //=> [Function]

continent.constructor === Ur
  //=> true

Ur.prototype.constructor
  //=> [Function]
Ur.prototype.constructor === Ur
  //=> true

//

const Queue = function () {
  Object.assign(this, {
    array: [],
    head: 0,
    tail: -1
  })
};

Object.assign(Queue.prototype, {
  pushTail (value) {
    return this.array[this.tail += 1] = value
  },
  pullHead () {
    let value;

    if (!this.isEmpty()) {
      value = this.array[this.head]
      this.array[this.head] = void 0;
      this.head += 1;
      return value
    }
  },
  isEmpty () {
    return this.tail < this.head
  }
});

function worksLikeNew(constructor, ...args) {
  const instance = Object.create(constructor.prototype);

  instance.constructor = constructor;

  const result = constructor.apply(instance, args);

  return result === undefined ? instance : result;
}

function NamedContinent (name) {
  this.name = name;
}

NamedContinent.prototype.description = function () { return `Named ${this.name}`};

const na = worksLikeNew(NamedContinent, "North America");

na.description()
  //=> Named "North America"

const clazz = (...args) => {
  let superclazz, properties, constructor;

  if (args.length === 1) {
    [superclazz, properties] = [Object, args[0]];
  }
  else {
    [superclazz, properties] = args;
  }

  if (properties.constructor) {
    constructor = function (...args) {
      return properties.constructor.apply(this.args);
    }
  }
  else {
    constructor = function () {};
  }

  constructor.prototype = Object.create(superclazz.prototype);
  Object.assign(constructor.prototype, properties);
  Object.defineProperty(constructor.prototype, 'constructor', { value: constructor });
  return constructor;
}

const Queue = clazz({
  constructor: function () {
    Object.assign(this, {
      array: [],
      head: 0,
      tail: -1
    });
  },
  pushTail: function (value) {
    return this.array[this.tail += 1] = value
  },
  pullHead: function () {
    if (!this.isEmpty()) {
      let value = this.array[this.head]
      this.array[this.head] = void 0;
      this.head += 1;
      return value
    }
  },
  isEmpty: function () {
    return this.tail < this.head
  }
});

const Dequeue = clazz(Queue, {
  constructor: function () {
    Queue.prototype.constructor.call(this)
  },
  size: function () {
    return this.tail - this.head + 1
  },
  pullTail: function () {
    if (!this.isEmpty()) {
      let value = this.array[this.tail];
      this.array[this.tail] = void 0;
      this.tail -= 1;
      return value
    }
  },
  pushHead: function (value) {
    if (this.head === 0) {
      for (let i = this.tail; i >= this.head; --i) {
        this.array[i + this.constructor.INCREMENT] = this.array[i]
      }
      this.tail += this.constructor.INCREMENT;
      this.head += this.constructor.INCREMENT
    }
    this.array[this.head -= 1] = value
  }
});

Dequeue.INCREMENT = 4;

//

const HasManager = {
  function setManager(manager) {
    this.removeManager();
    this.manager = manager;
    manager.addReport(this);
    return this;
  },
  function removeManager() {
    if (this.manager) {
      this.manager.removeReport(this);
      this.manager = undefined;
    }
    return this;
  }
};

const Manager = clazz(Person, {
  constructor: function (first, last) {
    Person.call(this, first, last);
  },
  function addReport (report) {
    this.reports().add(report);
    return this;
  },
  function removeReport (report) {
    this.reports().delete(report);
    return this;
  },
  function reports () {
    return this._reports || (this._reports = new Set());
  }
});

const MiddleManager = clazz(Manager, {
  constructor: function (first, last) {
    Manager.call(this, first, last);
  }
});
Object.assign(MiddleManager.prototype, HasManager);

const Worker = clazz(Person, {
  constructor: function (first, last) {
    Person.call(this, first, last);
  }
});
Object.assign(Worker.prototype, HasManager);

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

const Manager = clazz(Person, {
  constructor: function (first, last) {
    Person.call(this, first, last);
  },
  function addReport (report) {
    this.reports().add(report);
    return this;
  },
  function removeReport (report) {
    this.reports().delete(report);
    return this;
  },
  function reports () {
    return this._reports || (this._reports = new Set());
  }
});

const MiddleManager = clazz(Manager, Object.assign({
  constructor: function (first, last) {
    Manager.call(this, first, last);
  }
}, HasManager));

const Worker = clazz(Person, Object.assign({
  constructor: function (first, last) {
    Person.call(this, first, last);
  }
}, HasManager));

//

const fluent = (methodBody) =>
  function (...args) {
    methodBody.apply(this, args);
    return this;
  }

const Manager = clazz(Person, {
  constructor: function (first, last) {
    Person.call(this, first, last);
  },
  addReport: fluent(function (report) {
    this.reports().add(report);
  }),
  removeReport: fluent(function (report) {
    this.reports().delete(report);
  }),
  function reports () {
    return this._reports || (this._reports = new Set());
  }
});

const MiddleManager = clazz(Manager, Object.assign({
  constructor: function (first, last) {
    Manager.call(this, first, last);
  }
}, HasManager));

const Worker = clazz(Person, Object.assign({
  constructor: function (first, last) {
    Person.call(this, first, last);
  }
}, HasManager));

