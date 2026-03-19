class Room{
    static nextId = 1;
    constructor(name, price,ownerId){
        this.id = Room.nextId++; // phân biệt giữa các room khác nhau
        this.name = name;
        this.price = price;
        this.isRented = false;
        this.user=null;
        this.ownerId = ownerId;
    }
    markAsRented(user){
        this.isRented = true;
        this.user=user ;
    }
    markAsAvailable(){
        this.isRented = false;
        this.user = null;
    }
    Income(){
        if(this.isRented){
            return this.price;
        }
    }
}
export default Room;