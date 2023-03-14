import axios from 'axios';
import { values } from 'ramda';
import { Url } from 'src/common/common.consts';
import { UserType, USER_TYPES } from './App.consts';

export const loginServerRequest = async (username: string, password: string): Promise<UserType> => {
    const { data: userType } = (await axios.post(Url.serverBasePath + "/login", { name: username, password }));
    if (values(USER_TYPES).includes(userType)) {
        return userType;
    }
    throw new Error('invalid user type');
};

export const cookie_serverRequest = async (): Promise<string> =>
    (await axios.post(`${Url.serverBasePath}/readCookie`)).data;

