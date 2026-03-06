//function
function myFunction(a,n){
    return a+n;
}
console.log(myFunction(2,3));
const sayHello = function(name){
    return "hello"+name;
}
console.log(sayHello("Dat"));

const greet = name => "hello " +name
console.log(greet("dat"));

const sum =(a,b) => a+b
console.log(sum(2,3))

//array object 
let a = [1,2,3,4,5];

const hocsinh = {
    name : "dat",
    age : 12,
    grade : 8,
    x : " "    
};
 let text = "";
// xử lý array sau khi hocsinh đã tồn tại
for(let i in hocsinh){
    text+= hocsinh[i]+" ";
}

console.log(text)

switch(5){
    case 1 : 
    case 2 : 
    case 3 : 
    case 5 : {
        console.log("checked");
        break;
    }
    default : return 1 ;
}
//es6 + 
const myWord = (a,b)=>a+b; //arrow function
console.log(myWord(2,3))

//deconstructed
const names =["dat","minh","vu","do"]
const[name1,name2,name3,name4]=names
console.log(name1)

const person ={
    name : "dat",
    age : 12,
    area : {
        city : "hanoi",
        address : "xuanmai"
    }
}
const {
    name,
    age,
    area:{
        city,address
    }
} = person

console.log(city)
//spread and rest in es6+
function numbers (...sum){
    return sum.reduce((total,value)=>total+value,0)
}
console.log(numbers(1,2,3,4,5));

const grade =[8,9,10];
console.log(...grade)
//Template Literals
const lawyer = "clifford mains";
const lawyer_age =  12;
console.log(`this is the lawyer, and his name is ${lawyer}. at the age of ${lawyer_age}`);
//filer 
const movies =[
    movie1 = {
        name : "hes dek",
        type : "horror",
        imdb : 2.3
    },
    movie2 = {
        name : "hes dek",
        type : "adventure",
        imdb : 2.3
    },
    movie3 = {
        name : "hes dek",
        type : "funyr",
        imdb : 2.3
    },
    movie1 = {
        name : "hes dek",
        type : "horror",
        imdb : 2.3
    },
]
const seen = movies.filter(movie => movie.type=="horror")
console.log(seen)

//work with array
const movies_hay = movies.map(movie => {
    return{...movie, type : "yes"}
})
console.log(movies_hay)

