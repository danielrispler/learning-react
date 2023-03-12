import axios from 'axios';
import { Url } from './Reciepts.consts';
type Reciept_Session= {
	userid    : number       
	recieptid  :number      
	totalprice: number      
	date      : Date 
}

const reciepts = async function(userId:string) : Promise<Reciept_Session[]>{
    return (await axios.get(Url.server_base_path+"/reciepts/" + userId)).data
}

const readCookie = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/readCookie")).data 
}

const serverRequests = {
    reciepts,
    readCookie
  }
  
  export default serverRequests;