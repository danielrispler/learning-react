import axios from 'axios';
import {Url} from 'src/common/common.consts';
import { Item } from 'src/common/common.types';

  
    
export const add = async(itemId:string,amount : number) : Promise<Item[]>=>
    (await axios.post(`${Url.serverBasePath}/cartAdd/${itemId}`,{amount})).data 

export const removeItem = async (itemId:string) : Promise<string>=>
     (await axios.post(`${Url.serverBasePath}/removeItem/${itemId}`)).data 

export const changePrice = async (itemId:string,price:number) : Promise<string>=>
     (await axios.post(`${Url.serverBasePath}/changePrice/${itemId}`,{price})).data 

export const modifystock = async (itemId:string,addsupply:number) : Promise<string>=>
     (await axios.post(`${Url.serverBasePath}/modifystock/${itemId}`,{ addsupply })).data 





