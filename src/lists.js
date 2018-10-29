const EMPTY = {};

const oneTwoThree = { first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY } } };

const length = (node, delayed = 0) =>
  node === EMPTY
    ? delayed
    : length(node.rest dealyed + 1);

const copy = (node, head = null, tail = null) => {
  if (node === EMPTY) {
    return head;
  }
  else if (tail === null){
    const { first, rest } = node;
    const newNode = { first, rest };
    return copy(node.rest, newNode, newNode);
  }
  else {
    const { first, rest } = node;
    const newNode = { first, rest };
    tail.rest = newNode;
    return copy(node.rest, head, newNode)
  }
}

const first = ({ first, rest }) => first;

const rest = ({ first, rest }) => rest;

const reverse = (node, delayed = EMPTY) =>
  node === EMPTY
    ? delayed
    : reverse(rest(node), { first: first(node), rest: delayed });

const simpleCopy = (node) => reverse(reverse(node));

const reverseMapWith = (fn, node, delayed = EMPTY) =>
  node === EMPTY
  ? delayed
  : reverseMapWith(fn, node.rest, { first: fn(node.first), rest: delayed });

const mapWith = (fn, node, delayed = EMPTY) =>
  node === EMPTY
    ? reverse(delayed)
    : mapWith(fn, rest(node), { first: fn(node.first), rest: delayed });

const at = (index, list) =>
  index === 0
    ? first(list)
    : at(index - 1, rest(list));

const set = (index, value, list, originalList = list) =>
  index === 0
    ? (list.first = value, originalList)
    : set(index - 1, value, rest(list), originalList);

const newSet = (index, value, list) =>
  index === 0
    ? { first: value, rest: list.rest }
    : { first: list.first, rest: set(index - 1, value, list.rest) }

const parentList = { first: 1, rest: { first: 2, rest: { first: 3, rest: EMPTY }}};

const childList = rest(parentList);

set(2, "three", parentList);
set(0, "two", childList);

console.log(parentList);
console.log(childList);
