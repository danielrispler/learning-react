import React from 'react';
import './itemCart.css';
import serverRequests from './itemCart.api';

type Props = {
    item: ItemType
    inCart: number
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
    items: ItemType [];
    item: ItemType; 
  }

class ItemCart extends React.Component<Props,MyState> {
    
    constructor(props:Props) {
      super(props);
      this.state = {
        items: [],
        item: this.props.item
      };
      this.remToCart = this.remToCart.bind(this)
      this.remOneFromCart = this.remOneFromCart.bind(this)
      this.addOneToCart = this.addOneToCart.bind(this)      
    }

    remToCart=async() =>{
        serverRequests.readCookie().then( (response) => {
          if(response != "false"){
            serverRequests.RemoveProductCompletely(String(this.state.item._id),this.props.inCart).then((response) =>{
              this.setState({ items: response, item: response[this.props.item._id-1] })
            })
          }
          window.location.reload()
      })
    }

      remOneFromCart=async() =>{
        let item = this.state.item;
        serverRequests.readCookie()
          .then( (response) => {
          if(response!= "false"){
            serverRequests.modifyOneItemCart(String(item._id), 1).then((response) => {
              this.setState({ items: response, item: response[this.props.item._id-1] })
            })
            }
            window.location.reload()
      })
      
      }

      addOneToCart() {
        let item = this.state.item;
        serverRequests.readCookie().then( (response) => {
          if(response!= "false"){
            if(item.left > 0)
              serverRequests.modifyOneItemCart(String(item._id), -1).then((response) => {
                this.setState({ items: response, item: response[this.props.item._id-1] })
              })
            else{
                alert("no more "+ item.item+ " in stack");
            }
            window.location.reload()
          }
        })
      }
  
      
    importAll(r: __WebpackModuleApi.RequireContext): any {
    return r.keys().map(r);
    }
      
    render() {
        const images = this.importAll(require.context('../../images', false, /\.(png|jpe?g|svg)$/));
        var image
        for (let i = 0; i < images.length; i++) {
          if(images[i].includes("media/" + this.state.item.imgNumber)){
              image = images[i]
          }
        }
        return (
            <article className="product">
                <header>
                <a className="remove" onClick={this.remToCart}>
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