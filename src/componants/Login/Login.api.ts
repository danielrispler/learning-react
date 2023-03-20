import axios from "axios";
import { values } from "ramda";
import { Url } from "src/common/common.consts";
import { UserType, USER_TYPES } from "src/common/common.types";

export const login = async (username: string, password: string): Promise<UserType> => {
  const { data: userType } = (await axios.post(`${Url.serverBasePath}/login`, { name: username, password }));
  if (values(USER_TYPES).includes(userType)) {
    return userType;
  }
  throw new Error('invalid user type');
};