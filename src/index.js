const repeat = (num, fn) =>
  (num > 0) ? (repeat(num - 1, fn), fn(num)) : undefined

repeat(3, function (n) {
  console.log(`Hello ${n}`);
});