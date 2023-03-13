import axios from 'axios';
import { Url } from 'src/common/common.consts';
import { RecieptSession } from 'src/common/common.types';


export const reciepts = async (userId:string) : Promise<RecieptSession[]>=>
    (await axios.get(`${Url.serverBasePath}/reciepts/${userId}`)).data


export const readCookie = async () : Promise<string>=>
    (await axios.post(`${Url.serverBasePath}/readCookie`)).data 
