import React from 'react';
import './ItemAdmin.css';
import {add,readCookie,removeItem,changePrice,modifystock} from './ItemAdmin.api';
import { Item } from 'src/common/common.types';

type Props = {
  item: Item;
};

type MyState = {
  item: Item;
  addsupply: number;
  amount: number;

};
class ItemAdmin extends React.Component<Props, MyState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      item: this.props.item,
      addsupply: 0,
      amount: 0,
    };
    this.addPrice = this.addPrice.bind(this);
    this.remPrice = this.remPrice.bind(this);
    this.add = this.add.bind(this);
    this.rem = this.rem.bind(this);
    this.incCap = this.incCap.bind(this);
    this.decCap = this.decCap.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.confirmSupplyChange = this.confirmSupplyChange.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.changePrice = this.changePrice.bind(this);

    this.setSelect = this.setSelect.bind(this);
    this.setSupply = this.setSupply.bind(this);
    this.setPrice = this.setPrice.bind(this);



  }

  checkCookie = async()=>{
      if (await readCookie() == "false") {
        window.location.reload() 
      }
  }


  removeItem = async () => {
    this.checkCookie()
    await removeItem(String(this.state.item._id))
  }

  addToCart = async () => {
    this.checkCookie()
    if (this.state.amount > 0) {
      if (this.state.item.left >= this.state.amount){
        await add(String(this.state.item._id),this.state.amount)
        this.setState({ amount: 0 });
        window.location.reload()
      }else{
        alert("we only have " + this.state.item.left + " in stack");
      }
    }else{
      alert("you can add only positive number of items to cart")
    }  
  };

  changePrice = async () => {
    this.checkCookie() 
    if (this.state.item.price > 0) {
      await changePrice(String(this.state.item._id),this.state.item.price)
      window.location.reload();
      alert("price change!");
    }
    else
      alert("price need to be positive!");
  }
       
   
  

  addPrice() {
    let item1 = this.state.item;
    item1.price += 1;
    this.setState({ item: item1 });
    console.log(this.state.item.price);
  }


  remPrice() {
    let item1 = this.state.item;
    item1.price -= 1;
    this.setState({ item: item1 });
  }

  setSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (Number.isNaN(Number(e.target.value)) == false) {
      this.setState({ amount: Number(e.target.value) });
    }
  }

  setSupply(e: React.ChangeEvent<HTMLInputElement>) {
    if (Number.isNaN(Number(e.target.value)) == false) {
      this.setState({ addsupply: Number(e.target.value) });
    }
  }

  setPrice(e: React.ChangeEvent<HTMLInputElement>) {
    if (!Number.isNaN(Number(e.target.value))) {
      this.state.item.price = Number(e.target.value);
      this.setState({ item: this.state.item });
    }
  }

  add() {
    let item1 = this.state.item;
    this.setState({ amount: this.state.amount + 1 });
    this.setState({ item: item1 });

  }


  rem() {
    let item1 = this.state.item;
    this.setState({ amount: this.state.amount - 1 });
    this.setState({ item: item1 });
  }

  incCap() {
    let item1 = this.state.item;
    this.setState({ addsupply: this.state.addsupply + 1 });
    this.setState({ item: item1 });
  }
  decCap() {
    let item1 = this.state.item;
    this.setState({ addsupply: this.state.addsupply - 1 });
    this.setState({ item: item1 });
  }

  confirmSupplyChange = async () => {
    this.checkCookie()
    if (this.state.item.left + this.state.addsupply >= 0) {
      await modifystock(String(this.state.item._id),this.state.addsupply)
      window.location.reload();
      this.setState({ amount: 0 });
    }
    else
      alert("the minimun number for items in stack is 0");
  }
    

  importAll(r: __WebpackModuleApi.RequireContext): any {
    return r.keys().map(r);
  }


  render() {
    const images = this.importAll(require.context('../../images', false, /\.(jpg)$/));
    const image = images.find((image:string) => image.includes(`media/${this.state.item.imgNumber}.`));
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
          <div className='itemsAdmin'>
            <div className='headerAdmin'>
              <div className="itemNameAdmin">{this.state.item.item}</div>
              <a onClick={this.removeItem} >
                remove item
              </a>
            </div>

            <img src={image} alt="product image" width="140" height="140" />


            <div className="panel-footer">
              <div>change price</div>
              <form className='priceAdmin'>

                <div className='quenAdmin'>
                  <a onClick={this.remPrice} >
                    <span className="glyphicon glyphicon-minus" />
                  </a>

                  <input type="text" className='spaceBetweenAddCart' onChange={this.setPrice} value={this.state.item.price.toString()}>

                  </input>
                  <a onClick={this.addPrice} className="spaceBetweenAdmin">
                    <span className="glyphicon glyphicon-plus" />
                  </a>
                </div>
                <a onClick={this.changePrice} className="addtocartAdmin">
                  confirm
                </a>
              </form>
              <div>amount</div>
              <form className="priceAdmin" >

                <div className='quenAdmin'>

                  <a onClick={this.rem} >
                    <span className="glyphicon glyphicon-minus" />
                  </a>

                  <input type="text" id="select" className='spaceBetweenAddCart' onChange={this.setSelect} value={this.state.amount.toString()}>

                  </input>
                  <a onClick={this.add} className="spaceBetweenAdmin">
                    <span className="glyphicon glyphicon-plus" />
                  </a>
                </div>
                <a onClick={this.addToCart} className="addtocartAdmin">
                  add to cart
                </a>
              </form>
              <div>{this.state.item.left} in stock &nbsp;</div>
              <form className="priceAdmin">

                <div className='quenAdmin'>
                  <a onClick={this.decCap} >
                    <span className="glyphicon glyphicon-minus" />
                  </a>

                  <input type="text" pattern="[0-9]+" id="select" className='spaceBetweenAddCart' onChange={this.setSupply} value={this.state.addsupply.toString()}>

                  </input>
                  <a onClick={this.incCap} className="spaceBetweenAdmin">
                    <span className="glyphicon glyphicon-plus" />
                  </a>
                </div>
                <a onClick={this.confirmSupplyChange} className="addtocartAdmin">
                  confirm
                </a>
              </form>
            </div>


          </div>

       
      </div>
    );
  }
}

export default ItemAdmin;