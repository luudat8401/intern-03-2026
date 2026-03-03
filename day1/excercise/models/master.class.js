class Master{
    constructor(name){
        this.name = name;
        this.users = [];
    }
    addUser(user){
        this.users.push(user);
    }
    calculateRentMoney(){
        let total = 0;
        for(const i of this.users){
            total+= i.getRentFee();
        }
        return total;
    }
    showUsers(){
        console.log(`thong tin nguoi thue nha ${this.name}`);
        this.users.forEach(t=> console.log(t.getInfo()))
    }
}
export default Master;