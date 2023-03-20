import axios from 'axios';
import { Item } from 'src/common/common.types';
import {Url} from 'src/common/common.consts';


  
    
export const removeProductCompletely = async(itemId:string,num : number) : Promise<Item[]>=>
     (await axios.post(`${Url.serverBasePath}/removeCartItem/${itemId}`,{num})).data

export const modifyOneItemCart = async (itemId:string,num : number) : Promise<Item[]>=>
    (await axios.post(`${Url.serverBasePath}/modifyCartItem/${itemId}`,{num})).data 





