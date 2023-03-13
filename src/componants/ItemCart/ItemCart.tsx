import React from 'react';
import './itemCart.css';
import {readCookie,removeProductCompletely,modifyOneItemCart} from './itemCart.api';
import { Item } from 'src/common/common.types';

interface Props  {
    item: Item
    inCart: number
}

interface MyState {    
    items: Item [];
    item: Item; 
  }

class ItemCart extends React.Component<Props,MyState> {  
    constructor(props:Props) {
      super(props);
      this.state = {
        items: [],
        item: this.props.item
      };
      this.remFromCart = this.remFromCart.bind(this)
      this.remOneFromCart = this.remOneFromCart.bind(this)
      this.addOneToCart = this.addOneToCart.bind(this)
    }

    checkCookie = async()=>{
      if (await readCookie() == "false") {
        window.location.reload() 
        return false
      }
      return true
  }

    remFromCart=async() =>{
      if(await this.checkCookie()){
        const response = await removeProductCompletely(String(this.state.item._id),this.props.inCart)
        this.setState({ items: response, item: response[this.props.item._id-1] }) 
        window.location.reload() 
      }
    }

    remOneFromCart=async() =>{
      if(await this.checkCookie()){
        const response = await modifyOneItemCart(String(this.state.item._id), 1)
        this.setState({ items: response, item: response[this.props.item._id-1] })
        window.location.reload()
      }
    }

    addOneToCart=async() => {
      if(await this.checkCookie()){
        if(this.state.item.left > 0){
          const response = await modifyOneItemCart(String(this.state.item._id), -1)
          this.setState({ items: response, item: response[this.props.item._id-1] })
          window.location.reload()
        }else{
            alert("no more "+ this.state.item.item+ " in stack");
        }
      } 
    }
  
      
    importAll(r: __WebpackModuleApi.RequireContext): any {
    return r.keys().map(r);
    }
      
    render() {
        const images = this.importAll(require.context('../../images', false, /\.(png|jpe?g|svg)$/));
        const image = images.find((image:string) => image.includes(`media/${this.state.item.imgNumber}.`));
        return (
            <article className="product">
                <header>
                <a className="remove" onClick={this.remFromCart}>
                    <img src={image} alt= "product image" width="340" height="140"></img>

                    <h3>Remove product</h3>
                </a>
                </header>

                <div className="content">

                <h1>{this.state.item.item}</h1>

                
                </div>

                <footer className="content">
                <a onClick={this.remOneFromCart} >
                    <span className="qt-minus" >-</span>
                </a> 
                <div className="qt">
                    {this.props.inCart}
                </div>
                <a onClick={this.addOneToCart} >
                    <span className="qt-plus" >+</span>
                </a>    

                <h2 className="full-price">
                {this.state.item.price * this.props.inCart} &#8362;
                </h2>

                <h2 className="price">
                    {this.state.item.price} &#8362;
                </h2>
                </footer>
            </article>
        )
    }
}

export default ItemCart