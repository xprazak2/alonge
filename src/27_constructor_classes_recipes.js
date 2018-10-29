const getWith = (attr) => (object) => object[attr];

function InventoryRecord (apples, oranges, eggs) {
  this.record = {
    apples: apples,
    oranges: oranges,
    eggs: eggs
  }
}

InventoryRecord.prototype.apples = function apples () {
  return this.record.apples
}

InventoryRecord.prototype.oranges = function oranges () {
  return this.record.oranges
}

InventoryRecord.prototype.eggs = function eggs () {
  return this.record.eggs
}

const inventories = [
  new InventoryRecord( 0, 144, 36 ),
  new InventoryRecord( 240, 54, 12 ),
  new InventoryRecord( 24, 12, 42 )
];

// to get a bound method from an instance
const bound = (attrName, ...args) =>
  (args === [])
    ? instance => instance[attrName].bind(instance)
    : instance => Function.prototype.bind.apply(instance[attrName], [instance].concat(args));

mapWith(bound('eggs'))(inventories).map(
  boundmethod =>  boundmethod()
);

// bound('render')(aView) is equivalent to aView.render.bind(aView)

const send = (methodName, ...args) =>
  (instance) => instance[methodName].apply(instance, args);

mapWith(send('apples'))(inventories);

//

const invoke = (fn, ...args) =>
  instance => fn.apply(instance, args);

const data = [
  { 0: 'zero',
    1: 'one',
    2: 'two',
    length: 3},
  { 0: 'none',
    length: 1 },
  // ...
];

mapWith(invoke([].slice, 0))(data)

//

class Cake {
  setFlavour (flavour) {
    return this.flavour = flavour
  },
  setLayers (layers) {
    return this.layers = layers
  },
  bake () {
    // do some baking
  }
}

const cake = new Cake();
cake.setFlavour('chocolate');
cake.setLayers(3);
cake.bake();

class Cake {
  setFlavour (flavour) {
    this.flavour = flavour;
    return this;
  },
  setLayers (layers) {
    this.layers = layers;
    return this;
  },
  bake () {
    // do some baking
    return this;
  }
}

const cake = new Cake().
               setFlavour('chocolate').
               setLayers(3).
               bake();

const fluent = (methodBody) =>
  function (...args) {
    methodBody.apply(this, args);
    return this;
  }

function Cake () {}

Cake.prototype.setFlavour = fluent( function (flavour) {
  this.flavour = flavour;
});

class Cake {
  setFlavour (flavour) {
    this.flavour = flavour;
  },
  setLayers (layers) {
    this.layers = layers;
  },
  bake () {
    // do some baking
  }
}
Cake.prototype.setFlavour = fluent(Cake.prototype.setFlavour);
Cake.prototype.setLayers = fluent(Cake.prototype.setLayers);
Cake.prototype.bake = fluent(Cake.prototype.bake);

const fluent = (methodBody) =>
  function(...args) {
    methodBody.apply(this, args);
    return this;
  }

const fluentClazz = (clazz, ...methodNames) => {
  for (let methodName of methodNames) {
    clazz.prototype[methodName] = fluent(clazz.prototype[methodName]);
  }
  return clazz;
}

fluentClass(Cake, 'setFlavour', 'setLayers', 'bake');

