import axios from 'axios';
import { Url } from 'src/common/common.consts';

export const readCookie = async () : Promise<string>=>
    (await axios.post(`${Url.serverBasePath}/readCookie`)).data 


