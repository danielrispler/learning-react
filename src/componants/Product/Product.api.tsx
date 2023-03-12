import axios from 'axios';
import {Url} from './Product.consts';

type ItemType = {
    _id  :      number    
  item  :    string 
  price :    number    
  imgNumber :number    
  left     : number        
  itemId : number    
  }
  
    
const add_serverRequest = async function(itemId:string,amount : number) : Promise<ItemType[]>{
    
    return (await axios.post(Url.server_base_path+"/cart/add/" + itemId,{amount})).data
   
    
}
const cookie_serverRequest = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/readCookie")).data 
}

const serverRequests = {
    add_serverRequest,
    cookie_serverRequest
  }

  
  
  export default serverRequests;


