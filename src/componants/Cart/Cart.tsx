import React from 'react'
import "./Cart.css"
import ItemCart from "../ItemCart/ItemCart";
import { Link } from 'react-router-dom';
import serverRequests from './Cart.api';
import { Shipping } from './Cart.consts';

type Props = {
    item ?: ItemType
}
type ItemType = {
	_id  :      number        
	item  :    string 
	price :    number    
	imgNumber :number    
	left     : number        
	itemid : number    
}

type CartType = {
	_id  :      number        
	userid  :    number   
    inCart : number 
    itemid  :    number     
	    
}

type MyState = {    
    items: ItemType []; // like this
    cart: CartType []; 
    
};



class Cart extends React.Component<Props,MyState> {
    constructor(props:Props) {
        super(props);
        this.state = {
          items: [],
          cart: []
        };
  
        this.serverRequestPay = this.serverRequestPay.bind(this);
    }
    
    
      
      componentDidMount() {
        serverRequests.nonDeleteitems().then( (response) => {
            this.setState({
                items: response
              });
            
          });
          serverRequests.cart().then( (response) => {
            this.setState({
                cart: response
              });
            
          });
          serverRequests.readCookie()
              .then( (response) => {
              if(response == "false"){
                    window.location.reload()
                }
              
            
          })
      }

      serverRequestPay() {
        serverRequests.pay();
    }
   
    render(){
        var temp = this.state.items

        var total = 0
        if(this.state.cart != null){
            {this.state.cart.map(function(item) {                
                const found = temp.find((obj) => {
                    if(obj.itemid == item.itemid){
                        return item
                    }
                });
                if(found!=null)
                total += item.inCart*found.price
            })}
        }
        const totalPice = total
        const tax = (total * 0.05).toFixed(2)
        const finalPrice = (total * 1.05 + Shipping.shipping).toFixed(2)
        if(total == 0){
            document.addEventListener("DOMContentLoaded", function() {
                (document.getElementById('pay')!as HTMLButtonElement).disabled = true;
            })
        }
        else
        {
            document.addEventListener("DOMContentLoaded", function() {
                (document.getElementById("pay")!as HTMLButtonElement).disabled = false;
                
                
            })
        }
        return (
            <div>
                <header id="site-header">
                    <div className="container">
                    <h1>Shopping cart </h1>
                    
                    </div>
                </header>

                <div className="container">
                    <section id="cart">
                        {
                        this.state.cart != null &&
                            this.state.cart.map(function(item, i) {
                                const found = temp.find((obj) => {
                    
                                    if(obj.itemid == item.itemid){
                                        return item
                                    }
                                });
                                if(found!=null){
                                    return <ItemCart inCart={item.inCart} item={found} />;
                                }
                            })}
                        
                    </section>
                </div>

                <footer id="site-footer">
                    <div className="container clearfix">
                        <div >
                        <div className="left">
                            <h2 className="subtotal">Subtotal: <span>{totalPice} &#8362;</span></h2>
                            <h3 className="tax">Taxes (5%): <span>{tax} &#8362;</span></h3>
                            <h3 className="shipping">Shipping: <span>{Shipping.shipping} &#8362;</span></h3>
                        </div>

                        <div className="right">
                            <h1 className="total">Total: <span>{finalPrice} &#8362;</span></h1>
                            
                            <Link to="/pay" >
                                <button disabled={totalPice == 0} id="pay" className='btn' onClick={() => this.serverRequestPay()}>Checkout</button>
                            </Link>
                        </div>
                        </div>

                    </div>
                    
                </footer>
                <Link to="/">
                        <button id="header-menu-btn" className='returnReciept'>return</button>
                    </Link>
                
            </div>
        )
    }
}

export default Cart