class MasterManage{
    constructor(){
        this.masters = [];
    }
    addMaster(master){
        this.masters.push(master);
    }
    showReport(){
        console.log("bao cao thong tin chu tro");
        for(const i of this.masters){
            i.showMasterInfo();
            console.log("Doanh thu :"+i.calculateRentMoney());
            console.log("-----------------");
        }
    }
    showRentMoneyUserLeave(user,master){
        user.updateRentStatus();
        console.log("Phong tro co nguoi roi di khi chua het thang");
        console.log("User: " + user.name);
        console.log("Rent money: " + user.getRentFee());
        master.kickUser(user);
    }    
}
export default MasterManage;