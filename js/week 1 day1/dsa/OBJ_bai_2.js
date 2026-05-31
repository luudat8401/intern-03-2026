/*
Bài 2: Tìm Phần Giao Của 2 Object (Object Intersection)
Cấp độ: Dễ - Trung bình
Mô tả: Giả sử bạn có 2 bản ghi cấu hình (config). Hãy viết hàm intersectObjects(obj1, obj2) trả về một Object mới, chỉ chứa những cặp key: value tồn tại giống hệt nhau ở cả 2 Object đầu vào.

Ví dụ:

Input:

obj1 = { role: "admin", status: "active", theme: "dark" }

obj2 = { status: "active", theme: "light", id: 1 }

Output: { status: "active" }
(Giải thích: Cả 2 đều có key "status" với value là "active". Key "theme" có ở cả 2 nhưng value khác nhau nên không lấy).
*/
function Intersection(obj1,obj2){
    const intersection = []
    const result ={}
    for(let key in obj1){
        if(obj2.hasOwnProperty(key)){
            intersection.push(key)
        }
    }
    for(let x of intersection){  //for in là index thôi, còn for of là lấy giá trị
        if(obj1[x]===obj2[x]){
            result[x]=obj1[x]
        }
    }
    return result
}

function Intersection2(obj1,obj2){
    const result = {}
    for(let key in obj1){
        if(obj2.hasOwnProperty(key) && obj2[key]===obj1[key])
            result[key]= obj1[key]
    }
    return result
}

function Intersection3(obj1,obj2){
    return Object.keys(obj1).reduce((acc,key)=>{
        if(obj2.hasOwnProperty(key)&&obj2[key]===obj1[key]){
            acc[key]=obj1[key]
        }
        return acc
    },{})
}

const a ={
    name : 'dat',
    age :12,
    phone : '999999',
    address : 'quang nam to'
}

const b ={
    name : 'dat',
    age : 13,
    phone : '999999',
    address : 'quang nam to'
}
console.log(Intersection(a,b))
console.log(Intersection2(a,b))
console.log(Intersection3(a,b))