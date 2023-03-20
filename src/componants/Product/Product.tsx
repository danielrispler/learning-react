import React from 'react';
import { Item } from 'src/common/common.types';
import './Product.css';
import {addToCart} from './Product.api';

interface Props {
  item: Item;
};

interface MyState {
  item: Item;
  amount: number;
};

class Product extends React.Component<Props, MyState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      item: this.props.item,
      amount: 0
    };
    this.add = this.add.bind(this);
    this.rem = this.rem.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.setSelect = this.setSelect.bind(this);
  }

  addToCart = async () => {
    
      if (this.state.amount > 0) {
        if (this.state.item.stockAmount >= this.state.amount) {
          await addToCart(String(this.state.item._id), this.state.amount)
          this.setState({ amount: 0 });
        } else
          alert("we only have " + this.state.item.stockAmount + " in stack");
      } else
        alert("can not add negative number of items to cart");
    
  };

  setSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (Number.isNaN(Number(e.target.value)) === false) {
      this.setState({ amount: Number(e.target.value) });
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

  importAll(r: __WebpackModuleApi.RequireContext): any {
    return r.keys().map(r);
  }

  render() {
    const images = this.importAll(require.context('../../images', false, /\.(jpg)$/));
    const image = images.find((image:string) => image.includes(`media/${this.state.item.imageName}.`));
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div >
          <div className='items'>
            <div className='split'>
              <div className="itemName">{this.state.item.name}</div>

              <div className="price">{this.state.item.price} &#8362;</div>
            </div>


            <div className='fixed'>
              <img src={image} alt="product image" width="140" height="140" />
            </div>


            <form className='quen1'>

              <a onClick={this.rem} >
                <span className="glyphicon glyphicon-minus" />
              </a>

              <input type="text" id="select" className='spaceBetweenAddCart' onChange={this.setSelect} value={this.state.amount.toString()}>

              </input>
              <a onClick={this.add} className="spaceBetween">
                <span className="glyphicon glyphicon-plus" />
              </a>

            </form>

            <a onClick={this.addToCart} className="main_btn_m hvr-underline-from-left_m">
              add
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;