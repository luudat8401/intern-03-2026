import User from "./models/user.class.js";
import Master from "./models/master.class.js";
import MasterManage from "./models/manageMaster.class.js";

const u1 = new User("Dat", 23, "student", "101");
const u2 = new User("Minh", 23, "worker", "102");

const master1 = new Master("Quang");
master1.addUser(u1);
master1.addUser(u2);

const manager = new MasterManage();
manager.addMaster(master1);

manager.showReport();