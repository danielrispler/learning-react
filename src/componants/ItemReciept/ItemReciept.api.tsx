import axios from 'axios';
import { Url } from 'src/common/common.consts';
import { Item, RecieptItem } from 'src/common/common.types';
 
    
export const recieptsItems = async (recieptId:string) : Promise<RecieptItem[]>=>
    (await axios.get(`${Url.serverBasePath}/recieptsItems/${recieptId}`)).data  

export const readCookie = async () : Promise<string>=>
    (await axios.post(`${Url.serverBasePath}/readCookie`)).data 

export const allItems = async () : Promise<Item[]>=>
    (await axios.get(`${Url.serverBasePath}/allItems`)).data 




