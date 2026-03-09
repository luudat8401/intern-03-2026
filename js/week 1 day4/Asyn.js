function step1(){
    return new Promise(resolve =>
    {
        setTimeout(()=> resolve("A"),100);
    }
    );
}
function step2(value){
    return new Promise(resolve =>{
        setTimeout(()=> resolve(value +"B"),100);
    });
}

function step3(value){
    return new Promise(resolve =>{
        setTimeout(()=> resolve(value+"C"),100);}

    );
}
step1().then(resul => step2(resul)).
then(resul => step3(resul)).then(result => console.log(result));

async function runstep(){
    let a = await step1();
    let ab = await step2(a);
    let abc = await step3(ab);
    console.log(abc);
}
runstep();



function order(){
    return new Promise(resolve =>{
        setTimeout(()=> resolve("order"),1000);
    });
}
function cooking(value){
    return new Promise(resolve =>{
       setTimeout(()=>resolve(value +" done"),1000); 
    });
}
function deliver(value){
    return new Promise(resolve =>{
        setTimeout(()=>resolve(value + "shipping"),1000);
    });
}
function receive(value){
    return new Promise(resolve =>{
        setTimeout(()=> resolve(value + " done"),1000);
    });
}
order().then(
    result => cooking(result)).
    then(result => deliver(result)).
    then(result => receive(result)).
    then(result => console.log(result));

async function orderDoAn(){
    let step1 = await order();
    let step2 = await cooking(step1);
    let [delivery,receiver]= await Promise.all([
        deliver(step2),receive(step2)
    ]);
    console.log(delivery,'|',receiver,'|',step1);
}
orderDoAn();

async function getTotalPrice() {
    try{
        const response = await fetch("https://dummyjson.com/products");
        const mang = await response.json();
        const data = mang.products;

        const total = data.reduce((sum,p)=> sum + p.price,0);
        console.log("tong gia tri san phamr", + total);

    }catch(err){
        console.log(err);
    }
    
    
}
getTotalPrice();
console.log("hello");
