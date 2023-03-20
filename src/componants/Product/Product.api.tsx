import axios from 'axios';
import { Url } from 'src/common/common.consts';
import { Item } from 'src/common/common.types';

export const addToCart = async (itemId:string,amount : number) : Promise<Item[]>=>
  (await axios.post(`${Url.serverBasePath}/cartAdd/${itemId}`,{amount})).data







