import axios from 'axios';
import { Url } from './Cart.consts';

type ItemType = {
	_id  :      number        
	item  :    string 
	price :    number    
	imgNumber :number    
	left     : number        
	itemid : number    
}

type CartType = {
	_id  :      number        
	userid  :    number   
    inCart : number 
    itemid  :    number     
	    
}
    
const cart = async function() : Promise<CartType[]>{
    return (await axios.get(Url.server_base_path+"/cart")).data
}


const readCookie = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/readCookie")).data
}

const nonDeleteitems = async function() : Promise<ItemType[]>{
    return (await axios.get(Url.server_base_path+"/nonDeleteitems")).data
}

const pay = async function() : Promise<void>{
    await axios.post(Url.server_base_path+"/pay")
}

const serverRequests = {
    cart,
    readCookie,
    nonDeleteitems,
    pay

  }
  
  export default serverRequests;





