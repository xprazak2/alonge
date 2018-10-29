const sam = {
  firstName: 'Sam',
  lastName: 'Lowry',
  fullName () {
    return this.firstName + " " + this.lastName;
  },
  rename (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
}

//

const sam = {
  firstName: 'Sam',
  lastName: 'Lowry'
};

const Person = {
  fullName () {
    return this.firstName + " " + this.lastName;
  },
  rename (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
};

Object.assign(sam, Person);

sam.rename
  //=> [Function]

//  mixins use references to original objects
sam.fullName === Person.fullName
  //=> true

sam.rename === Person.rename
  //=> true

//

const HasCareer = {
  career () {
    return this.chosenCareer;
  },
  setCareer (career) {
    this.chosenCareer = career;
    return this;
  }
};

Object.assign(sam, Person, HasCareer);

// forwarding

function forward(receiver, metaobject, ...methods) {
  methods.forEach(function (methodName) {
    receiver[methodName] = (...args) => metaobject[methodName](...args);
  });

  return receiver;
}


const portfolio = (function () {
  const investments = Symbol();

  return {
    [investments]: [],
    addInvestment(investment) {
      this[investments].push(investment);
    },
    netWorth() {
      return this[investments].reduce(function(acc, item) {
        return acc + item.value;
      }, 0);
    }
  }
})();

const investor = forward({}, portfolio, "addInvestment", "netWorth");

function delegate(reciever, metaobject, ...methods) {
  methods.forEach(function (methodName) {
    reciever[methodName] = (...args) => metaobject[methodName].apply(reciever, args)
  });

  return reciever;
}

function delegateToOwn(reciever, propName, ...methods) {
  methods.forEach(function(methodName) {
    reciever[methodName] = function () {
      const metaobject = reciever[propName];
      return metaobject[methodName].apply(reciever, arguments);
    }
  })

  return reciever;
}

const portfolio = (function() {
  const investmentsProperty = Symbol();

  return {
    addInvestment (investment) {
      this[investmentsProperty] || (this[investmentsProperty] = []);
      return this[investmentsProperty].push(investment);
    },
    netWorth(investment) {
      this[investmentsProperty] || (this[investmentsProperty] = []);
      return this[investmentsProperty].reduce(function(acc, investment) {
        return acc + investment.value;
      }, 0);
    }
  }
})();

const investor = {
  nestEgg: portfolio
}

delegateToOwn(investor, 'nestEgg', 'addInvestment', 'netWorth');

const companyRetirementPlan = {
  netWorth () {
    return 1500000;
  }
}

investor.nestEgg = companyRetirementPlan;

investor.netWorth()
  //=> 1500000

//

const Universe = {
  // ...
  numberOfNeighbours (location) {
    // ...
  }
};

const thisGame = Object.assign({}, Universe);


const Alive = {
  alive () {
    return true;
  },
  aliveInNextGeneration () {
    return (this.numberOfNeighbours() === 3);
  }
};


const Dead = {
  alive () {
    return false;
  },
  aliveInNextGeneration () {
    return (this.numberOfNeighbours() === 2 || this.numberOfNeighbours() === 3);
  }
};

const FsmCell = {
  numberOfNeighbours () {
    return thisGame.numberOfNeighbours(this._location);
  }
}

delegateToOwn(Cell, '_state', ['alive', 'aliveInNextGeneration']);

const someFsmCell = Object.assign({
  _state: Alive,
  _location: {x: -15, y: 12}
}, FsmCell);

//

const Person = {
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
  rename: function (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
};

const sam = Object.create(Person);

//

const methodName = (object) =>
  Object.keys(object).filter(key => typeof(object[key]) == 'function')


function delegate(reciever, metaobject, ...methods = methodNames(metaobject)) {
  methods.forEach(function(methodName) {
    reciever[methodName] = (...args) => metaobject[methodName].apply(reciever, args);
  });
  return receiver;
}

const lowry = {};

delegate(lowry, Person);

Person.fullName = function () {
  return this.firstName[0] + '. ' + this.lastName;
};
lowry.fullName();
  //=> 'S. Lowry'
