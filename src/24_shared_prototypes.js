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

const sam = Object.create(Person);

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


const PersonWithCareer = Object.create(Person);

Object.assign(PersonWithCareer, HasCareer);

const goldie = Object.create(PersonWithCareer);
goldie.rename('Samuel', 'Goldwyn');
goldie.setCareer('Producer');

function invokeMethod(receiver, methodName, listOfArguments) {
  return invokeMethodWithContext(receiver, receiver, methodName, listOfArguments);
}

function invokeMethodWithContext(context, receiver, methodName, listOfArguments) {
  const prototype;

  if (receiver.hasOwnProperty(methodName)) {
    return receiver[methodName].apply(context, listOfArguments);
  }
  else if (prototype = Object.getPrototypeOf(receiver)) {
    return invokeMethodWithContext(context, prototype, methodName, listOfArguments);
  }
  else {
    throw 'Method Missing ' + methodName;
  }
}

//

const Laborer = {
 // ...
};
const Manager = {
 // ...
};
const Probationary = {
  // ...
};

const LaborerOnProbation = Object.assign({}, Laborer, Probationary);
const ManagerOnProbation = Object.assign({}, Manager, Probationary);
