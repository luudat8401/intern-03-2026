class User{
    constructor(name, age, job, rent, roomName, moveInDate, moveOutDate = null){
        this.name = name;
        this.age = age;
        this.job = job;
        this.rent = rent;
        this.roomName = roomName;
        this.moveInDate = new Date(moveInDate);
        this.moveOutDate = null;
    }
    getRentFee(){
        const monthlyPrice = this.job === "student" ? 900 : 1000;
        const dailyPrice = 50;
        if(this.rent === "yes"){
            return monthlyPrice;
        }
        // update cách tính tiền phòng nếu người 
        if(this.rent === "no" && this.moveOutDate){
            if(this.moveInDate.getMonth() === this.moveOutDate.getMonth() && this.moveInDate.getFullYear() === this.moveOutDate.getFullYear()){
                const daysStayed = Math.ceil(
                (this.moveOutDate - this.moveInDate) / (1000 * 60 * 60 * 24)
                );
                if(daysStayed < 15){
                    return daysStayed * dailyPrice;
                }
                else {
                    return monthlyPrice;
                }
            }
            else {
                const rentThisMonth = this.moveOutDate.getDate();
                if(rentThisMonth < 15){
                    return rentThisMonth * dailyPrice;
                }
                else {                    
                    return monthlyPrice;
                }
            }
        }
    }
    getInfo(){
        return `${this.name} - ${this.age} - ${this.job} - ${this.rent} - ${this.roomName} - ${this.moveInDate} - ${this.moveOutDate} } `;
    }
    showUserInfo(){
        console.log(this.getInfo());
    }
    showUserRentInformation(){
        console.log(`${this.name} - ${this.age} - ${this.job} - ${this.rent} - ${this.roomName} - ${this.moveInDate} - ${this.moveOutDate} } `);
    }
    updateRentStatus(){
    if(this.rent === "yes"){
        this.rent = "no";
        this.moveOutDate = new Date(); 
    } else {
        this.rent = "yes";
        this.moveInDate = new Date(); 
        this.moveOutDate = null;
    }
    }
}
export default User;