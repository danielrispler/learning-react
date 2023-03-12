import axios from 'axios';
import {Url} from './about.consts';

const cookie_serverRequest = async function() : Promise<string>{
    return (await axios.post(Url.server_base_path+"/readCookie")).data 
}

export default cookie_serverRequest;
