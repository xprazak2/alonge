const EMPTY = null;

const isEmpty = (node) => node === EMPTY;

const pair = (first, rest = EMPTY) => ({ first, rest });

const list = (...elements) => {
  const [first, ...rest] = elements;

  return elements.length === 0
    ? EMPTY
    : pair(first, list(...rest));
}

const forceAppend = (list1, list2) => {
  if (isEmpty(list1)) {
    return 'FAIL!';
  }
  if (isEmpty(list1.rest)) {
    list1.rest = list2;
  }
  else {
    forceAppend(list1.rest, list2);
  }
}

const tortoiseAndHare = (aPair) => {
  let tortoise = aPair,
      hare = aPair.rest;

  while (true) {
    if (isEmpty(tortoise) || isEmpty(hare)) {
      return false;
    }
    if (tortoise === hare) {
      return true;
    }

    hare = hare.rest;

    if (isEmpty(hare)) {
      return false;
    }
    if (tortoise.first === hare.first) {
      return true;
    }

    tortoise = tortoise.rest;
    hare = hare.rest;
  }
}

const aList = list(1, 2, 3, 4, 5);

tortoiseAndHare(aList)
  //=> false

forceAppend(aList, aList.rest.rest);

tortoiseAndHare(aList);
  //=> true

const teleportingTurtle = (list) => {
  let speed = 1,
      rabbit = list,
      turtle = rabit;

  while (true) {
    for (let i = 0; i <= speed, i += 1) {
      rabbit = rabbit.rest;
      if (rabbit === null) {
        return false;
      }
      if (rabbit === turtle) {
        return true;
      }
    }
    turtle = rabit;
    speed *= 2;
  }
  return false;
}
