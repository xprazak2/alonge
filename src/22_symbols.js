const array = Symbol(),
      head  = Symbol(),
      tail  = Symbol();

const Queue = () =>
  ({
    [array]: [],
    [head]: 0,
    [tail]: -1,
    pushTail (value) {
      return this[array][this[tail] += 1] = value
    },
    pullHead () {
      if (this[tail] >= this[head]) {
        let value = this[array][this[head]];

        this[array][this[head]] = undefined;
        this[head] += 1;
        return value
      }
    },
    isEmpty () {
      return this[tail] < this[head]
    }
  });

let q = Queue();
q.pushTail('hello');
q.pushTail('symbols');

q.pullHead()
  //=> 'hello'

q
  //=> {}

q.tail
  //=> undefined