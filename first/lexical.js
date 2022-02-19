var a = 1;

function foo() {
  console.log(a);
}

function bar() {
  var a = 2;
  foo();
}

bar();
