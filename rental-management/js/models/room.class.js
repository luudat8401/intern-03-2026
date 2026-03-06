class Room{
    constructor(name, price,owner){
        this.name = name;
        this.price = price;
        this.isRented = false;
        this.user=null;
        this.owner = owner;
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