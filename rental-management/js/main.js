// "use strict"

// import User from "./models/user.class.js";
// import Master from "./models/master.class.js";
// import MasterManage from "./models/manageMaster.class.js";
// import Room from "./models/room.class.js";
// const room101 = new Room("101", 1000);
// const room102 = new Room("102", 900);

// const u1 = new User("Dat", 23, "student", room101,"2026-01-01");
// const u2 = new User("Minh", 23, "worker", room101, "2026-03-01");

// //a) thông tin của người thuê nhá 
// u1.showUserInfo();
// u2.showUserInfo();
// console.log("-----------------");
// //b) thông tin thuê phòng của người thuê
// u1.showUserRentInformation();
// u2.showUserRentInformation();
// console.log("-----------------");
// //c) tính tổng tiền thuê nhà của chủ trọ
// const master1 = new Master("Quang");
// master1.addUser(u1);
// master1.addUser(u2);

// master1.addRoom(room101);
// master1.addRoom(room102);

// const manager = new MasterManage();
// manager.addMaster(master1);

// manager.showReport();
// console.log("____________________________")
// //d) thiết kế cách tính tiền mới nếu có người rời đi khi chưa hết tháng 
// master1.showRentMoneyUserLeave(u1);
// //e) phòng trọ có nhiều phòng có giá khác nhau, 
// master1.showHighestIncomeRoom();
// master1.showAvailableRooms();
"use strict";

import { initMenu } from "./ui/menu.ui.js";
import { initOwnerUI } from "./ui/master.ui.js";

    initMenu();
    initOwnerUI();
    