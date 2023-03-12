import axios from 'axios';
import {Url} from './ItemAdmin.consts';

type ItemType = {
    _id  :      number    
  item  :    string 
  price :    number    
  imgNumber :number    
  left     : number        
  itemId : number    
  }
  
    
const add = async function(itemId:string,amount : number) : Promise<ItemType[]>{
    return (await axios.post(Url.server_base_path+"/cart/add/" + itemId,{amount})).data
}
const cookie = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/readCookie")).data 
}
const removeItem = async function(itemId:string) : Promise<string>{
    return (await axios.post(Url.server_base_path+"/items/removeItem/" + itemId)).data 
}
const changePrice = async function(itemId:string,price:number) : Promise<string>{
    return (await axios.post(Url.server_base_path+"/items/changePrice/" + itemId,{price})).data 
}
const modifystock = async function(itemId:string,addsupply:number) : Promise<string>{
    return (await axios.post(Url.server_base_path+"/items/modifystock/" + itemId,{ addsupply })).data 
}

const serverRequests = {
    add,
    cookie,
    removeItem,
    changePrice,
    modifystock
  }

  
  
  export default serverRequests;


