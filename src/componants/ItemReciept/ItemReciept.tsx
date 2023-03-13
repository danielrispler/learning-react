import React from 'react'
import "./ItemReciept.css"
import {readCookie,recieptsItems,allItems} from './ItemReciept.api';
import { Item, RecieptItem } from 'src/common/common.types';

type State = {    
    reciept_id :string,
    reciepts: RecieptItem []; 
    items: Item [];
};
class ItemReciept extends React.Component<object,State> {
    constructor(props:object) {
        super(props);
        const myArray = window.location.href.split("/");
        if(myArray[3] == "AdminReciepts"){
            this.state = {
                items: [],
                reciepts: [],
                reciept_id : myArray[7]
            };
        }else{
            this.state = {
                items: [],
                reciepts: [],
                reciept_id : myArray[5]
            };
        }        
    }
    
    async componentDidMount() {
        this.setState({reciepts: await recieptsItems(this.state.reciept_id)});  
        this.setState({items: await allItems()});
        if(await readCookie() == "false"){
            window.location.reload()
        }  
    }
    render(){
        const items = this.state.items
        return (
            <div className='page'>
                <h1>all the reciepts</h1>

                <table id="customers">
                <tbody>
                <tr>
                    
                    <th>Name</th>
                    <th>In Cart</th>
                    <th>Price per unit</th>
                    <th>Total Price</th>
                    
                </tr>
                    {this.state.reciepts.map(function(reciept) {
                         const foundItem = items.find((item) => item._id === reciept.itemid);
                        if(foundItem){
                            return (
                                <tr>
                                    <td>{foundItem.item}</td>
                                    <td>{reciept.incart}</td>
                                    <td>{foundItem.price} &#8362;</td>
                                    <td>{foundItem.price * reciept.incart} &#8362;</td>
                                </tr>
                            );
                        }
                    })}
                </tbody>
                </table>
            </div>
        )
    }
}

export default ItemReciept
