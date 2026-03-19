import Master from "../models/master.class.js";
import { save, load } from "../service/storage.service.js";

let masters = load("masters") || []; // ⭐ SỬA: tránh lỗi nếu localStorage rỗng
let rooms = load("rooms") || []; // ⭐ SỬA: load thêm danh sách phòng

export function initOwnerUI() {

    const ownerInput = document.getElementById("owner-name-text");
    const addOwnerBtn = document.getElementById("owner-new-button");
    const ownerTable = document.querySelector("#landlords table");

    function renderOwners() {

        masters = load("masters") || [];
        rooms = load("rooms") || [];    
        ownerTable.innerHTML = `
            <tr>
                <th>STT</th>
                <th>Tên chủ trọ</th>
                <th>Các phòng</th>  
            </tr>
        `;
        masters.forEach((master, index) => {
            const ownerRooms = rooms.filter(room => room.ownerId === master.id);
            const roomList = ownerRooms.map(room => room.name).join(", ");
            ownerTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${master.name}</td>
                    <td>${roomList || "Chưa có phòng"}</td>
                </tr>
            `;
        });
    }

    renderOwners();

    addOwnerBtn.addEventListener("click", () => {
        const name = ownerInput.value.trim();
        if (!name) {
            alert("Vui lòng nhập tên chủ trọ");
            return;
        }
        const newMaster = new Master(name);
        masters.push(newMaster);
        save("masters", masters);
        renderOwners();
        ownerInput.value = "";
    });
}