console.log("my name is dat");
var myName ="dat \"haha\" inside my \"name\"";
console.log(myName);
var yourName = '<a href="https://www.google.com" target="_blank">google</a>';
console.log(yourName);
var myStr = "firstline\n\tsecondline\nthirdline";
console.log(myStr);

// độ dài của String 
myNameLength = myName.length;  
console.log(myNameLength);
// phần tử đầu tiên của một String 
myNameFirstLetter = myName[0];
console.log(myNameFirstLetter);

myName[0]="D"; // không thể thay đổi được phần tử theo cách này
console.log(myName); 

// array mảng
var ourArray = ["John", 23];
console.log(ourArray);
var myArray = [["Bulls", 23], ["White Sox", 45]];
console.log(myArray);

var me = [44,50,60];
me[1] = 55; // thay đổi phần tử của mảng
console.log(me);

var myKnow = [["the universe", 42], ["everything", 101010]];
var myData = myKnow[0][1]; // mảng 2 chiều 
console.log(myData);

myArray.push(["dog", 3]); // thêm phần tử vào cuối mảng
myArray.pop(); // xóa phần tử cuối cùng của mảng
console.log(myArray);
myArray.shift(); // xóa phần tử đầu tiên của mảng
myArray.unshift(["Paul", 35]); // thêm phần tử vào đầu mảng
console.log(myArray);

// function chức năng 
function wordBlanks(myNoun, myAdjective, myVerb, myAdverb) {
    var result = "";
    result += "The " + myAdjective + " " + myNoun + " " + myVerb + " to the store " + myAdverb;
    return result;
}   
console.log(wordBlanks("dog", "big", "ran", "quickly"));

//boolean
var isItTrue = true;
console.log(isItTrue);
//strict equality operator so sánh cả kiểu dữ liệu và giá trị
console.log(3 === 3); // true
console.log(3 === '3'); // false

//Strict inequality operator
console.log(3 !== 3);   // false

//golfscore 
var names = ["Hole-in-one!", "Eagle", "Birdie", "Par", "Bogey", "Double Bogey", "Go Home!"];
console.log
function golfScore(par, strokes) {
    if (strokes == 1) {
        return names[0];
    } else if (strokes <= par - 2) {
        return names[1];
    } else if (strokes == par - 1) {  
        return names[2];
    } else if (strokes == par) {
        return names[3];
    } else if (strokes == par + 1) {
        return names[4];
    } else if (strokes == par + 2) {
        return names[5];
    } else  {
        return names[6];
    }  
}
console.log(golfScore(5, 4));         

function caseInSwitch(val) {
    var answer ="";
    switch(val){
        case 1 : 
            answer = "alpha";
            break ;
        case 2 : 
            answer = "beta";
            break ;        
        case 3 :    
            answer = "gamma";
            break ;
        case 4 :
            answer = "delta";
            break ;    
        default :
            answer = "stuff";
            break ;
    }
    return answer;
}
console.log(caseInSwitch(1));

function checkTheHeight(a){
    var answer = "";
    switch(a){
        case 1 : 
        case 2 : 
        case 3 : 
            answer = "Low";
            break ;
        case 4 : 
        case 5 : 
        case 6 : 
            answer = "Mid";
            break ;
        case 7 : 
        case 8 : 
        case 9 : 
            answer = "High";
            break;
        default :
            answer = "Error";
            break ;
    }
    return answer ;
}
var a = 8;
console.log(checkTheHeight(a));

function changeTheSwitch(val){
    var answer = "";
    switch(val){
        case 1 : 
            answer = "alpha";
            break;
        case 2 : 
            answer = "beta";
            break;
        case 3 : 
            answer = "gamma";
            break;
        case 4 : 
            answer = "delta";
            break;
        default : 
            answer = "datmu";
            break;
    }
    return answer ;
}
console.log(changeTheSwitch(5));

// return early pattern for functions
function hello(a,b){
    if(a<b) return false ;
    else {
        var c = a +b;
    }
    return c ;
}
console.log(hello(5,3));


//example of object 
var yebamate = {
    "name" : "yebamate",
    "age" : 3,
    "job" : "student",
    "city" : "hanoi",
    "lets go" : "yes sir ",
     20 : "Dat Luu"
}

var what = yebamate["lets go"];
var theName = yebamate.name;
var theCity = yebamate.city;
console.log(theName);
console.log(theCity);
console.log(what);

var playerNumber = 20;
var player = yebamate[playerNumber];
console.log(player);

yebamate.whatsup = "yeyeye"; // thêm phần tử mới vào object
console.log(yebamate.whatsup);

yebamate['yolo'] = "never end"; // thêm phần tử mới vào object theo cách này
console.log(yebamate.yolo);

// using object for lookups
function phoneticLookup(val){
    var result = "";
    var lookup = {
        "he" : "him",
        "she" : "her",
        "it" : "its",
        "they" : "them",
    };
    result = lookup[val];
    return result;
}
console.log(phoneticLookup("she"));

// testing objects for properties
var myObj = {
    gift : "pony",
    pet : "kitten",
    bed : "sleigh"
}
function checkObj(obj, checkProp){
    if(obj.hasOwnProperty(checkProp)){
        return obj[checkProp];
    } else {
        return "Not Found";
    }
}
console.log(checkObj(myObj, "yasuo"));

// manipulating complex objects
var myMusic = [
    {
        "artist" : "Billy Joel",
        "title" : "Piano Man",
        "release_year" : 1973,
        "formats" : [   
            "CD",
            "8T",
            "LP"
        ],
        "gold" : true
    },
    {
        "artist" : "Daft Punk",
        "title" : "Random Access Memories",
        "release_year" : 2013,
    }
]
console.log(myMusic);
// accessing nested objects
var myStorage = {
    "car" : {
        "inside" : {
            "glove box" : "maps",
            "passenger seat" : "crumbs"
        },
        "outside" : {
            "trunk" : "jack"
        }
    }
}
console.log(myStorage.car.inside["glove box"]);

// accessing nested arrays
var myPlants = [
    {
        type : "flowers",
        list : [
            "rose",
            "tulip",
            "dandelion"            
        ],
        haha : "hihi"
    },
    {
        type : "trees",
        list : [
            "fir", "nolowa", "chedaa"]
    }
]

var nomoreKing = myPlants[1].list[1];
console.log(nomoreKing);    

//for each loop
var arr = [1,2,3,4,5];
arr.forEach(item => console.log(item));  
