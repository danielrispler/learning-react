import axios from 'axios';
import { Item } from 'src/common/common.types';
import { SERVER_URL } from './home.consts';

const itemsServerRequest = async (): Promise<Item[]> =>
  (await axios.get("/api/nonDeleteitems")).data;

const cookieServerRequest = async (): Promise<string> =>
  (await axios.post(`${SERVER_URL.serverBasePath}/readCookie`)).data;

export default {
  itemsServerRequest,
  cookieServerRequest
};


