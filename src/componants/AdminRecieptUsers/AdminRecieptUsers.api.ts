import axios from 'axios';
import { Url } from '../../common/common.consts';
import {User} from './AdminRecieptUsers.types'

export const usersIds = async(): Promise<User[]>=> 
    (await axios.get(`${Url.serverBasePath}/users`)).data;


export const readCookie = async(): Promise<string> =>
    (await axios.post(`${Url.serverBasePath}/readCookie`)).data;





