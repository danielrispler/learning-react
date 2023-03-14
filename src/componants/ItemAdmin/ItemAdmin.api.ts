import axios from 'axios';
import {Url} from 'src/common/common.consts';
import { Item } from 'src/common/common.types';

  
    
export const add = async(itemId:string,amount : number) : Promise<Item[]>=>
    (await axios.post(`${Url.serverBasePath}/cart/add/` + itemId,{amount})).data

export const readCookie = async () : Promise<string>=>
     (await axios.post(`${Url.serverBasePath}/readCookie`)).data 

export const removeItem = async (itemId:string) : Promise<string>=>
     (await axios.post(`${Url.serverBasePath}/items/removeItem/` + itemId)).data 

export const changePrice = async (itemId:string,price:number) : Promise<string>=>
     (await axios.post(`${Url.serverBasePath}/items/changePrice/` + itemId,{price})).data 

export const modifystock = async (itemId:string,addsupply:number) : Promise<string>=>
     (await axios.post(`${Url.serverBasePath}/items/modifystock/` + itemId,{ addsupply })).data 





