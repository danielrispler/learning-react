import axios from 'axios';
import {Url} from './HomeAdmin.consts';

type ItemType = {
    _id  :      number    
  item  :    string 
  price :    number    
  imgNumber :number    
  left     : number        
  itemId : number    
  }

const items_serverRequest = async function() : Promise<ItemType[]>{
    return (await axios.get(Url.server_base_path+"/nonDeleteitems")).data 
}
const cookie_serverRequest = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/readCookie")).data 
}

const serverRequests = {
    items_serverRequest,
    cookie_serverRequest
  }
  
  export default serverRequests;


