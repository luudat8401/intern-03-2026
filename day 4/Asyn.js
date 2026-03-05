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
    result => cooking(result)).then(result => deliver(result)).then(result => receive(result)).then(result => console.log(result));