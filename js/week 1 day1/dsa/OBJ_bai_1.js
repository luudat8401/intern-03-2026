/*
Bài 1: Đảo ngược Khóa và Giá trị (Invert Object)
Cấp độ: Dễ
Mô tả: Trong một số trường hợp cấu hình hệ thống, bạn cần tra cứu ngược từ giá trị (value) để tìm ra khóa (key). Cho một Object có các value đảm bảo là duy nhất (không trùng lặp). Hãy viết hàm invertObject(obj) trả về một Object mới, trong đó các key và value cũ bị hoán đổi vị trí cho nhau.

Ví dụ:

Input: {"phong1": "101", "phong2": "102", "phong3": "103"}

Output: {"101": "phong1", "102": "phong2", "103": "phong3"}

Ràng buộc:

Tất cả các giá trị trong Object ban đầu đều là kiểu nguyên thủy (String hoặc Number).
*/ 

function mergeInto(obj){
    let result = new Object();
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            const value = obj[key] 
            result[value]=key
        }
    }
    return result
}

function mergeInto2(obj){
    return Object.entries(obj).reduce((acc,[key,value])=>{
        acc[value]=key
        return acc 
    },{})
}

function mergeInto3(obj){
    return Object.fromEntries(
        Object.entries(obj).map(([key,value])=>[value,key])
    )
}
//cach 1 
const a = {
    name : 'nam',
    age : 123,
    phone : '43189024890321849032'
}
console.log (mergeInto(a))
console.log(mergeInto2(a))
console.log(mergeInto3(a))

