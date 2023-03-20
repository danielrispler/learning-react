import React from 'react'
import "./CartPage.css"
import ItemCart from "../ItemCart/ItemCart";
import { Link } from 'react-router-dom';
import {cart,nonDeleteitems,pay} from './CartPage.api';
import { Shipping } from './CartPage.consts';
import { Item,Cart } from 'src/common/common.types';
import { calculateTotalPrice } from './CartPage.utils';


type Props = {
    item ?: Item
}

type MyState = {    
    items: Item []; // like this
    cart: Cart []; 
    
};

class CartPage extends React.Component<Props,MyState> {
    constructor(props:Props) {
        super(props);
        this.state = {
          items: [],
          cart: []
        };
      }
    
    
      
      async componentDidMount() {
        this.setState({items: await nonDeleteitems()});      
        this.setState({cart: await cart()});    
      }

    serverRequestPay =async () =>
        await pay();
   
    render(){
        console.log(this.state.cart)
        const items = this.state.items
        const total = calculateTotalPrice(this.state.cart, items)
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
                        this.state.cart &&
                            this.state.cart.map(function(cart) {
                                const found = items.find((obj) => obj._id === cart.itemId);
                                if(found){
                                    
                                    return <ItemCart inCart={cart.itemsAmount} item={found} />;
                                }
                            })}
                        
                    </section>
                </div>

                <footer id="site-footer">
                    <div className="container clearfix">
                        <div >
                        <div className="left">
                            <h2 className="subtotal">Subtotal: <span>{total} &#8362;</span></h2>
                            <h3 className="tax">Taxes (5%): <span>{tax} &#8362;</span></h3>
                            <h3 className="shipping">Shipping: <span>{Shipping.shipping} &#8362;</span></h3>
                        </div>

                        <div className="right">
                            <h1 className="total">Total: <span>{finalPrice} &#8362;</span></h1>
                            
                            <Link to="/pay" >
                                <button disabled={total == 0} id="pay" className='btn' onClick={() => this.serverRequestPay()}>Checkout</button>
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

export default CartPage