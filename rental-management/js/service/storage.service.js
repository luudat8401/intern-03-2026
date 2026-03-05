export const save= (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}
// lưu dữ liệu dạng string vào local, phải đổi data về String 
export const load = (key) => {
    try{
        const data = localStorage.getItem(key);
        if (!data){
            return [];
        } 
        const checkValid = JSON.parse(data);
        const valid = checkValid.filter(item => item.name && item.name.trim() !== "");
        return valid;
    }catch(error){
        console.error("Lỗi khi tải dữ liệu:", error);
        return [];
    }
}
// lấy dữ liệu từ từ local, đổi từ string về dạng arr/obj