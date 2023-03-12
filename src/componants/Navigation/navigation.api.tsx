import axios from 'axios';
import { Url } from './navigation.consts';

const deleteCookie = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/deleteCookie")).data
}

const serverRequests = {
    deleteCookie
  }
  
  export default serverRequests;