import Room from "../models/room.class.js";
import { save, load } from "../service/storage.service.js";
let rooms = load("rooms") || [];

export function initRoomUI() {

    const btnAddRoom = document.getElementById("add-room");
    const inputRoomName = document.getElementById("input-room-name");
    const inputRoomPrice = document.getElementById("input-room-price");
    const roomTable = document.querySelector("#rooms table");
    

    function renderRooms() {

        roomTable.innerHTML = `
            <tr>
                <th>STT</th>
                <th>Tên phòng</th>
                <th>Giá phòng</th>
            </tr>
        `;

        rooms.forEach((room, index) => {

            roomTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${room.name}</td>
                    <td>${room.price}</td>
                </tr>
            `;

        });

    }
    renderRooms();

    btnAddRoom.addEventListener("click", () => {

        const name = inputRoomName.value.trim();
        const price = Number(inputRoomPrice.value);
        if (!name) {
            alert("Vui lòng nhập tên phòng");
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert("Giá phòng không hợp lệ");
            return;
        }
        const newRoom = new Room(name, price);
        rooms.push(newRoom);
        save("rooms", rooms);
        renderRooms();
        inputRoomName.value = "";
        inputRoomPrice.value = "";

    });

}