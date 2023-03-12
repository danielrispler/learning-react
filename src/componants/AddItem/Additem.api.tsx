import axios from 'axios';
import {Url} from './Additem.consts';

const addItem = async function(formData:FormData,price:string, name:string) : Promise<number>{
    return (await await axios.post(
        "http://localhost:8080/addItem/?name="+name+"&price="+price ,
        formData
        )).data 
}

export default addItem;
