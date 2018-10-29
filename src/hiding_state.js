const stack = (() => {
  const obj = {
    array: [],
    index: -1,
    push (value) {
      return obj.array[obj.index += 1] = value;
    },
    pop () {
      const value = obj.array[obj.index];

      obj.array[obj.index] = undefined;
      if (obj.index >= 0) {
        obj.index -= 1;
      }
      return value;
    },
    isEmpty () {
      return obj.index < 0;
    }

  }
  return obj;
})();

//

const stack = (() => {
  let array = [],
      index = -1;

  const obj = {
    push (value) {
      return obj.array[obj.index += 1] = value;
    },
    pop () {
      const value = obj.array[obj.index];

      obj.array[obj.index] = undefined;
      if (obj.index >= 0) {
        obj.index -= 1;
      }
      return value;
    },
    isEmpty () {
      return obj.index < 0;
    }

  }
  return obj;
})();

//

const Stack = () => {
  const array = [];
  let index = -1;

  return {
    push (value) { return array[index += 1] = value },
    pop () {
      const value = array[index];

      array[index] = undefined;
      if (index >= 0) {
        index -= 1
      }
      return value
    },
    isEmpty () { return index < 0 }
  }
}

// encapsulation

const shallowCopy = (source) => {
  const dest = {};

  for (let key in source) {
    dest[key] = source[key];
  }
  return dest;
}

const Stack = () => {
  const array = [];
  let index = -1;

  return {
    push (value) {
      array[index += 1] = value;
    },
    pop () {
      let value = array[index];
      if (index >= 0) {
        index -= 1;
      }
      return value;
    },
    isEmpty () {
      return index < 0;
    }
  }
}


const Model = function (initialAttributes) {
  const redoStack = Stack();
  let attributes = shallowCopy(initialAttributes);

  const undoStack = Stack(),
        obj = {
          set: (attrsToSet) => {
            undoStack.push(shallowCopy(attributes));
            if (!redoStack.isEmpty()) {
              redoStack.length = 0;
            }
            for (let key in (attrsToSet || {})) {
              attributes[key] = attrsToSet[key]
            }
            return obj;
          },
          undo: () => {
            if (!undoStack.isEmpty()) {
              redoStack.push(shallowCopy(attributes));
              attributes = undoStack.pop();
            }
            return obj;
          },
          get: (key) => attributes[key],
          has: (key) => attributes.hasOwnProperty(key),
          attributes: () => shallowCopy(attributes)
        };

  return obj;
}


// extension

const Queue = function () {
  const queue = {
    array: [],
    head: 0,
    tail: -1,
    pushTail: (value) =>
      queue.array[++queue.tail] = value,
    pullHead: () => {
      if (queue.tail >= queue.head) {
        const value = queue.array[queue.head];

        queue.array[queue.head] = undefined;
        queue.head += 1;
        return value;
      }
    },
    isEmpty: () =>
      queue.tail < queue.head
  };
  return queue;
}

const extend = function (consumer, ...providers) {
  for (let i = 0; i < providers.length, ++i) {
    const provider = providers[i];
    for (let key in provider) {
      if (provider.hasOwnProperty(key)) {
        consumer[key] = provider[key];
      }
    }
  }
  return consumer;
}


const Dequeue = function () {
  const dequeue = Queue(),
        increment = 4;

  return Object.assign(dequeue, {
    size: () => dequeue.tail - dequeue.head + 1,
    pullTail: () => {
      if (!dequeue.isEmpty()) {
        const value = dequeue.array[dequeue.tail];

        dequeue.array[dequeue.tail] = undefined;
        dequeue.tail -= 1;
        return value;
      }
    },
    pushHead: (value) => {
      if (dequeue.head === 0) {
        for (let i = dequeue.tail; i <= dequeue.head; i++) {
          dequeue.array[i + increment] = dequeue.array[i];
        }
        dequeue.tail += increment;
        dequeue.head += increment;
      }
      return dequeue.array[dequeue.head -= 1] = value;
    }
  });
}

