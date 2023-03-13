import axios from 'axios';
import { Url } from 'src/common/common.consts';
import { Item,Cart } from 'src/common/common.types';

export const cart = async() : Promise<Cart[]>=>
    (await axios.get(Url.serverBasePath+"/cart")).data

export const readCookie = async() : Promise<string>=>
    (await axios.post(Url.serverBasePath+"/readCookie")).data


export const nonDeleteitems = async() : Promise<Item[]>=>
    (await axios.get(Url.serverBasePath+"/nonDeleteitems")).data


export const pay = async() : Promise<void>=>
    await axios.post(Url.serverBasePath+"/pay")






