// function outerFunc() {
//   var text = "contents";
//   var innerFunc = function () {
//     console.log(text);
//   };
//   return innerFunc;
// }

// var inner = outerFunc();
// inner();

function Counter() {
  var counter = 0;

  this.increase = function () {
    return ++counter;
  };

  this.decrease = function () {
    return --counter;
  };
}

const counter = new Counter();

console.log(counter.increase());
console.log(counter.decrease());
