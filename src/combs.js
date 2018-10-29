// makes constant functions
const K = (x) => (y) => x;
const I = (x) => x;
const V = (x) => (y) => (z) => z(x)(y);

K(6)(7)
// 6
K(1)(2)
// 1
// first value is always returned

// if K(x)(y) ~> x, then K(I)(x) ~> I, then K(I)(x)(y) ~> I(y)
// therefore K(I)(x)(y) ~> y

K(I)(6)(7)
// 7

K(I)(1)(2)
// 2
// second value is always returned

const first = K,
      second = K(I),
      pair = V;

const latin = pair("primus")("secundus");

latin(first)

//

const first = ({ first, rest }) => first,
      rest = ({ first, rest }) => rest,
      pair = (first, rest) => ({ first, rest }),
      EMPTY = ({});

const length = (aPair) =>
  aPair === EMPTY
   ? 0
   : 1 + length(rest(aPair));


const reverse = (aPair, delayed = EMPTY) =>
  aPair === EMPTY
    ? delayed
    : reverse (rest(aPair), pair(first(aPair), delayed));

const mapWith = (fn, aPair, delayed = EMPTY) =>
  aPair === EMPTY
    ? reverse(delayed)
    : mapWith(fn, rest(aPair), pair(fn(first(aPair)), delayed));

const first = K,
      rest = K(I),
      pair = V,
      EMPTY = (() => {});

const length = (aPair) =>
  aPair === EMPTY
    ? 0
    : 1 + length(aPair(rest));

const reverse = (aPair, delayed = EMPTY) =>
  aPair === EMPTY
    ? delayed
    : reverse(aPair(rest), pair(aPair(first))(delayed));

const mapWith = (fn, aPair, delayed = EMPTY) =>
  aPair === EMPTY
    ? reverse(delayed)
    : mapWith(fn, aPair(rest), pair(fn(aPair(first)))(delayed));

//

const pairFirst = K,
      pairRest  = K(I),
      pair = V;

const first = (list) => list(
  () => "Error",
  (aPair) => aPair(pairFirst)
);

const rest = (list) => list(
  () => "Error",
  (aPair) => aPair(pairRest)
);

const length = (list) => list(
  () => 0,
  (aPair) => 1 + length(aPair(pairRest))
);

const print = (list) => list(
  () => "",
  (aPair) => `${aPair(pairFirst)} ${print(aPair(pairRest))}`
);

const EMPTYLIST = (whenEmpty, unlessEmpty) => whenEmpty();

const node = (x) => (y) =>
  (whenEmpty, unlessEmpty) => unlessEmpty(pair(x)(y));

const myList = node(1)(node(2)(node(3)(EMPTYLIST)));

print(myList);


const reverse = (list, delayed = EMPTYLIST) => list(
  () => delayed,
  (aPair) => reverse(aPair(rest), node(aPair(first))(delayed))
);

const mapWith = (fn, list, delayed = EMPTYLIST) =>
  list(
    () => reverse(delayed),
    (aPair) => mapWith(fn, aPair(pairRest), node(fn(aPair(first)))(delayed))
  );

//

const first = K,
      second = K(I),
      pair = (first) => (second) => {
        const pojo = { first, second };

        return (selector) => selector(pojo.first)(pojo.second);
      };