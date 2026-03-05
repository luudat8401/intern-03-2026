import Master from "../models/master.class.js";
import { save, load } from "../service/storage.service.js";

let masters = load("masters");

export function initOwnerUI() {

    const ownerInput = document.getElementById("owner-name-text");
    const addOwnerBtn = document.getElementById("owner-new-button");
    const ownerTable = document.querySelector("#landlords table");

    function renderOwners() {
        ownerTable.innerHTML = `
            <tr>
                <th>STT</th>
                <th>Tên chủ trọ</th>
            </tr>
        `;

        masters.forEach((master, index) => {
            ownerTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${master.name}</td>
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