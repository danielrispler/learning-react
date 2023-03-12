import React from 'react';
import './ItemAdmin.css';
import serverRequests from './ItemAdmin.api';

type Props = {
  item: ItemType;
};
type ItemType = {
  _id: number;
  item: string;
  price: number;
  imgNumber: number;
  left: number;
  itemId: number;
};

type MyState = {
  item: ItemType;
  addsupply: number;
  amount: number;
  flag:boolean

};
class ItemAdmin extends React.Component<Props, MyState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      item: this.props.item,
      addsupply: 0,
      amount: 0,
      flag:true
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
    serverRequests.cookie().then((value) => {
      if (value == "false") {
        
        this.setState({flag:false}) 
      }
    })
    
  }


  removeItem = async () => {
    let item = this.state.item;
    console.log(item);
    serverRequests.cookie().then((value) => {
      if (value != "false") {
        serverRequests.removeItem(String(item._id))
      }
      window.location.reload();
    })
  };

  addToCart = async () => {
    const item = this.state.item;
    serverRequests.cookie().then((value) => {
      if (value != "false") {
          if (this.state.amount > 0) {
            if (item.left >= this.state.amount)
              serverRequests.add(String(item._id),this.state.amount).then(() => { 
                this.setState({ amount: 0 });
                window.location.reload()
              });
            else
              alert("we only have " + item.left + " in stack");
          }
          else
            alert("you can add only positive number of items to cart");
        }
      else{
        window.location.reload();
      } 
    })
    

  };

  changePrice = async () => {
    const item = this.state.item;
    serverRequests.cookie().then((value) => {
      if (value != "false") {
        if (item.price > 0) {
          serverRequests.changePrice(String(item._id),item.price)
          window.location.reload();
          alert("price change!");
        }
        else
          alert("price need to be positive!");
        }
      else{
        window.location.reload();
      } 
    })
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
       if (Number.isNaN(Number(e.target.value)) == false) {
      let item1 = this.state.item;
      item1.price = Number(e.target.value);
      this.setState({ item: item1 });
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
    let item = this.state.item;
    serverRequests.cookie().then((value) => {
      if (value != "false") {
        if (item.left + this.state.addsupply >= 0) {
          serverRequests.modifystock(String(item._id),this.state.addsupply).then(() => {
            window.location.reload();
            this.setState({ amount: 0 });
          });
        }
        else
          alert("the minimun number for items in stack is 0");
        }
      else{
        window.location.reload();
      } 
    })

  };

  importAll(r: __WebpackModuleApi.RequireContext): any {
    return r.keys().map(r);
  }


  render() {
    const images = this.importAll(require.context('../../images', false, /\.(jpg)$/));
    var image;
    for (let i = 0; i < images.length; i++) {

      if (images[i].includes("media/" + this.state.item.imgNumber + ".")) {

        image = images[i];
      }
    }

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