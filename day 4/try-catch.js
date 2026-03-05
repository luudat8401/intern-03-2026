try {
  let x = y;
  let y = 5;
} catch(err) {
  let text = err.name  + err.message;
  console.log(text);
}

let num = 1;
try {
  num.toUpperCase();
} catch(err) {
  let text = err.name + err.message;
  console.log(text);
}
//syntax error is not catch able, its happen before runtime
//error silent 

try {
  let x = 101;
  if (x > 100) {
    throw "Too big"; //custom error
  }
} catch (err) {
  console.log("Có lỗi xảy ra:", err);
}

// error là một object bao gồm name và message 

//debug 
console.error("Something went wrong!");