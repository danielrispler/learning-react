import axios from 'axios';
import { values } from 'ramda';
import { Url, UserType, USER_TYPES } from './App.consts';

const loginServerRequest = async (username: string, password: string): Promise<UserType> => {
    const { data: userType } = (await axios.post(Url.server_base_path + "/login", { name: username, password }));
    if (values(USER_TYPES).includes(userType)) {
        return userType;
    }
    throw new Error('invalid user type');
};

const cookie_serverRequest = async (): Promise<string> =>
    (await axios.post(Url.server_base_path + "/readCookie")).data;

const serverRequests = {
    loginServerRequest,
    cookie_serverRequest
};

export default serverRequests;