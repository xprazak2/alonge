const arraySum = (array) => {
  let iter,
      sum = 0,
      index = 0;

  while ((eachIteration = { done: index === array.length,
                           value: index < array.length ? array[index] : undefined
                          },
         index++,
         !eachIteration.done)
    ) {
    sum += eachIteration.value;
  }
  return sum;
}

//

const arrayIterator = (array) => {
  let i = 0;

  return () => {
    const done = i === array.length;

    return {
      done,
      value: done ? undefined : array[i++]
    }
  }
}

const iteratorSum = (iterator) => {
  let eachIteration,
      sum = 0;

  while ((eachIteration = iterator(), !eachIteration.done)) {
    sum += eachIteration.value;
  }
  return sum;
}

