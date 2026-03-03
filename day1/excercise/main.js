import User from "./models/user.class.js";
import Master from "./models/master.class.js";
import MasterManage from "./models/manageMaster.class.js";

const u1 = new User("Dat", 23, "student","yes", "101","2026-02-01");
const u2 = new User("Minh", 23, "worker","yes", "102", "2026-03-01");

//a) thông tin của người thuê nhá 
u1.showUserInfo();
u2.showUserInfo();
console.log("-----------------");
//b) thông tin thuê phòng của người thuê
u1.showUserRentInformation();
u2.showUserRentInformation();
console.log("-----------------");
//c) tính tổng tiền thuê nhà của chủ trọ
const master1 = new Master("Quang");
master1.addUser(u1);
master1.addUser(u2);

const manager = new MasterManage();
manager.addMaster(master1);

manager.showReport();
console.log("____________________________")
//d) thiết kế cách tính tiền mới nếu có người rời đi khi chưa hết tháng 

manager.showRentMoneyUserLeave(u1,master1);

