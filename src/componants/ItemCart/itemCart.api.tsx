import axios from 'axios';
import {Url} from './itemCart.consts';

type ItemType = {
    _id  :      number    
  item  :    string 
  price :    number    
  imgNumber :number    
  left     : number        
  itemid : number    
  }
  
    
const RemoveProductCompletely = async function(itemId:string,num : number) : Promise<ItemType[]>{
    
    return (await axios.post(Url.server_base_path+"/cart/RemoveProductCompletely/" + itemId,{num})).data
   
    
}
const readCookie = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/readCookie")).data 
}
const modifyOneItemCart = async function(itemId:string,num : number) : Promise<ItemType[]>{
    return (await axios.post(Url.server_base_path+"/cart/modifyOneItemCart/"+ itemId,
    {num})).data 
}

const serverRequests = {
    RemoveProductCompletely,
    readCookie,
    modifyOneItemCart

  }

  
  
  export default serverRequests;


