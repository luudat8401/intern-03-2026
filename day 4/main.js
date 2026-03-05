let a = [1, 3, 4,5, 5, 48 , 4,43 ,43 ,4,334,234 ,4234,324,];
a.forEach((item, index) => {
    if(item === 5){
        return;
    }
    console.log(`index: ${index}, value: ${item}`);
})
let x2 = a.map(value => value * 2);
console.log(x2);

let evenNumbers = a.filter(value => value % 2 === 0);
console.log(evenNumbers);

let sum = a.reduce((total, value,index) => 
   index === 5 ? total : total + value, 0
);
console.log(sum);

//excercises 
let numbers = [2,5,10,15,20];
numbers.forEach((item, index) => {
    if(item !==10){
        console.log(`index: ${index}, value: ${item}`);
    }
});

let names = ["dat","hoa","minh"];
let Upper = names.map(value => value.toUpperCase());
console.log(Upper);

let ages = [18, 22, 30, 15, 25];
let adults = ages.filter(value => value >= 18);
console.log(adults);

let prices = [100,200,300,400];
let tong = prices.reduce(TinhTong,0);
function TinhTong(total,value){
    total = total + value;
    return total;
}

console.log(tong);


//js asyn
