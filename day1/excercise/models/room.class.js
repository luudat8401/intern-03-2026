class Room {
    constructor(roomName, price){
        this.roomName = roomName;
        this.price = price;
        this.isAvailable = true;
    }
    markAsRented(){
        this.isAvailable = false;
    }
    markAsAvailable(){
        this.isAvailable = true;
    }
}

export default Room;