class Master{
    static isExisted = 1;
    constructor(name){
        this.id = Master.isExisted++;
        this.name = name;
        this.users = [];
    }
    addUser(user){
        this.users.push(user);
        user.room.markAsRented(user);
        user.updateRentStatus();
    }
    calculateRentMoney(){
        let total = 0;
        for(const i of this.users){
            total+= i.getRentFee();
        }
        return total;
    }
    showMasterInfo(){
        console.log( `chu tro ${this.name}`);
    }
    showUsers(){
        console.log(`thong tin nguoi thue nha ${this.name}`);
        this.users.forEach(t=> console.log(t.getInfo()))
    }
    showHighestIncomeRoom(){
        if(this.rooms.length === 0){
            console.log("khong co phong tro nao");
            return;
        }
        const rentedRooms = this.rooms.filter(room => room.isRented);
        if(rentedRooms.length === 0){
            console.log("khong co phong tro nao dang duoc thue");
            return;
        }
        else {
            let highestIncomeRoom = rentedRooms[0];
            let highestIncome = 0;
            rentedRooms.forEach(room => {
                room.income = room.Income();
                if(room.income > highestIncome){
                    highestIncome = room.income;
                    highestIncomeRoom = room;
                }
            });
            console.log(`phong tro co doanh thu cao nhat: ${highestIncomeRoom.name} - Doanh thu: ${highestIncomeRoom.price}`);
        }
        
    }
    showAvailableRooms(){
        const availableRooms = this.rooms.filter(room => !room.isRented);
        availableRooms.forEach(room => {
            console.log(`Phong trống: ${room.name}`);
        });
    }
    showRentMoneyUserLeave(user){
        user.updateRentStatus();
        console.log("Phong tro co nguoi roi di khi chua het thang");
        console.log("User: " + user.name);
        console.log("Rent money: " + user.getRentFee());
        this.users = this.users.filter(u => u !== user);
        user.room.markAsAvailable();
        user.updateRentStatus();
    } 
}
export default Master;