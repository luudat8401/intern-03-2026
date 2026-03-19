import Room from "../models/room.class.js";
import { save, load } from "../service/storage.service.js";

let rooms = load("rooms") || [];
let masters = load("masters") || [];

export function initRoomUI() {

    const btnAddRoom = document.getElementById("add-room");
    const inputRoomName = document.getElementById("input-room-name");
    const inputRoomPrice = document.getElementById("input-room-price");
    const selectOwner = document.getElementById("select-owner");
    const roomTable = document.querySelector("#rooms table");

    function renderOwners() {
        masters = load("masters") || []; 
        selectOwner.innerHTML = `
            <option value="" disabled selected>Chọn chủ phòng</option>
        `;
        masters.forEach(master => {
            selectOwner.innerHTML += `
                <option value="${master.id}">
                    ${master.name}
                </option>
            `;
        });
    }
    document.addEventListener("openRooms", () => {
        renderOwners();
    });

    function renderRooms() {
        roomTable.innerHTML = `
            <tr>
                <th>STT</th>
                <th>Tên phòng</th>
                <th>Giá phòng</th>
                <th>Chủ trọ</th>
            </tr>
        `;
        rooms.forEach((room, index) => {
            const owner = masters.find(m => m.id === room.ownerId);
            roomTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${room.name}</td>
                    <td>${room.price}</td>
                    <td>${owner ? owner.name : ""}</td>
                </tr>
            `;
        });
    }

    renderOwners();
    renderRooms();

    btnAddRoom.addEventListener("click", () => {
        const name = inputRoomName.value.trim();
        const price = Number(inputRoomPrice.value);
        const ownerId = Number(selectOwner.value);

        if (!name) {
            alert("Vui lòng nhập tên phòng");
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert("Giá phòng không hợp lệ");
            return;
        }

        if (!ownerId) {
            alert("Vui lòng chọn chủ trọ");
            return;
        }

        const newRoom = new Room(name, price, ownerId);

        rooms.push(newRoom);
        save("rooms", rooms);

        renderRooms();

        inputRoomName.value = "";
        inputRoomPrice.value = "";
        selectOwner.value = "";
    });

}