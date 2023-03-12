import axios from 'axios';
import {Url} from './ItemReciept.consts';

type Reciept_Item ={
	userid   : number 
	recieptid : number 
	itemid   : number 
	incart   : number 
}

type ItemType = {
	_id  :      number        
	item  :    string 
	price :    number    
	imgNumber :number    
	left     : number        
	itemid : number    
}
  
    
const recieptsItems = async function(recieptId:string) : Promise<Reciept_Item[]>{
    
    return (await axios.get(Url.server_base_path+"/recieptsItems/" + recieptId)).data
   
    
}
const readCookie = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/readCookie")).data 
}
const allItems = async function() : Promise<ItemType[]>{
    return (await axios.get(Url.server_base_path+"/allItems")).data 
}

const serverRequests = {
    recieptsItems,
    readCookie,
    allItems

  }

  
  
  export default serverRequests;


