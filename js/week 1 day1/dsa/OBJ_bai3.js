/*
Bài 3: Phân nhóm Dữ Liệu (Group By Key)
Cấp độ: Trung bình
Mô tả: Bạn nhận được một danh sách dữ liệu từ Database dưới dạng Mảng các Object. Hãy viết hàm groupBy(array, property) để gom nhóm các Object này lại dựa trên một thuộc tính (property) được chỉ định.

Ví dụ:

Input:

JavaScript
const users = [
  { id: 1, name: "Đạt", role: "master" },
  { id: 2, name: "Tèo", role: "user" },
  { id: 3, name: "Tí", role: "user" }
];
const property = "role";
Output:

JavaScript
{
  "master": [ { id: 1, name: "Đạt", role: "master" } ],
  "user": [ 
    { id: 2, name: "Tèo", role: "user" }, 
    { id: 3, name: "Tí", role: "user" } 
  ]
}
*/
function groupBy(array,property){
    const result = {}
    for(let item of array){
        const name = item[property]
        if(!result[name]){
            result[name]=[];
        }
        result[name].push(item)
    }
    return result
}

const users = [
  { id: 1, name: "Đạt", role: "master" },
  { id: 2, name: "Tèo", role: "user" },
  { id: 3, name: "Tí", role: "user" }
];
const property = "role";

console.log(groupBy(users,property))