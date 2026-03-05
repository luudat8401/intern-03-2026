let a = [1, 3, 4,5, 5, 48 , 4,43 ,43 ,4,334,234 ,4234,324,];
a.forEach((item, index) => {
    if(item === 5){
        return;
    }
    console.log(`index: ${index}, value: ${item}`);
})


let sum = a.reduce(myfunction);
function myfunction(total, value,index){
    if(value !== 5){   total += value;}
    return total ;
}console.log(sum);