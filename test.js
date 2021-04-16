let number = 2;
let a = number;
let b = add(mul(10, a), div(mul(10, number), 4));
let c = minus(a, negative(b));
let d = 'green';
(() => {
  const style = new Style('.test');
  let testNest = 123;
  style.add(new Property('color', 'red'));
  style.add((() => {
    const style = new Style('.abc .def');
    style.add(new Property('color', `${d}`));
    return style;
  })());
  return style;
})();
(() => {
  const style = new Style('.def');
  let testNest = 'green';
  style.add(new Property('color', 'red'));
  style.add((() => {
    const style = new Style('&:hover > nest');
    style.add(new Property('background', `${testNest}`));
    return style;
  })());
  return style;
})();
