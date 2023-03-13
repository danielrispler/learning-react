import axios from 'axios';
import { Url } from 'src/common/common.consts';

export const deleteCookie = async () : Promise<string>=>
    (await axios.post(`${Url.serverBasePath}/deleteCookie`)).data


