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

class Dequeue extends Queue {
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
};

Dequeue.INCREMENT = 4;


// this works
function Queue () {
  Object.assign(this, {
    array: [],
    head: 0,
    tail: -1
  });
}

Object.assign(Queue.prototype, {
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

// this works as well
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

// this also works
class Queue {
  constructor () {
    Object.assign(this, {
      array: [],
      head: 0,
      tail: -1
    });
  }
  pushTail (value) {
    return this.array[this.tail += 1] = value
  }
  pullHead () {
    if (!this.isEmpty()) {
      let value = this.array[this.head]
      this.array[this.head] = void 0;
      this.head += 1;
      return value
    }
  }
  isEmpty () {
    return this.tail < this.head
  }
}

// use symbols to create private properties
const PrivatePerson = (() => {
  const firstName = Symbol('firstName'),
        lastName  = Symbol('lastName');

  return class Person {
    constructor (first, last) {
      ++population;
      this.rename(first, last);
    }
    fullName () {
      return this[firstName] + " " + this[firstName];
    }
    rename (first, last) {
      this[firstName] = first;
      this[firstName] = last;
      return this;
    }
  };
})();

// object methods
const BetterQueue = () =>
  ({
    array: [],
    head: 0,
    tail: -1,
    pushTail: function (value) {
      return this.array[this.tail += 1] = value
    },
    pullHead: function () {
      if (this.tail >= this.head) {
        let value = this.array[this.head];

        this.array[this.head] = void 0;
        this.head += 1;
        return value
      }
    },
    isEmpty: function () {
      this.tail < this.head
    }
  });

const stack = (() => {
  const obj = {
    array: [],
    index: -1,
    push: (value) => obj.array[obj.index += 1] = value,
    pop: () => {
      const value = obj.array[obj.index];

      obj.array[obj.index] = undefined;
      if (obj.index >= 0) {
        obj.index -= 1
      }
      return value
    },
    isEmpty: () => obj.index < 0
  };

  return obj;
})();

// object method id on constructor
const WidgetModel = function (id, attrs) {
  Object.assign(this, attrs || {});
  this.id = function () { return id }
}

Object.assign(WidgetModel.prototype, {
  set: function (attr, value) {
    this[attr] = value;
    return this;
  },
  get: function (attr) {
    return this[attr]
  }
});

// when writing constructors and prototypes manually, we can use decorators
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
    this.reports || (this.reports = new Set());
    this.reports.add(report);
  }),
  removeReport: fluent(function (report) {
    this.reports || (this.reports = new Set());
    this.reports.delete(report);
  }),
  reports: function () {
    return this.reports || (this.reports = new Set());
  }
});

