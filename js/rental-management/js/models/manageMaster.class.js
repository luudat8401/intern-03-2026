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
}
export default MasterManage;