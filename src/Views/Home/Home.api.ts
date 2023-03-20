import axios from 'axios';
import { Url } from 'src/common/common.consts';
import { Item } from 'src/common/common.types';

export const nonDeleteitems = async (): Promise<Item[]> =>
  (await axios.get(`${Url.serverBasePath}/nonDeleteitems`)).data;






