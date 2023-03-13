import { Cart, Item } from "src/common/common.types";

export const calculateTotalPrice= (carts:Cart[], items:Item[]):number => {
    let total = 0;
    if(carts != null){
        carts.map(function(cart) {                
            const found = items.find((obj) => obj._id === cart.itemid);
            if(found){
                total += cart.inCart*found.price
            }
        })
    }
    return total
}