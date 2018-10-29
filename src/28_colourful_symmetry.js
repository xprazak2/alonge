const maybe = (fn) =>
  (...args) => {
    for (let arg of args) {
      if (arg == null) {
        return arg;
      }
      return fn(...args);
    }
  }

const compose = (a, b) =>
  (x) => a(b(x));

const requiresFinite = (fn) =>
  (n) => {
    if (Number.isFinite(n)){
      return fn(n);
    }
    else throw "Bad Wolf";
  }

const plusOne = x => x + 1;

plus1(1)
  //=> 2

plus1([])
  //=> 1 WTF!?

const safePlusOne = requiresFinite(plusOne);

safePlusOne(1)
  //=> 2

safePlusOne([])
  //=> throws "Bad Wolf"

class Circle {
  constructor (radius) {
    this.radius = radius;
  }
  diameter () {
    return Math.PI * 2 * this.radius;
  }
  scaleBy (factor) {
    return new Circle(factor * this.radius);
  }
}

const two = new Circle(2);

two.scaleBy(3).diameter()
  //=> 37.69911184307752

two.scaleBy(null).diameter()
  //=> 0 WTF!?

Circle.prototype.scaleBy = requiresFinite(Circle.prototype.scaleBy);

two.scaleBy(null).diameter()
  //=> throws "Bad Wolf"

Circle.prototype.scaleBy = requiresFinite(Circle.prototype.scaleBy);

two.scaleBy(3).diameter()
  //=> undefined is not an object (evaluating 'this.radius')

const requiresFinite = (fn) =>
  function (n) {
    if (Number.isFinite(n)) {
      return fn.call(this, n);
    } else {
      throw "Bad wolf";
    }
  }

Circle.prototype.scaleBy = requiresFinite(Circle.prototype.scaleBy);

two.scaleBy(3).diameter()
  //=> 37.69911184307752

two.scaleBy("three").diameter()
  //=> throws "Bad Wolf"

const safePlusOne = requiresFinite(x => x + 1);

safePlusOne(1)
  //=> 2

safePlusOne([])
  //=> throws "Bad Wolf"

const maybe = (method) =>
  function (...args) {
    for (let arg of args) {
      if (arg == null) return arg;
    }
    return method.apply(this, args);
  }

const compose = (a, b) =>
  function (x) {
    return a.call(this, b.call(this, x));
  }

//

class Circle {
  constructor (radius) {
    this.radius = radius;
  }
  diameter () {
    return Math.PI * 2 * this.radius;
  }
  scaleBy (factor) {
    return new Circle(factor * this.radius);
  }
}

const round = new Circle(1);

round.diameter()
  //=> 6.2831853

const round2 = Circle(2);
  //=> Cannot call a class as a function

[1, 2, 3, 4, 5].map(Circle)
  //=> Cannot call a class as a function

const CircleRequiringFiniteRadius = requiresFinite(Circle);

const round3 = new CircleRequiringFiniteRadius(3);
  //=> Cannot call a class as a function

const CirclePrototype = {
  diameter () {
    return Math.PI * 2 * this.radius;
  },

  scaleBy (factor) {
    return CircleFactory(factor * this.radius)
  }
}

const CircleFactory = (radius) =>
  Object.create(CirclePrototype, {
    radius: { value: radius, enumerable: true }
  });

CircleFactory(3).scaleBy(2).diameter();

const requiresFinite = (fn) =>
  function (n) {
    if (Number.isFinite(n)){
      return fn.call(this, n);
    }
    else throw "Bad Wolf";
  }

const FiniteCircleFactory = requiresFinite(CircleFactory);

FiniteCircleFactory(2).scaleBy(3).diameter()
  //=> 37.69911184307752

FiniteCircleFactory(null).scaleBy(3).diameter()
  //=> throws "Bad Wolf"

const likesToDrink = (whom) => {
  switch (whom) {
    case 'Bob':
      return 'Ristretto';
    case 'Carol':
      return 'Cappuccino';
    case 'Ted':
      return 'Allongé';
    case 'Alice':
      return 'Cappuccino';
  }
}

likesToDrink('Alice')
  //=> 'Cappuccino'

likesToDrink('Peter')
  //=> undefined;

//

const startsWithC = (something) => !!something.match(/^c/i)

startsWithC(likesToDrink('Alice'))
  //=> true

const likesSomethingStartingWithC =
  compose(startsWithC, likesToDrink);

likesSomethingStartingWithC('Ted')
  //=> false

const personToDrink = {
  Bob: 'Ristretto',
  Carol: 'Cappuccino',
  Ted: 'Allongé',
  Alice: 'Cappuccino'
}

personToDrink['Alice']
  //=> 'Cappuccino'

personToDrink['Ted']
  //=> 'Allongé'

const composeblueWithCharm =
  (bluefunction, charmedfunction) =>
    (arg) =>
      bluefunction(charmedfunction[arg]);

const composeCharmWithblue =
  (charmedfunction, bluefunction) =>
    (arg) =>
      charmedfunction[bluefunction(arg)]

class Circle {
  constructor (radius) {
    this.radius = radius;
  }
  diameter () {
    return Math.PI * 2 * this.radius;
  }
  scaleBy (factor) {
    return new Circle(factor * this.radius);
  }
}

const CircleFactory = (radius) =>
  new Circle(radius);

CircleFactory(2).scaleBy(3).diameter()
  //=> 37.69911184307752

const FactoryFactory = (clazz) =>
  (...args) =>
    new clazz(...args);

const CircleFactory = FactoryFactory(Circle);

circleFactory(5).diameter()
  //=> 31.4159265

[1, 2, 3, 4, 5].map(FactoryFactory(Circle))
//=>
  [{"radius":1},{"radius":2},{"radius":3},{"radius":4},{"radius":5}]

const Dictionary = (data) => (key) => data[key];

const personToDrink = {
  Bob: 'Ristretto',
  Carol: 'Cappuccino',
  Ted: 'Allongé',
  Alice: 'Cappuccino'
}

['Bob', 'Ted', 'Carol', 'Alice'].map(Dictionary(personToDrink))
  //=> ["Ristretto","Allongé","Cappuccino","Cappuccino"]

const IterableDictionary = (data) => {
  const proxy = (key) => data[key];
  proxy[Symbol.iterator] = function * (...args) {
    yield * data[Symbol.iterator](...args);
  }
  return proxy;
}

const people = IterableDictionary(['Bob', 'Ted', 'Carol', 'Alice']);
const drinks = IterableDictionary(personToDrink);

for (let name of people) {
  console.log(`${name} prefers to drink ${drinks(name)}`)
}
  //=>
    Bob prefers to drink Ristretto
    Ted prefers to drink Allongé
    Carol prefers to drink Cappuccino
    Alice prefers to drink Cappuccino

for (let [name, drink] of personToDrink) {
  console.log(`${name} prefers to drink ${drink}`)
}
//=> undefined is not a function (evaluating 'personToDrink[Symbol.iterator]()

for (let [name, drink] of Object.entries(personToDrink)) {
  console.log(`${name} prefers to drink ${drink}`)
}
  //=>
    Bob prefers to drink Ristretto
    Carol prefers to drink Cappuccino
    Ted prefers to drink Allongé
    Alice prefers to drink Cappuccino

