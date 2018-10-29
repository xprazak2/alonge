const Game = (size = 8) => {
  const board = [];
  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i][j] = 'LRUD'[Math.floor(Math.random() * 4)];
    }
  }

  let initialPosition = [
    2 + Math.floor(Math.random() * (size - 4)),
    2 + Math.floor(Math.random() * (size - 4))
  ];
  //???

  let [x, y] = initialPosition;

  const MOVE = {
    "L": ([x, y]) => [x - 1, y],
    "R": ([x, y]) => [x + 1, y],
    "D": ([x, y]) => [x, y - 1],
    "U": ([x, y]) => [x, y + 1]
  };

  while (x >= 0 && y >= 0 && x < size && y < size) {
    const arrow = board[x][y];

    //???

    [x, y] = MOVE[arrow]([x, y]);
  }
}

//

const MOVE = {
  "←": ([x, y]) => [x - 1, y],
  "→": ([x, y]) => [x + 1, y],
  "↓": ([x, y]) => [x, y - 1],
  "↑": ([x, y]) => [x, y + 1]
};

const Board = (size = 8) => {

  // initialize the board
  const board = [];
  for (let i = 0; i < size; ++i) {
    board[i] = [];
    for (let j = 0; j < size; ++j) {
      board[i][j] = '←→↓↑'[Math.floor(Math.random() * 4)];
    }
  }

  // initialize the position
  const position = [
    Math.floor(Math.random() * size),
    Math.floor(Math.random() * size)
  ];

  return { board, position };
};

const Game = ({ board, position }) => {
  const size = board[0].length;

  return ({
    *[Symbol.iterator] () {
      let [x, y] = position;

      while (x >= 0 && y >= 0 && x < size && y < size) {
        const direction = board[x][y];

        yield direction;
        [x, y] = MOVE[direction](x, y)
      }
    }
  });
}

const statefulMapWith = (fn, seed, iterable) =>
  ({
    *[Symbol.iterator] () {
      let value,
          state = seed;

      for (let element of iterable) {
        [state, value] = fn(state, element);
        yield value;
      }
    }
  });

const positionOf = (game) =>
  statefulMapWith((position, direction) => {
    const [x, y] = MOVE[direction](position);
    position = [x, y];
    return [position, `x: ${x}, y: ${y}`];
  }, [0, 0], game)

const tortoiseAndHare = (iterable) => {
  const hare = iterable[Symbol.iterator]();
  let hareResult = (hare.next(), hare.next());

  for (let tortoiseValue of iterable) {
    hareResult = hare.next();

    if (hareResult.done) {
      return false;
    }

    if (tortoiseValue === hareResult.value) {
      return true;
    }

    hareResult = hare.next();

    if (hareResult.done) {
      return false;
    }

    if (tortoiseValue === hareResult.value) {
      return true;
    }
  }
  return false;
};

const terminates = (game) => tortoiseAndHare(positionOf(game));


// teleporting tortoise

const hasCycle = (iterable) => {
  let iterator = iterable[Symbol.iterator](),
      teleportDistance = 1;

  while (true) {
    let { value, done } = iterator.next();
    let tortoise = value;

    if (done) {
      return false;
    }

    for (let i = 0; i < teleportDistance; i++) {
      let { value, done } = iterator.next();
      let hare = value;

      if (done) {
        return false;
      }

      if (tortoise === hare) {
        return true;
      }
    }
    teleportDistance *= 2;
  }
  return false;
};

const hasCycle = (orderedCollection) => {
  const visited = new Set();

  for (let element of orderedCollection) {
    if (visited.has(element)) {
      return true;
    }
    visited.add(element);
  }
  return false;
};
