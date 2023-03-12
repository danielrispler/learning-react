import axios from 'axios';
import { Url } from './AdminRecieptUsers.const';

export interface User {
    id: number;
    name: string;
};

const usersIds = async function (): Promise<User[]> {
    return (await axios.get(Url.server_base_path + "/usersIds")).data;
};

const readCookie = async function (): Promise<string> {
    return (await axios.post(Url.server_base_path + "/readCookie")).data;
};

const serverRequests = {
    usersIds,
    readCookie
};

export default serverRequests;


