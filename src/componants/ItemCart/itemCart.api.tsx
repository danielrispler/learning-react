import axios from 'axios';
import { Item } from 'src/common/common.types';
import {Url} from 'src/common/common.consts';


  
    
export const removeProductCompletely = async(itemId:string,num : number) : Promise<Item[]>=>
     (await axios.post(`${Url.serverBasePath}/cart/RemoveProductCompletely/${itemId}`,{num})).data
   
export const readCookie = async () : Promise<string>=>
    (await axios.post(`${Url.serverBasePath}/readCookie`)).data 

export const modifyOneItemCart = async (itemId:string,num : number) : Promise<Item[]>=>
    (await axios.post(`${Url.serverBasePath}/cart/modifyOneItemCart/${itemId}`,{num})).data 





