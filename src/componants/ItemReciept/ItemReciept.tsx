import React from 'react'
import "./ItemReciept.css"
import serverRequests from './ItemReciept.api';

type Props = {
    
}

type Reciept_Item ={
	userid   : number 
	recieptid : number 
	itemid   : number 
	incart   : number 
}

type ItemType = {
	_id  :      number        
	item  :    string 
	price :    number    
	imgNumber :number    
	left     : number        
	itemid : number    
}

type MyState = {    
    reciept_id :string,
    reciepts: Reciept_Item []; 
    items: ItemType [];
    
     
    
};


   
  
class ItemReciept extends React.Component<Props,MyState> {
    constructor(props:Props) {
        super(props);
        const current_url = window.location.href
        const myArray = current_url.split("/");
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
    
    componentDidMount() {
        serverRequests.recieptsItems(this.state.reciept_id).then( (response) => {
            this.setState({
                reciepts: response
              });
            
          });
          serverRequests.allItems().then( (response) => {
            this.setState({
                items: response
              });
              
            
          });
         serverRequests.readCookie().then( (response) => {
              if(response == "false"){
                    window.location.reload()
                }
              
            
          })
      }

      

    render(){
        var temp = this.state.items
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
                    {this.state.reciepts.map(function(item, i) {
                        
                        const found = temp.find((obj) => {
                            if(obj.itemid == item.itemid){
                                return obj
                            }
                        });
                        if(found != null){
                            return (
                                <tr>
                                    
                                    <td>{found.item}</td>
                                    <td>{item.incart}</td>
                                    <td>{found.price} &#8362;</td>
                                    <td>{found.price * item.incart} &#8362;</td>
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
