class User{
    constructor(name, age, job, roomName){
        this.name = name;
        this.age = age;
        this.job = job;
        this.roomName = roomName;
    }
    getRentFee(){
        if(this.job=="student") return 900;
        else return 1000
    }
    getInfo(){
        return `${this.name} - ${this.age} - ${this.job} - ${this.roomName} `;
    }
}
export default User;