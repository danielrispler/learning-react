import axios from 'axios';
import { Url } from '../../common/common.consts';

export const addItem = async(formData:FormData,price:string, name:string) : Promise<number> =>
    (await axios.post(`${Url.serverBasePath}/addItem/?name=${name}&price=${price}` ,formData)).data 

