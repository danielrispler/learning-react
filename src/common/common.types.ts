export interface Item {
    _id: number;
    item: string;
    price: number;
    imgNumber: number;
    left: number;
};

export interface Cart  {
	_id  :      number        
	userid  :    number   
    inCart : number 
    itemid  :    number     
	    
}

export interface RecieptItem {
	userid   : number 
	recieptid : number 
	itemid   : number 
	incart   : number 
}
export interface RecieptSession {
	userid    : number       
	recieptid  :number      
	totalprice: number      
	date      : Date 
}